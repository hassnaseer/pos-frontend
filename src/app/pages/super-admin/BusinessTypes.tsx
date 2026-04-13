import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, Search, Plus, Edit, Trash2, CheckCircle2, XCircle
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
import { Switch } from "../../components/ui/switch";

export default function BusinessTypes() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);

  const [businessTypes, setBusinessTypes] = useState([
    {
      id: "BT-001",
      name: "Repair Shop",
      description: "Repair and maintenance services",
      icon: "🔧",
      posModule: true,
      inventoryModule: true,
      ticketSystem: true,
      tableManagement: false,
      appointmentSystem: true,
      status: "Active",
      businesses: 156
    },
    {
      id: "BT-002",
      name: "Factory Industry",
      description: "Manufacturing and industrial operations",
      icon: "🏭",
      posModule: true,
      inventoryModule: true,
      ticketSystem: false,
      tableManagement: false,
      appointmentSystem: false,
      status: "Active",
      businesses: 89
    },
    {
      id: "BT-003",
      name: "Pharmacy",
      description: "Medical and pharmaceutical services",
      icon: "💊",
      posModule: true,
      inventoryModule: true,
      ticketSystem: false,
      tableManagement: false,
      appointmentSystem: false,
      status: "Active",
      businesses: 234
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    posModule: true,
    inventoryModule: true,
    ticketSystem: false,
    tableManagement: false,
    appointmentSystem: false,
    status: "Active",
  });

  const filteredTypes = businessTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddType = () => {
    const newType = {
      id: `BT-${String(businessTypes.length + 1).padStart(3, '0')}`,
      ...formData,
      businesses: 0
    };
    setBusinessTypes([...businessTypes, newType]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditType = () => {
    setBusinessTypes(businessTypes.map(t =>
      t.id === selectedType.id ? { ...t, ...formData } : t
    ));
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteType = () => {
    setBusinessTypes(businessTypes.filter(t => t.id !== selectedType.id));
    setIsDeleteDialogOpen(false);
    setSelectedType(null);
  };

  const openEditDialog = (type: any) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      icon: type.icon,
      posModule: type.posModule,
      inventoryModule: type.inventoryModule,
      ticketSystem: type.ticketSystem,
      tableManagement: type.tableManagement,
      appointmentSystem: type.appointmentSystem,
      status: type.status,
    });
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
      icon: "",
      posModule: true,
      inventoryModule: true,
      ticketSystem: false,
      tableManagement: false,
      appointmentSystem: false,
      status: "Active",
    });
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTypes.map((type) => (
                <div key={type.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{type.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg">{type.name}</h3>
                        <p className="text-sm text-gray-500">{type.businesses} businesses</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      type.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {type.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{type.description}</p>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">POS Module</span>
                      {type.posModule ? <CheckCircle2 className="size-5 text-green-600" /> : <XCircle className="size-5 text-gray-300" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Inventory</span>
                      {type.inventoryModule ? <CheckCircle2 className="size-5 text-green-600" /> : <XCircle className="size-5 text-gray-300" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Ticket System</span>
                      {type.ticketSystem ? <CheckCircle2 className="size-5 text-green-600" /> : <XCircle className="size-5 text-gray-300" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Table Management</span>
                      {type.tableManagement ? <CheckCircle2 className="size-5 text-green-600" /> : <XCircle className="size-5 text-gray-300" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Appointments</span>
                      {type.appointmentSystem ? <CheckCircle2 className="size-5 text-green-600" /> : <XCircle className="size-5 text-gray-300" />}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(type)}
                    >
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(type)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={type.businesses > 0}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Retail, Restaurant"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (Emoji)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🛍️"
                />
              </div>
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
              <h4 className="font-semibold">Enabled Modules</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="pos">POS Module</Label>
                <Switch
                  id="pos"
                  checked={formData.posModule}
                  onCheckedChange={(checked) => setFormData({ ...formData, posModule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inventory">Inventory Module</Label>
                <Switch
                  id="inventory"
                  checked={formData.inventoryModule}
                  onCheckedChange={(checked) => setFormData({ ...formData, inventoryModule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ticket">Ticket System</Label>
                <Switch
                  id="ticket"
                  checked={formData.ticketSystem}
                  onCheckedChange={(checked) => setFormData({ ...formData, ticketSystem: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="table">Table Management</Label>
                <Switch
                  id="table"
                  checked={formData.tableManagement}
                  onCheckedChange={(checked) => setFormData({ ...formData, tableManagement: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="appointment">Appointment System</Label>
                <Switch
                  id="appointment"
                  checked={formData.appointmentSystem}
                  onCheckedChange={(checked) => setFormData({ ...formData, appointmentSystem: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddType} className="bg-blue-600 hover:bg-blue-700">Add Type</Button>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (Emoji)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
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
              <h4 className="font-semibold">Enabled Modules</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-pos">POS Module</Label>
                <Switch
                  id="edit-pos"
                  checked={formData.posModule}
                  onCheckedChange={(checked) => setFormData({ ...formData, posModule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-inventory">Inventory Module</Label>
                <Switch
                  id="edit-inventory"
                  checked={formData.inventoryModule}
                  onCheckedChange={(checked) => setFormData({ ...formData, inventoryModule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-ticket">Ticket System</Label>
                <Switch
                  id="edit-ticket"
                  checked={formData.ticketSystem}
                  onCheckedChange={(checked) => setFormData({ ...formData, ticketSystem: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-table">Table Management</Label>
                <Switch
                  id="edit-table"
                  checked={formData.tableManagement}
                  onCheckedChange={(checked) => setFormData({ ...formData, tableManagement: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-appointment">Appointment System</Label>
                <Switch
                  id="edit-appointment"
                  checked={formData.appointmentSystem}
                  onCheckedChange={(checked) => setFormData({ ...formData, appointmentSystem: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditType} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteType} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
