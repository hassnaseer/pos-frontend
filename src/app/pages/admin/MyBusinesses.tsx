import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, Search, Plus, Edit, Trash2,
  ChevronLeft, ChevronRight, BarChart3, ShoppingCart, Package,
  Ticket, FileText, TrendingUp, Clock, Settings, Download, Eye, Building2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
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

export default function MyBusinesses() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  const itemsPerPage = 12;

  const [businesses, setBusinesses] = useState([
    {
      id: "BUS-001",
      name: "Tech Store Downtown",
      type: "Retail",
      location: "123 Main St, New York, NY",
      phone: "+1 555-0101",
      status: "Active",
      staff: 8,
      revenue: "$45,230",
      createdDate: "2023-01-15",
    },
    {
      id: "BUS-002",
      name: "Tech Store Midtown",
      type: "Retail",
      location: "456 Park Ave, New York, NY",
      phone: "+1 555-0102",
      status: "Active",
      staff: 12,
      revenue: "$67,890",
      createdDate: "2023-06-20",
    },
    {
      id: "BUS-003",
      name: "Tech Repair Center",
      type: "Service Center",
      location: "789 Broadway, New York, NY",
      phone: "+1 555-0103",
      status: "Active",
      staff: 6,
      revenue: "$32,450",
      createdDate: "2023-09-10",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    phone: "",
  });

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);

  const handleAddBusiness = () => {
    const newBusiness = {
      id: `BUS-${String(businesses.length + 1).padStart(3, '0')}`,
      ...formData,
      status: "Active",
      staff: 0,
      revenue: "$0",
      createdDate: new Date().toISOString().split('T')[0],
    };
    setBusinesses([newBusiness, ...businesses]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditBusiness = () => {
    setBusinesses(businesses.map(b =>
      b.id === selectedBusiness.id ? { ...selectedBusiness, ...formData } : b
    ));
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteBusiness = (id: string) => {
    if (confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      setBusinesses(businesses.filter(b => b.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", location: "", phone: "" });
    setSelectedBusiness(null);
  };

  const openEditDialog = (business: any) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      type: business.type,
      location: business.location,
      phone: business.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="flex">
        

        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">My Businesses</h2>
                <p className="text-gray-600">Manage all your franchise locations</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="size-4 mr-2" />
                Add Business
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{business.name}</h3>
                        <p className="text-sm text-gray-500">{business.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      business.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {business.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <p className="text-sm text-gray-600">{business.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">{business.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Staff</p>
                      <p className="font-bold text-lg">{business.staff}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue (This Month)</p>
                      <p className="font-bold text-lg text-green-600">{business.revenue}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(business)}
                    >
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBusiness(business.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4 mr-2" />
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-blue-600" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tech Store Downtown"
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Service Center">Service Center</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Salon">Salon</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="123 Main St, City, State"
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAddBusiness} className="bg-blue-600 hover:bg-blue-700">Add Business</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Service Center">Service Center</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Salon">Salon</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditBusiness} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
