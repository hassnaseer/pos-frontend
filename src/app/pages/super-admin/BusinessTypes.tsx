import { useEffect, useState } from "react";
import {
  Search, Plus, Edit, Trash2, CheckCircle2, XCircle
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
  fetchBusinessTypes,
  createBusinessType,
  updateBusinessType,
  deleteBusinessTypeAsync,
  BusinessTypeQueryDto,
  Permission
} from "../../../store/super-admin/businessTypesSlice";
import { fetchPermissions } from "../../../store/super-admin/permissionsSlice";

export default function BusinessTypes() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { businessTypes, pagination, loading, error } = useSelector((state: RootState) => state.superAdmin.businessTypes);
  const { permissions } = useSelector((state: RootState) => state.superAdmin.permissions);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  const itemsPerPage = 20;

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    const query: BusinessTypeQueryDto = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
    };
    dispatch(fetchBusinessTypes(query));
  }, [dispatch, currentPage, searchTerm]);

  const handleAddType = async () => {
    try {
      await dispatch(createBusinessType({
        name: formData.name,
        description: formData.description,
        active: formData.active,
        permissionIds: selectedPermissions,
      })).unwrap();
      setIsAddDialogOpen(false);
      resetForm();
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Failed to create business type:', error);
    }
  };

  const handleEditType = async () => {
    if (!selectedType) return;
    try {
      await dispatch(updateBusinessType({
        id: selectedType.id,
        data: {
          name: formData.name,
          description: formData.description,
          active: formData.active,
          permissionIds: selectedPermissions,
        },
      })).unwrap();
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Failed to update business type:', error);
    }
  };

  const handleDeleteType = async () => {
    if (!selectedType) return;
    try {
      await dispatch(deleteBusinessTypeAsync(selectedType.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedType(null);
    } catch (error) {
      console.error('Failed to delete business type:', error);
    }
  };

  const openEditDialog = (type: any) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      active: type.active ?? true,
    });
    setSelectedPermissions((type.permissions || []).map((p: Permission) => p.id));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (type: any) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      active: true,
    });
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const category = perm.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Business Types</h2>
                <p className="text-gray-600">Configure business types and their modules</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                Add Business Type
              </Button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search business types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Grid */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading business types...</p>
              </div>
            )}

            {!loading && businessTypes.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">No business types found</p>
              </div>
            )}

            {!loading && businessTypes.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessTypes.map((type) => (
                  <div key={type.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{type.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ml-2`}>
                        {type.active ? (
                          <span className="bg-green-100 text-green-700">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700">Inactive</span>
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{type.description || "No description"}</p>

                    {type.permissions && type.permissions.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Permissions ({type.permissions.length})</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.permissions.slice(0, 3).map((perm: Permission) => (
                            <span
                              key={perm.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              <CheckCircle2 className="size-3" />
                              {perm.name}
                            </span>
                          ))}
                          {type.permissions.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{type.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(type)}
                        disabled={loading}
                      >
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(type)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Business Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Business Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Retail, Restaurant"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this business type"
                rows={3}
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold">Permissions</h4>
              {Object.entries(groupedPermissions).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={`perm-${perm.id}`}
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-4 h-4 mt-1"
                            />
                            <label htmlFor={`perm-${perm.id}`} className="flex-1 cursor-pointer">
                              <p className="text-sm font-medium">{perm.name}</p>
                              {perm.description && (
                                <p className="text-xs text-gray-500">{perm.description}</p>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No permissions available</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleAddType} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating..." : "Add Business Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Business Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Business Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold">Permissions</h4>
              {Object.entries(groupedPermissions).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={`edit-perm-${perm.id}`}
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-4 h-4 mt-1"
                            />
                            <label htmlFor={`edit-perm-${perm.id}`} className="flex-1 cursor-pointer">
                              <p className="text-sm font-medium">{perm.name}</p>
                              {perm.description && (
                                <p className="text-xs text-gray-500">{perm.description}</p>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No permissions available</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleEditType} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business Type</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedType?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleDeleteType} className="bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
