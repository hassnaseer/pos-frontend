import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, DollarSign, TrendingUp, Bell, LogOut,
  Settings, Building2, Activity, Menu, X, Shield, Plus,
  Filter, Calendar, RefreshCw, Download, ArrowUp, ArrowDown
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

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");

  const stats = [
    { label: "Total Businesses", value: "1,247", icon: Building2, change: "+12%", changeValue: "+134", trend: "up", comparison: "vs last month" },
    { label: "Active Subscriptions", value: "1,089", icon: Users, change: "+8%", changeValue: "+76", trend: "up", comparison: "vs last month" },
    { label: "Trial Businesses", value: "158", icon: Activity, change: "-3%", changeValue: "-5", trend: "down", comparison: "vs last month" },
    { label: "Monthly Revenue", value: "$38,115", icon: DollarSign, change: "+15%", changeValue: "+$4,970", trend: "up", comparison: "vs last month" },
  ];

  const recentActivity = [
    { id: 1, business: "Tech Retail Store", action: "New signup", time: "5 min ago", type: "signup" },
    { id: 2, business: "Mike's Repair Shop", action: "Payment received", time: "12 min ago", type: "payment" },
    { id: 3, business: "Cafe Central", action: "Subscription renewed", time: "1 hour ago", type: "renewal" },
    { id: 4, business: "Fashion Boutique", action: "Trial started", time: "2 hours ago", type: "trial" },
    { id: 5, business: "Auto Service Pro", action: "Subscription expired", time: "3 hours ago", type: "expired" },
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
                <p className="text-gray-600">Here's what's happening with your platform today</p>
              </div>
              <div className="flex gap-3">
                <Link to="/super-admin/businesses">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-4 mr-2" />
                    Add Business
                  </Button>
                </Link>
                <Button variant="outline">
                  <RefreshCw className="size-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-gray-400" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="size-5 text-gray-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="trial">Trial Only</SelectItem>
                      <SelectItem value="expired">Expired Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto">
                  <Button variant="outline" size="sm">
                    <Download className="size-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <stat.icon className="size-6 text-blue-600" />
                    </div>
                    <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                      <span className="text-sm font-semibold">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.changeValue}
                    </span>
                    <span>{stat.comparison}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-6">Monthly Revenue</h3>
                <div className="h-64 flex items-end justify-between gap-3 px-2">
                  {[32000, 45000, 38000, 52000, 48000, 61000, 55000, 48000, 62000, 58000, 65000, 72000].map((value, i) => {
                    const maxValue = 72000;
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full group">
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
                            style={{ height: `${height * 2.4}px`, minHeight: '20px' }}
                          />
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                            ${(value / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Subscription Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className="text-sm font-semibold">87%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Trial</span>
                      <span className="text-sm font-semibold">13%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '13%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Expired</span>
                      <span className="text-sm font-semibold">5%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">1,089</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">158</p>
                        <p className="text-xs text-gray-500">Trial</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">62</p>
                        <p className="text-xs text-gray-500">Expired</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          activity.type === 'signup' ? 'bg-blue-100' :
                          activity.type === 'payment' ? 'bg-green-100' :
                          activity.type === 'renewal' ? 'bg-purple-100' :
                          activity.type === 'trial' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          <Building2 className={`size-5 ${
                            activity.type === 'signup' ? 'text-blue-600' :
                            activity.type === 'payment' ? 'text-green-600' :
                            activity.type === 'renewal' ? 'text-purple-600' :
                            activity.type === 'trial' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold">{activity.business}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full">View All Activity</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
