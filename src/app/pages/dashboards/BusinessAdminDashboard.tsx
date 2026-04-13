import { useState } from "react";
import { Link } from "react-router";
import {
  Database, DollarSign, ShoppingCart, Ticket, Package, Users,
  TrendingUp, AlertCircle, Bell, LogOut, Menu, X,
  BarChart3, FileText, Settings, Clock, Building2, ChevronDown
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function BusinessAdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState("BUS-001");

  const myBusinesses = [
    { id: "BUS-001", name: "Tech Store Downtown", type: "Retail" },
    { id: "BUS-002", name: "Tech Store Midtown", type: "Retail" },
    { id: "BUS-003", name: "Tech Repair Center", type: "Service Center" },
  ];

  const stats = [
    { label: "Today's Sales", value: "$2,847", icon: DollarSign, change: "+12.5%", comparison: "vs yesterday" },
    { label: "Total Orders", value: "145", icon: ShoppingCart, change: "+8%", comparison: "this month" },
    { label: "Open Tickets", value: "23", icon: Ticket, change: "-3", comparison: "pending" },
    { label: "Low Stock Alerts", value: "7", icon: AlertCircle, change: "", comparison: "products" },
  ];

  const topProducts = [
    { name: "iPhone 15 Pro", sold: 45, revenue: "$44,955" },
    { name: "Samsung Galaxy S24", sold: 38, revenue: "$30,400" },
    { name: "MacBook Pro M3", sold: 12, revenue: "$23,988" },
    { name: "AirPods Pro", sold: 67, revenue: "$16,750" },
    { name: "iPad Air", sold: 24, revenue: "$14,376" },
  ];

  const recentOrders = [
    { id: "ORD-001234", customer: "John Smith", amount: "$245.00", status: "Completed", time: "2 min ago" },
    { id: "ORD-001233", customer: "Sarah Johnson", amount: "$1,299.00", status: "Completed", time: "15 min ago" },
    { id: "ORD-001232", customer: "Mike Wilson", amount: "$89.50", status: "Completed", time: "32 min ago" },
    { id: "ORD-001231", customer: "Emma Davis", amount: "$567.00", status: "Refunded", time: "1 hour ago" },
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
                <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-gray-600">Here's your business overview for today</p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="size-4 mr-2" />
                  New Sale
                </Button>
                <Button variant="outline">
                  <Ticket className="size-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <stat.icon className="size-6 text-blue-600" />
                    </div>
                    {stat.change && (
                      <span className={`text-sm font-semibold ${stat.change.includes('+') ? 'text-green-600' : stat.change.includes('-') && !stat.comparison ? 'text-red-600' : 'text-gray-600'}`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  {stat.comparison && (
                    <p className="text-xs text-gray-500">{stat.comparison}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Charts and Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Revenue (Last 7 Days)</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[2100, 2500, 2200, 2800, 2400, 3100, 2847].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition"
                          style={{ height: `${(value / 3100) * 100}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          ${value.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Staff Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="size-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">John Doe</p>
                        <p className="text-xs text-gray-500">Cashier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">$1,234</p>
                      <p className="text-xs text-gray-500">45 orders</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Jane Smith</p>
                        <p className="text-xs text-gray-500">Manager</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">$987</p>
                      <p className="text-xs text-gray-500">32 orders</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Mike Tech</p>
                        <p className="text-xs text-gray-500">Technician</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">8</p>
                      <p className="text-xs text-gray-500">tickets</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4">View All Staff</Button>
              </div>
            </div>

            {/* Top Products & Recent Orders */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">Top 5 Products</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <div key={index} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sold} sold</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">{product.revenue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">Recent Orders</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{order.id}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
