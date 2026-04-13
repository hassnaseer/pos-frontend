import { useState } from "react";
import { Link } from "react-router";
import {
  Database, DollarSign, ShoppingCart, Ticket, Users,
  Bell, LogOut, Menu, X, Package, Clock, CheckCircle2, AlertCircle, Activity
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCashier = user?.role === "cashier";
  const isManager = user?.role === "manager";
  const isTechnician = user?.role === "technician";

  const cashierStats = [
    { label: "My Sales Today", value: "$847", icon: DollarSign },
    { label: "Orders Processed", value: "28", icon: ShoppingCart },
    { label: "Active Session", value: "4h 23m", icon: Clock },
  ];

  const technicianStats = [
    { label: "Assigned Tickets", value: "12", icon: Ticket },
    { label: "Completed Today", value: "5", icon: CheckCircle2 },
    { label: "In Progress", value: "7", icon: Clock },
  ];

  const managerStats = [
    { label: "Today's Sales", value: "$2,847", icon: DollarSign },
    { label: "Total Orders", value: "145", icon: ShoppingCart },
    { label: "Open Tickets", value: "23", icon: Ticket },
    { label: "Staff Active", value: "8", icon: Users },
  ];

  const stats = isCashier ? cashierStats : isTechnician ? technicianStats : managerStats;

  const myOrders = [
    { id: "ORD-001234", customer: "John Smith", amount: "$245.00", time: "2 min ago" },
    { id: "ORD-001230", customer: "Sarah Johnson", amount: "$89.50", time: "25 min ago" },
    { id: "ORD-001228", customer: "Mike Wilson", amount: "$156.00", time: "1 hour ago" },
  ];

  const myTickets = [
    { id: "TKT-20240045", device: "iPhone 14 Pro", issue: "Screen replacement", status: "In Progress", customer: "Alice Brown" },
    { id: "TKT-20240042", device: "MacBook Air", issue: "Battery replacement", status: "In Progress", customer: "Bob Lee" },
    { id: "TKT-20240038", device: "Samsung S23", issue: "Water damage", status: "Waiting for Parts", customer: "Carol White" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="flex">
        

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-gray-600">
                  {isCashier && "Ready to process your next sale"}
                  {isTechnician && "Your assigned tickets and updates"}
                  {isManager && "Manage your team and operations"}
                </p>
              </div>
              <div className="flex gap-3">
                {(isCashier || isManager) && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="size-4 mr-2" />
                    New Sale
                  </Button>
                )}
                {(isTechnician || isManager) && (
                  <Button variant="outline">
                    <Ticket className="size-4 mr-2" />
                    New Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${stats.length} gap-6`}>
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <stat.icon className="size-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Role-specific content */}
            {(isCashier || isManager) && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* My Orders / Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">
                      {isCashier ? "My Orders Today" : "Recent Orders"}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {myOrders.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{order.id}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{order.customer}</span>
                          <span className="font-semibold">{order.amount}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full">View All Orders</Button>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Low Stock Alerts</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { name: "iPhone Charger Cable", stock: 3, min: 10 },
                      { name: "Screen Protector", stock: 5, min: 15 },
                      { name: "Phone Case - Black", stock: 2, min: 8 },
                      { name: "AirPods Case", stock: 4, min: 10 },
                    ].map((product, index) => (
                      <div key={index} className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">Min: {product.min} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">{product.stock}</p>
                          <p className="text-xs text-gray-500">in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isTechnician && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">My Assigned Tickets</h3>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Ticket className="size-4 mr-2" />
                    New Ticket
                  </Button>
                </div>
                <div className="divide-y divide-gray-200">
                  {myTickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg mb-1">{ticket.id}</p>
                          <p className="text-sm text-gray-600">{ticket.customer}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          ticket.status === 'Waiting for Parts' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-sm mb-1">{ticket.device}</p>
                        <p className="text-sm text-gray-600">{ticket.issue}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">Update Status</Button>
                        <Button size="sm" variant="outline">Add Parts</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="ghost" className="w-full">View All Tickets</Button>
                </div>
              </div>
            )}

            {isManager && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Team Performance */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Team Performance Today</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { name: "John Doe", role: "Cashier", orders: 45, amount: "$1,234", status: "active" },
                      { name: "Jane Smith", role: "Cashier", orders: 32, amount: "$987", status: "active" },
                      { name: "Mike Tech", role: "Technician", orders: 8, amount: "8 tickets", status: "active" },
                    ].map((staff, index) => (
                      <div key={index} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="size-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{staff.name}</p>
                            <p className="text-sm text-gray-500">{staff.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{staff.amount}</p>
                          <p className="text-sm text-gray-500">
                            {typeof staff.orders === 'number' ? `${staff.orders} orders` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Pending Approvals
                      <span className="size-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { type: "Refund Request", item: "Order #ORD-001231", amount: "$567.00", requester: "Jane Smith" },
                      { type: "Discount Override", item: "Order #ORD-001235", amount: "$89.50", requester: "John Doe" },
                      { type: "Price Override", item: "MacBook Pro M3", amount: "$1,999.00", requester: "John Doe" },
                    ].map((approval, index) => (
                      <div key={index} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm text-red-600">{approval.type}</p>
                            <p className="text-sm text-gray-600 mt-1">{approval.item}</p>
                            <p className="text-xs text-gray-500 mt-1">Requested by {approval.requester}</p>
                          </div>
                          <p className="font-bold">{approval.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
