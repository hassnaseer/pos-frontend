import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, Search, Plus, Edit, Trash2,
  Filter, Download, Eye, MoreVertical, ChevronLeft, ChevronRight,
  Ticket, Clock, CheckCircle2, AlertCircle, Wrench, Package, DollarSign
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
import { Textarea } from "../../components/ui/textarea";

export default function Tickets() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const isTechnician = user?.role === "technician";
  const isManager = user?.role === "manager";
  const isAdmin = user?.role === "admin";

  const itemsPerPage = 20;

  const [tickets, setTickets] = useState([
    {
      id: "TKT-20240045",
      ticketNumber: "TKT-20240045",
      customer: "Alice Brown",
      customerPhone: "+1 555-0201",
      deviceType: "iPhone 14 Pro",
      brand: "Apple",
      model: "iPhone 14 Pro",
      issue: "Screen replacement needed",
      priority: "High",
      status: "In Progress",
      assignedTo: "Mike Tech",
      estimatedCost: "$299",
      advancePayment: "$100",
      createdDate: "2024-04-08",
      expectedCompletion: "2024-04-12",
    },
    {
      id: "TKT-20240044",
      ticketNumber: "TKT-20240044",
      customer: "Bob Lee",
      customerPhone: "+1 555-0202",
      deviceType: "MacBook Air",
      brand: "Apple",
      model: "MacBook Air M2",
      issue: "Battery replacement",
      priority: "Normal",
      status: "Waiting for Parts",
      assignedTo: "Mike Tech",
      estimatedCost: "$199",
      advancePayment: "$50",
      createdDate: "2024-04-07",
      expectedCompletion: "2024-04-15",
    },
    {
      id: "TKT-20240043",
      ticketNumber: "TKT-20240043",
      customer: "Carol White",
      customerPhone: "+1 555-0203",
      deviceType: "Samsung S23",
      brand: "Samsung",
      model: "Galaxy S23",
      issue: "Water damage repair",
      priority: "Urgent",
      status: "Completed",
      assignedTo: "Mike Tech",
      estimatedCost: "$450",
      advancePayment: "$150",
      createdDate: "2024-04-05",
      expectedCompletion: "2024-04-10",
    },
    {
      id: "TKT-20240042",
      ticketNumber: "TKT-20240042",
      customer: "David Green",
      customerPhone: "+1 555-0204",
      deviceType: "iPad Pro",
      brand: "Apple",
      model: "iPad Pro 12.9",
      issue: "Charging port not working",
      priority: "Normal",
      status: "New",
      assignedTo: "Unassigned",
      estimatedCost: "$129",
      advancePayment: "$0",
      createdDate: "2024-04-10",
      expectedCompletion: "2024-04-14",
    },
  ]);

  const [formData, setFormData] = useState({
    customer: "",
    customerPhone: "",
    deviceType: "",
    brand: "",
    model: "",
    serialNumber: "",
    issue: "",
    accessories: "",
    estimatedCost: "",
    advancePayment: "",
    priority: "Normal",
    assignedTo: "",
    expectedCompletion: "",
    notes: "",
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;

    // Technicians only see their assigned tickets
    const matchesAssignment = !isTechnician || ticket.assignedTo === user?.name;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const handleAddTicket = () => {
    const newTicket = {
      id: `TKT-${String(tickets.length + 20240001).slice(-8)}`,
      ticketNumber: `TKT-${String(tickets.length + 20240001).slice(-8)}`,
      customer: formData.customer,
      customerPhone: formData.customerPhone,
      deviceType: formData.deviceType,
      brand: formData.brand,
      model: formData.model,
      issue: formData.issue,
      priority: formData.priority,
      status: "New",
      assignedTo: formData.assignedTo || "Unassigned",
      estimatedCost: formData.estimatedCost,
      advancePayment: formData.advancePayment,
      createdDate: new Date().toISOString().split('T')[0],
      expectedCompletion: formData.expectedCompletion,
    };
    setTickets([newTicket, ...tickets]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customer: "",
      customerPhone: "",
      deviceType: "",
      brand: "",
      model: "",
      serialNumber: "",
      issue: "",
      accessories: "",
      estimatedCost: "",
      advancePayment: "",
      priority: "Normal",
      assignedTo: "",
      expectedCompletion: "",
      notes: "",
    });
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-orange-100 text-orange-700";
      case "Waiting for Parts": return "bg-yellow-100 text-yellow-700";
      case "Completed": return "bg-green-100 text-green-700";
      case "Delivered": return "bg-gray-100 text-gray-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-600";
      case "High": return "text-orange-600";
      case "Normal": return "text-blue-600";
      case "Low": return "text-gray-600";
      default: return "text-gray-600";
    }
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
                <h2 className="text-2xl font-bold mb-1">
                  {isTechnician ? "My Assigned Tickets" : "Repair Tickets"}
                </h2>
                <p className="text-gray-600">Manage repair and service tickets</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="size-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      placeholder="Search by ticket #, customer, or device..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Waiting for Parts">Waiting for Parts</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
                </p>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Tickets Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-lg mb-1">{ticket.ticketNumber}</p>
                      <p className="text-sm text-gray-600">{ticket.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="size-4 text-gray-400" />
                      <span className="text-sm font-medium">{ticket.deviceType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{ticket.issue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-gray-400" />
                      <span className="text-sm font-semibold text-green-600">{ticket.estimatedCost}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Priority</p>
                      <p className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-medium">{ticket.expectedCompletion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                <div className="flex items-center gap-2">
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
                </div>
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

      {/* Add Ticket Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+1 555-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Device Type *</Label>
              <Input
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                placeholder="e.g. iPhone, Laptop"
              />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Apple, Samsung"
              />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. iPhone 14 Pro"
              />
            </div>
            <div className="space-y-2">
              <Label>Serial Number / IMEI</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Problem Description *</Label>
              <Textarea
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Cost</Label>
              <Input
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                placeholder="$0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Advance Payment</Label>
              <Input
                value={formData.advancePayment}
                onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                placeholder="$0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected Completion</Label>
              <Input
                type="date"
                value={formData.expectedCompletion}
                onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
              />
            </div>
            {(isManager || isAdmin) && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={formData.assignedTo} onValueChange={(v) => setFormData({ ...formData, assignedTo: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mike Tech">Mike Tech</SelectItem>
                    <SelectItem value="John Repair">John Repair</SelectItem>
                    <SelectItem value="Sarah Fix">Sarah Fix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTicket} className="bg-blue-600 hover:bg-blue-700">Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.ticketNumber}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
                <span className={`text-sm font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                  Priority: {selectedTicket.priority}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedTicket.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedTicket.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold">{selectedTicket.deviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Brand & Model</p>
                  <p className="font-semibold">{selectedTicket.brand} {selectedTicket.model}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Issue Description</p>
                <p className="font-medium">{selectedTicket.issue}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-bold text-green-600 text-xl">{selectedTicket.estimatedCost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advance Payment</p>
                  <p className="font-bold text-blue-600 text-xl">{selectedTicket.advancePayment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assigned To</p>
                  <p className="font-semibold">{selectedTicket.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Completion</p>
                  <p className="font-semibold">{selectedTicket.expectedCompletion}</p>
                </div>
              </div>

              {isTechnician && (
                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Update Status
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add Parts
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
