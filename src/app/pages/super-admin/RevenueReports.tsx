import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Download,
  DollarSign,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Building2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AppDispatch, RootState } from "../../../store";
import { fetchRevenueReports } from "../../../store/super-admin/revenueReportsSlice";

export default function RevenueReports() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, loading } = useSelector((state: RootState) => state.superAdmin.revenueReports);
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState("2024");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareYear, setCompareYear] = useState("2023");

  useEffect(() => {
    dispatch(fetchRevenueReports());
  }, [dispatch]);

  // Transform reports data for display
  const getData = () => {
    if (!reports || reports.length === 0) return [];

    return reports.map((report) => ({
      period: report.period,
      revenue: parseFloat(report.totalRevenue.replace(/[$,]/g, "")) || 0,
      businesses: report.activeBusinesses,
      growth: parseFloat(report.growth.replace("%", "")) || 0,
    }));
  };

  const businessTypeRevenue = [
    { type: "Retail", revenue: 245600, percentage: 38, businesses: 847 },
    { type: "Restaurant", revenue: 178900, percentage: 28, businesses: 234 },
    { type: "Repair Shop", revenue: 134200, percentage: 21, businesses: 156 },
    { type: "Services", revenue: 64120, percentage: 10, businesses: 89 },
    { type: "Hybrid", revenue: 20200, percentage: 3, businesses: 21 },
  ];

  const currentData = getData();
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = currentData.length > 0 ? totalRevenue / currentData.length : 0;
  const maxRevenue = currentData.length > 0 ? Math.max(...currentData.map((d) => d.revenue)) : 0;
  const minRevenue = currentData.length > 0 ? Math.min(...currentData.map((d) => d.revenue)) : 0;

  if (loading && reports.length === 0) {
    return <div className="p-6">Loading revenue reports...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="flex">
        

        {/* Main Content */}
        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Revenue Reports</h2>
                <p className="text-gray-600">Track subscription revenue and growth</p>
              </div>
              <Button variant="outline">
                <Download className="size-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                {period !== "yearly" && (
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={compareEnabled}
                      onChange={(e) => setCompareEnabled(e.target.checked)}
                      className="rounded"
                    />
                    Compare with previous period
                  </label>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="size-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Selected period</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average</p>
                    <p className="text-2xl font-bold">${Math.round(avgRevenue).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Per {period === 'daily' ? 'day' : period === 'monthly' ? 'month' : 'year'}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ArrowUp className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Peak Revenue</p>
                    <p className="text-2xl font-bold">${maxRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Highest in period</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building2 className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Businesses</p>
                    <p className="text-2xl font-bold">{currentData[currentData.length - 1].businesses}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Active subscribers</p>
              </div>
            </div>

            {/* Business Type Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-6">Revenue by Business Type</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {businessTypeRevenue.map((type, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{type.type}</span>
                        <span className="font-bold text-green-600">${type.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${type.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">{type.percentage}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{type.businesses} businesses</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative size-64">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {businessTypeRevenue.reduce((acc, type, index) => {
                        const prevPercentage = businessTypeRevenue.slice(0, index).reduce((sum, t) => sum + t.percentage, 0);
                        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                        return [
                          ...acc,
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colors[index]}
                            strokeWidth="20"
                            strokeDasharray={`${type.percentage * 2.512} ${251.2 - type.percentage * 2.512}`}
                            strokeDashoffset={-prevPercentage * 2.512}
                          />
                        ];
                      }, [] as any)}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-3xl font-bold">${(totalRevenue / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-6">Revenue Trend</h3>
              <div className="h-80 flex items-end justify-between gap-2 px-2">
                {currentData.map((item, i) => {
                  const maxRevenue = Math.max(...currentData.map(d => d.revenue));
                  const height = (item.revenue / maxRevenue) * 100;
                  const label = item.period || "N/A";

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
                          style={{ height: `${height * 3}px`, minHeight: '20px' }}
                        />
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                          <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                          <div className="text-gray-300">{item.businesses} businesses</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        {period === "daily" ? "Day" : period === "yearly" ? "Year" : "Month"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Businesses</th>
                      {period !== "daily" && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Growth</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium">
                          {item.period || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">
                            ${item.revenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.businesses}
                        </td>
                        {period !== "daily" && 'growth' in item && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {item.growth >= 0 ? (
                                <>
                                  <ArrowUp className="size-4 text-green-600" />
                                  <span className="font-semibold text-green-600">
                                    {item.growth.toFixed(1)}%
                                  </span>
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="size-4 text-red-600" />
                                  <span className="font-semibold text-red-600">
                                    {Math.abs(item.growth).toFixed(1)}%
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
