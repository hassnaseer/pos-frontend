import { useEffect, useState } from "react";
import {
  Search, Plus, Shield
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  fetchRoles,
  updateRole,
  RoleQueryDto
} from "../../../store/super-admin/roleManagementSlice";

const PROTECTED_ROLES = ["super-admin", "admin"];

const permissionLabels = {
  posSales: "POS / Sales",
  viewOrders: "View All Orders",
  processRefunds: "Process Refunds",
  ticketsCreate: "Create Tickets",
  ticketsUpdate: "Update Tickets",
  productsManage: "Manage Products",
  productsView: "View Products",
  customersManage: "Manage Customers",
  staffManagement: "Staff Management",
  reports: "Reports & Analytics",
  settings: "System Settings",
};

export default function RoleManagement() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, pagination, loading, error } = useSelector((state: RootState) => state.superAdmin.roleManagement);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    const query: RoleQueryDto = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
    };
    dispatch(fetchRoles(query));
  }, [dispatch, currentPage, searchTerm]);

  // Initialize permissions when roles change
  useEffect(() => {
    const initialPermissions: Record<string, Record<string, boolean>> = {};
    roles.forEach(role => {
      if (role.permissions && typeof role.permissions === 'object') {
        initialPermissions[role.id] = role.permissions as Record<string, boolean>;
      }
    });
    setPermissions(initialPermissions);
  }, [roles]);

  const updatePermission = (roleId: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permission]: value
      }
    }));
    setEditingRole(roleId);
  };

  const handleSaveRole = async (roleId: string) => {
    try {
      const role = roles.find(r => r.id === roleId);
      if (!role) return;

      await dispatch(updateRole({
        id: roleId,
        data: {
          name: role.name,
          description: role.description,
          permissions: permissions[roleId] || {},
        },
      })).unwrap();
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const isProtectedRole = (roleName: string) => {
    return PROTECTED_ROLES.includes(roleName?.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-1">Role Management</h2>
              <p className="text-gray-600">Configure permissions for each staff role</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Roles */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading roles...</p>
              </div>
            )}

            {!loading && roles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">No roles found</p>
              </div>
            )}

            {!loading && roles.length > 0 && (
              <div className="space-y-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{role.name}</h3>
                          <p className="text-gray-600">{role.description}</p>
                          {isProtectedRole(role.name) && (
                            <p className="text-xs text-orange-600 mt-2">⚠️ System role - modifications may affect system functionality</p>
                          )}
                        </div>
                        <Shield className="size-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="font-semibold mb-4">Permissions</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{label}</span>
                            <input
                              type="checkbox"
                              checked={permissions[role.id]?.[key] ?? false}
                              onChange={(e) => updatePermission(role.id, key, e.target.checked)}
                              disabled={isProtectedRole(role.name)}
                              className="w-4 h-4"
                            />
                          </div>
                        ))}
                      </div>

                      {editingRole === role.id && (
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingRole(null)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleSaveRole(role.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
