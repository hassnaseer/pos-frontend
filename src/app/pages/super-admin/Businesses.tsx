import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, Search, Plus, Edit, Trash2,
  Filter, Download, Eye, MoreVertical, ChevronLeft, ChevronRight
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusinessAsync,
  BusinessQueryDto
} from "../../../store/super-admin/businessesSlice";
import { fetchBusinessTypes } from "../../../store/super-admin/businessTypesSlice";

export default function Businesses() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { businesses, pagination, loading, error } = useSelector((state) => state.superAdmin.businesses);
  const { businessTypes } = useSelector((state) => state.superAdmin.businessTypes);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const itemsPerPage = 20;

  useEffect(() => {
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  useEffect(() => {
    const query: BusinessQueryDto = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      type: filterType !== "all" ? filterType : undefined,
      status: filterStatus !== "all" ? filterStatus : undefined,
    };
    dispatch(fetchBusinesses(query));
  }, [dispatch, currentPage, searchTerm, filterType, filterStatus]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    const query: BusinessQueryDto = {
      page: 1,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      type: filterType !== "all" ? filterType : undefined,
      status: filterStatus !== "all" ? filterStatus : undefined,
    };
    dispatch(fetchBusinesses(query));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    businessTypeId: "",
    type: "",
    plan: "Monthly",
    status: "Active",
  });

  const totalPages = pagination?.totalPages || 1;
  const startIndex = ((pagination?.page || 1) - 1) * (pagination?.limit || itemsPerPage);
  const paginatedBusinesses = businesses;

  const handleAddBusiness = async () => {
    try {
      await dispatch(createBusiness({
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        businessTypeId: formData.businessTypeId || undefined,
        plan: formData.plan,
        status: formData.status,
      })).unwrap();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create business:', error);
    }
  };

  const handleEditBusiness = async () => {
    if (!selectedBusiness) return;
    try {
      await dispatch(updateBusiness({
        id: selectedBusiness.id,
        data: {
          name: formData.name,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          businessTypeId: formData.businessTypeId || undefined,
          plan: formData.plan,
          status: formData.status,
        },
      })).unwrap();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update business:', error);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!selectedBusiness) return;
    try {
      await dispatch(deleteBusinessAsync(selectedBusiness.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedBusiness(null);
    } catch (error) {
      console.error('Failed to delete business:', error);
    }
  };

  const openEditDialog = (business: any) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      ownerName: business.owner,
      email: business.email,
      phone: business.phone || "",
      businessTypeId: business.businessTypeId || "",
      type: business.type,
      plan: business.plan,
      status: business.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (business: any) => {
    setSelectedBusiness(business);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ownerName: "",
      email: "",
      phone: "",
      businessTypeId: "",
      type: "",
      plan: "Monthly",
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
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Businesses</h2>
                <p className="text-gray-600">Manage all registered businesses</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                Add Business
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      placeholder="Search by name, owner, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-20"
                    />
                    <Button
                      onClick={handleSearch}
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      Search
                    </Button>
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} - {Math.min(startIndex + (pagination?.limit || itemsPerPage), pagination?.total || businesses.length)} of {pagination?.total || businesses.length} businesses
                </p>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-600">Loading businesses...</p>
                </div>
              )}
              {!loading && businesses.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-600">No businesses found</p>
                </div>
              )}
              {!loading && businesses.length > 0 && (
                <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Business</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Signup Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedBusinesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{business.name}</p>
                            <p className="text-sm text-gray-500">{business.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{business.owner}</p>
                            <p className="text-sm text-gray-500">{business.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {business.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{business.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            business.status === 'Active' ? 'bg-green-100 text-green-700' :
                            business.status === 'Trial' ? 'bg-yellow-100 text-yellow-700' :
                            business.status === 'Expired' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {business.signupDate}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          {business.revenue}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/super-admin/businesses/${business.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(business)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(business)}
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

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                  disabled={(pagination?.page || 1) === 1}
                >
                  <ChevronLeft className="size-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={(pagination?.page || 1) === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={(pagination?.page || 1) === page ? "bg-blue-600" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                  disabled={(pagination?.page || 1) === totalPages}
                >
                  Next
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Business Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter business name"
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name *</Label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Enter owner name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={formData.businessTypeId} onValueChange={(v) => setFormData({ ...formData, businessTypeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan *</Label>
              <Select value={formData.plan} onValueChange={(v) => setFormData({ ...formData, plan: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleAddBusiness} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating..." : "Add Business"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name *</Label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
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
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={formData.businessTypeId} onValueChange={(v) => setFormData({ ...formData, businessTypeId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan *</Label>
              <Select value={formData.plan} onValueChange={(v) => setFormData({ ...formData, plan: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleEditBusiness} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedBusiness?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleDeleteBusiness} className="bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
