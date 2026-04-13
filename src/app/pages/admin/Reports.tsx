import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, BarChart3, ShoppingCart, Package,
  Ticket, FileText, TrendingUp, Clock, Settings, Download, DollarSign,
  Calendar
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("week");

  const salesData = timeRange === "week"
    ? [2100, 2500, 2200, 2800, 2400, 3100, 2847]
    : timeRange === "month"
    ? [12000, 15000, 14500, 16800, 15200, 17500, 16900, 18200, 17600, 19100, 18500, 20300, 19800, 21200, 20500, 22100, 21400, 23000, 22300, 24100, 23400, 25000, 24200, 26100, 25300, 27000, 26200, 28100, 27300, 28847]
    : [45000, 52000, 48000, 55000, 51000, 58000, 54000, 61000, 57000, 64000, 60000, 67000];return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">
        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Business Reports</h2>
                <p className="text-gray-600">View detailed business analytics and insights</p>
              </div>
              <div className="flex gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="size-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">$19,950</p>
                <p className="text-xs text-green-600 mt-1">+15.3% vs last period</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ShoppingCart className="size-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">1,015</p>
                <p className="text-xs text-blue-600 mt-1">+12% vs last period</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="size-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">New Customers</p>
                <p className="text-3xl font-bold">87</p>
                <p className="text-xs text-purple-600 mt-1">+23% vs last period</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="size-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold">$19.66</p>
                <p className="text-xs text-orange-600 mt-1">+2.8% vs last period</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-6">Sales Trend</h3>
              <div className="h-80 flex items-end justify-between gap-2">
                {salesData.slice(0, timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12).map((value, i) => {
                  const maxValue = Math.max(...salesData);
                  const height = (value / maxValue) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:opacity-80 transition"
                          style={{ height: `${height * 2.8}px`, minHeight: '20px' }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                          ${value.toLocaleString()}
                        </div>
                      </div>
                      {timeRange === "week" && (
                        <span className="text-xs text-gray-500">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Top Selling Products</h3>
                <div className="space-y-4">
                  {[
                    { name: "iPhone 15 Pro", sold: 45, revenue: "$44,955" },
                    { name: "Samsung Galaxy S24", sold: 38, revenue: "$30,400" },
                    { name: "MacBook Pro M3", sold: 12, revenue: "$23,988" },
                    { name: "AirPods Pro", sold: 67, revenue: "$16,750" },
                    { name: "iPad Air", sold: 24, revenue: "$14,376" },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex items-center gap-3">
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

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Staff Performance</h3>
                <div className="space-y-4">
                  {[
                    { name: "John Doe", role: "Cashier", sales: "$8,234", orders: 342 },
                    { name: "Jane Smith", role: "Manager", sales: "$6,987", orders: 289 },
                    { name: "Mike Wilson", role: "Cashier", sales: "$4,729", orders: 198 },
                  ].map((staff, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{staff.sales}</p>
                        <p className="text-sm text-gray-500">{staff.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
