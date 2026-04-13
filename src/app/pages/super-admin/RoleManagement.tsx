import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { Switch } from "../../components/ui/switch";

export default function RoleManagement() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [roles, setRoles] = useState([
    {
      id: "role-001",
      name: "Admin",
      description: "Business Owner - Full access to all business features",
      permissions: {
        posSales: true,
        viewOrders: true,
        processRefunds: true,
        ticketsCreate: true,
        ticketsUpdate: true,
        productsManage: true,
        productsView: true,
        customersManage: true,
        staffManagement: true,
        reports: true,
        settings: true,
      }
    },
    {
      id: "role-002",
      name: "Manager",
      description: "Store Manager - Most permissions except settings",
      permissions: {
        posSales: true,
        viewOrders: true,
        processRefunds: true,
        ticketsCreate: true,
        ticketsUpdate: true,
        productsManage: true,
        productsView: true,
        customersManage: true,
        staffManagement: false,
        reports: true,
        settings: false,
      }
    },
    {
      id: "role-003",
      name: "Cashier",
      description: "Sales Staff - POS and basic operations",
      permissions: {
        posSales: true,
        viewOrders: false,
        processRefunds: false,
        ticketsCreate: false,
        ticketsUpdate: false,
        productsManage: false,
        productsView: true,
        customersManage: true,
        staffManagement: false,
        reports: false,
        settings: false,
      }
    },
    {
      id: "role-004",
      name: "Technician",
      description: "Repair Staff - Ticket management only",
      permissions: {
        posSales: false,
        viewOrders: false,
        processRefunds: false,
        ticketsCreate: true,
        ticketsUpdate: true,
        productsManage: false,
        productsView: true,
        customersManage: true,
        staffManagement: false,
        reports: false,
        settings: false,
      }
    },
  ]);

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

  const updatePermission = (roleId: string, permission: string, value: boolean) => {
    setRoles(roles.map(role =>
      role.id === roleId
        ? { ...role, permissions: { ...role.permissions, [permission]: value } }
        : role
    ));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="flex">
        

        {/* Main Content */}
        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-1">Role Management</h2>
              <p className="text-gray-600">Configure permissions for each staff role</p>
            </div>

            {/* Roles */}
            <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{role.name}</h3>
                        <p className="text-gray-600">{role.description}</p>
                      </div>
                      <Shield className="size-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-semibold mb-4">Permissions</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(permissionLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{label}</span>
                          <Switch
                            checked={role.permissions[key as keyof typeof role.permissions]}
                            onCheckedChange={(checked) => updatePermission(role.id, key, checked)}
                            disabled={role.name === "Admin" && key === "settings"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
