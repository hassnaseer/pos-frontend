import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, Search, Plus, Edit, Trash2,
  ChevronLeft, ChevronRight, BarChart3, ShoppingCart, Package,
  Ticket, FileText, TrendingUp, Clock, Settings, Download, Eye
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";

interface StaffPermissions {
  canAccessPOS: boolean;
  canManageProducts: boolean;
  canManageTickets: boolean;
  canManageCustomers: boolean;
  canPostToSocialMedia: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  hireDate: string;
  permissions: StaffPermissions;
}

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const itemsPerPage = 20;

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "STF-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555-0101",
      role: "Cashier",
      status: "Active",
      hireDate: "2024-01-15",
      permissions: {
        canAccessPOS: true,
        canManageProducts: false,
        canManageTickets: false,
        canManageCustomers: true,
        canPostToSocialMedia: false,
      },
    },
    {
      id: "STF-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 555-0102",
      role: "Manager",
      status: "Active",
      hireDate: "2023-11-20",
      permissions: {
        canAccessPOS: true,
        canManageProducts: true,
        canManageTickets: true,
        canManageCustomers: true,
        canPostToSocialMedia: true,
      },
    },
    {
      id: "STF-003",
      name: "Mike Tech",
      email: "mike@example.com",
      phone: "+1 555-0103",
      role: "Technician",
      status: "Active",
      hireDate: "2024-02-10",
      permissions: {
        canAccessPOS: true,
        canManageProducts: true,
        canManageTickets: true,
        canManageCustomers: false,
        canPostToSocialMedia: false,
      },
    },
    {
      id: "STF-004",
      name: "Sarah Fix",
      email: "sarah@example.com",
      phone: "+1 555-0104",
      role: "Technician",
      status: "Active",
      hireDate: "2024-03-05",
      permissions: {
        canAccessPOS: true,
        canManageProducts: true,
        canManageTickets: true,
        canManageCustomers: false,
        canPostToSocialMedia: false,
      },
    },
    {
      id: "STF-005",
      name: "Bob Lee",
      email: "bob@example.com",
      phone: "+1 555-0105",
      role: "Cashier",
      status: "Inactive",
      hireDate: "2023-08-12",
      permissions: {
        canAccessPOS: true,
        canManageProducts: false,
        canManageTickets: false,
        canManageCustomers: true,
        canPostToSocialMedia: false,
      },
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Cashier",
    password: "",
    canAccessPOS: true,
    canManageProducts: false,
    canManageTickets: false,
    canManageCustomers: false,
    canPostToSocialMedia: false,
  });

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  const handleAddStaff = () => {
    const newMember: StaffMember = {
      id: `STF-${String(staff.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: "Active",
      hireDate: new Date().toISOString().split('T')[0],
      permissions: {
        canAccessPOS: formData.canAccessPOS,
        canManageProducts: formData.canManageProducts,
        canManageTickets: formData.canManageTickets,
        canManageCustomers: formData.canManageCustomers,
        canPostToSocialMedia: formData.canPostToSocialMedia,
      },
    };
    setStaff([newMember, ...staff]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditStaff = () => {
    if (!selectedStaff) return;

    setStaff(staff.map((member) =>
      member.id === selectedStaff.id
        ? {
            ...member,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            permissions: {
              canAccessPOS: formData.canAccessPOS,
              canManageProducts: formData.canManageProducts,
              canManageTickets: formData.canManageTickets,
              canManageCustomers: formData.canManageCustomers,
              canPostToSocialMedia: formData.canPostToSocialMedia,
            },
          }
        : member
    ));
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff(staff.filter(m => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Cashier",
      password: "",
      canAccessPOS: true,
      canManageProducts: false,
      canManageTickets: false,
      canManageCustomers: false,
      canPostToSocialMedia: false,
    });
    setSelectedStaff(null);
  };

  const openEditDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      password: "",
      canAccessPOS: member.permissions.canAccessPOS,
      canManageProducts: member.permissions.canManageProducts,
      canManageTickets: member.permissions.canManageTickets,
      canManageCustomers: member.permissions.canManageCustomers,
      canPostToSocialMedia: member.permissions.canPostToSocialMedia,
    });
    setIsEditDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager": return "bg-purple-100 text-purple-700";
      case "Cashier": return "bg-blue-100 text-blue-700";
      case "Technician": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="flex">
       

        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Staff Management</h2>
                <p className="text-gray-600">Manage your team members</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="size-4 mr-2" />
                Add Staff
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Staff ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold">{member.id}</td>
                        <td className="px-6 py-4 font-semibold">{member.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          {member.permissions.canAccessPOS && <Badge variant="secondary">POS</Badge>}
                          {member.permissions.canManageProducts && <Badge variant="secondary">Products</Badge>}
                          {member.permissions.canManageTickets && <Badge variant="secondary">Tickets</Badge>}
                          {member.permissions.canManageCustomers && <Badge variant="secondary">Customers</Badge>}
                          {member.permissions.canPostToSocialMedia && <Badge variant="secondary">Social</Badge>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStaff(member.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>POS Access</Label>
                <Switch checked={formData.canAccessPOS} onCheckedChange={(checked) => setFormData({ ...formData, canAccessPOS: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Products</Label>
                <Switch checked={formData.canManageProducts} onCheckedChange={(checked) => setFormData({ ...formData, canManageProducts: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Tickets</Label>
                <Switch checked={formData.canManageTickets} onCheckedChange={(checked) => setFormData({ ...formData, canManageTickets: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Customers</Label>
                <Switch checked={formData.canManageCustomers} onCheckedChange={(checked) => setFormData({ ...formData, canManageCustomers: checked })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Social Posting</Label>
                <Switch checked={formData.canPostToSocialMedia} onCheckedChange={(checked) => setFormData({ ...formData, canPostToSocialMedia: checked })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700">Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>POS Access</Label>
                <Switch checked={formData.canAccessPOS} onCheckedChange={(checked) => setFormData({ ...formData, canAccessPOS: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Products</Label>
                <Switch checked={formData.canManageProducts} onCheckedChange={(checked) => setFormData({ ...formData, canManageProducts: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Tickets</Label>
                <Switch checked={formData.canManageTickets} onCheckedChange={(checked) => setFormData({ ...formData, canManageTickets: checked })} />
              </div>
              <div className="space-y-2">
                <Label>Customers</Label>
                <Switch checked={formData.canManageCustomers} onCheckedChange={(checked) => setFormData({ ...formData, canManageCustomers: checked })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Social Posting</Label>
                <Switch checked={formData.canPostToSocialMedia} onCheckedChange={(checked) => setFormData({ ...formData, canPostToSocialMedia: checked })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditStaff} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
