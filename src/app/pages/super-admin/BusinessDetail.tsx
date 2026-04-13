import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, ArrowLeft, DollarSign, ShoppingCart,
  Clock, CheckCircle2, AlertCircle, Calendar, Edit, Ban, RefreshCw,
  Key, Mail, Phone, MapPin
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export default function BusinessDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Mock business data - in real app, fetch from API based on id
  const business = {
    id: "BUS-001",
    name: "Tech Retail Store",
    owner: "John Smith",
    email: "john@techretail.com",
    phone: "+1 555-0101",
    address: "123 Main St, New York, NY 10001",
    type: "Retail",
    plan: "Monthly",
    status: "Active",
    signupDate: "2024-01-15",
    expiryDate: "2024-05-15",
    lastLogin: "2024-04-10 14:23:45",
    revenue: "$12,450",
    totalOrders: 1247,
    totalCustomers: 456,
    totalProducts: 234,
    staffCount: 8,
  };

  const subscriptionHistory = [
    { id: 1, date: "2024-04-01", plan: "Monthly", amount: "$35", status: "Paid", method: "Credit Card" },
    { id: 2, date: "2024-03-01", plan: "Monthly", amount: "$35", status: "Paid", method: "Credit Card" },
    { id: 3, date: "2024-02-01", plan: "Monthly", amount: "$35", status: "Paid", method: "Credit Card" },
    { id: 4, date: "2024-01-15", plan: "Monthly", amount: "$0", status: "Trial", method: "N/A" },
  ];

  const activityLog = [
    { id: 1, action: "Payment received", details: "Monthly subscription payment", date: "2024-04-10 09:15:23", type: "payment" },
    { id: 2, action: "Staff added", details: "New cashier: Jane Doe", date: "2024-04-08 14:30:12", type: "staff" },
    { id: 3, action: "Login", details: "Owner logged in", date: "2024-04-10 14:23:45", type: "auth" },
    { id: 4, action: "Product added", details: "Added 45 new products", date: "2024-04-05 11:20:00", type: "product" },
    { id: 5, action: "Settings updated", details: "Changed business hours", date: "2024-04-03 16:45:30", type: "settings" },
  ];

  const staffMembers = [
    { id: 1, name: "John Smith", role: "Admin", email: "john@techretail.com", status: "Active", lastLogin: "2024-04-10 14:23:45" },
    { id: 2, name: "Jane Doe", role: "Cashier", email: "jane@techretail.com", status: "Active", lastLogin: "2024-04-10 12:15:20" },
    { id: 3, name: "Mike Johnson", role: "Manager", email: "mike@techretail.com", status: "Active", lastLogin: "2024-04-09 18:30:00" },
    { id: 4, name: "Sarah Williams", role: "Cashier", email: "sarah@techretail.com", status: "Inactive", lastLogin: "2024-03-28 10:00:00" },
  ];

  const [extendDays, setExtendDays] = useState("30");
  const [extendNote, setExtendNote] = useState("");

  const handleExtendSubscription = () => {
    console.log("Extending subscription by", extendDays, "days");
    setIsExtendDialogOpen(false);
  };

  const handleBlockBusiness = () => {
    console.log("Blocking business");
    setIsBlockDialogOpen(false);
  };

  const handleResetPassword = () => {
    console.log("Sending password reset email");
    setIsResetPasswordOpen(false);
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
            {/* Back Button */}
            <Link to="/super-admin/businesses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="size-4 mr-2" />
                Back to Businesses
              </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{business.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    business.status === 'Active' ? 'bg-green-100 text-green-700' :
                    business.status === 'Trial' ? 'bg-yellow-100 text-yellow-700' :
                    business.status === 'Expired' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {business.status}
                  </span>
                </div>
                <p className="text-gray-600">{business.id} • {business.type}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsExtendDialogOpen(true)}
                >
                  <Calendar className="size-4 mr-2" />
                  Extend Subscription
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsResetPasswordOpen(true)}
                >
                  <Key className="size-4 mr-2" />
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsBlockDialogOpen(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Ban className="size-4 mr-2" />
                  Block Business
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold">{business.revenue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold">{business.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customers</p>
                    <p className="text-xl font-bold">{business.totalCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Staff Members</p>
                    <p className="text-xl font-bold">{business.staffCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Business Info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg mb-4">Business Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Building2 className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Business Name</p>
                          <p className="font-semibold">{business.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Owner</p>
                          <p className="font-semibold">{business.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold">{business.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{business.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-semibold">{business.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg mb-4">Account Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Type</span>
                        <span className="font-semibold">{business.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan</span>
                        <span className="font-semibold">{business.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-semibold ${
                          business.status === 'Active' ? 'text-green-600' :
                          business.status === 'Trial' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {business.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signup Date</span>
                        <span className="font-semibold">{business.signupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date</span>
                        <span className="font-semibold">{business.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login</span>
                        <span className="font-semibold text-sm">{business.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Usage Statistics</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Products</p>
                      <p className="text-2xl font-bold">{business.totalProducts}</p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">23% of limit (1,000)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Customers</p>
                      <p className="text-2xl font-bold">{business.totalCustomers}</p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: '9%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">9% of limit (5,000)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Staff</p>
                      <p className="text-2xl font-bold">{business.staffCount}</p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '16%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">16% of limit (50)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Orders</p>
                      <p className="text-2xl font-bold">{business.totalOrders}</p>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Unlimited</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Subscription History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {subscriptionHistory.map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{sub.date}</td>
                            <td className="px-6 py-4 text-sm font-medium">{sub.plan}</td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">{sub.amount}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{sub.method}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                sub.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                sub.status === 'Trial' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Staff Tab */}
              <TabsContent value="staff" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Staff Members</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {staffMembers.map((staff) => (
                          <tr key={staff.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{staff.name}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {staff.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{staff.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{staff.lastLogin}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {staff.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Activity Log</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {activityLog.map((log) => (
                      <div key={log.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            log.type === 'payment' ? 'bg-green-100' :
                            log.type === 'staff' ? 'bg-blue-100' :
                            log.type === 'auth' ? 'bg-purple-100' :
                            log.type === 'product' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            {log.type === 'payment' && <DollarSign className="size-5 text-green-600" />}
                            {log.type === 'staff' && <Users className="size-5 text-blue-600" />}
                            {log.type === 'auth' && <Key className="size-5 text-purple-600" />}
                            {log.type === 'product' && <Building2 className="size-5 text-orange-600" />}
                            {log.type === 'settings' && <Settings className="size-5 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold mb-1">{log.action}</p>
                            <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                            <p className="text-xs text-gray-500">{log.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Extend Subscription Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Extend By (Days)</Label>
              <Select value={extendDays} onValueChange={setExtendDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days (1 month)</SelectItem>
                  <SelectItem value="90">90 days (3 months)</SelectItem>
                  <SelectItem value="180">180 days (6 months)</SelectItem>
                  <SelectItem value="365">365 days (1 year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Input
                value={extendNote}
                onChange={(e) => setExtendNote(e.target.value)}
                placeholder="Reason for extension"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Current expiry: <strong>{business.expiryDate}</strong>
              </p>
              <p className="text-sm text-blue-900 mt-1">
                New expiry will be approximately: <strong>{new Date(new Date(business.expiryDate).getTime() + parseInt(extendDays) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtendDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExtendSubscription} className="bg-blue-600 hover:bg-blue-700">
              Extend Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Business Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Business</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to block <strong>{business.name}</strong>? This will prevent all staff members from logging in.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900 font-semibold">⚠️ Warning:</p>
              <p className="text-sm text-red-800 mt-1">
                The business owner and all staff will be immediately locked out of their accounts.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBlockBusiness} className="bg-red-600 hover:bg-red-700">
              Block Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Owner Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Send a password reset email to the business owner at <strong>{business.email}</strong>?
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                An email with password reset instructions will be sent to the business owner. The reset link will be valid for 1 hour.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} className="bg-blue-600 hover:bg-blue-700">
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
