import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Settings, Building2, Activity,
  Menu, X, Shield, TrendingUp, Save, Server, Cpu, HardDrive,
  Wifi, CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function PlatformSettings() {
  const [refreshing, setRefreshing] = useState(false);

  const systemHealth = {
    database: { status: "healthy", uptime: "99.9%", responseTime: "12ms" },
    api: { status: "healthy", uptime: "99.8%", responseTime: "45ms" },
    storage: { status: "healthy", used: "245GB", total: "1TB", percentage: 24 },
    memory: { status: "healthy", used: "12.4GB", total: "32GB", percentage: 39 },
    cpu: { status: "healthy", usage: "23%", cores: 16 },
  };

  const handleRefreshHealth = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const [settings, setSettings] = useState({
    // Trial & Subscription
    trialPeriodDays: "14",
    monthlyPrice: "35",
    annualPrice: "350",
    annualDiscount: "2",

    // Email Templates
    signupEmailSubject: "Welcome to Global POS!",
    signupEmailBody: "Thank you for signing up. Your 14-day trial has started.",
    expiryWarningSubject: "Your subscription is expiring soon",
    expiryWarningBody: "Your subscription will expire in {days} days. Please renew to continue using our services.",
    blockedEmailSubject: "Your account has been suspended",
    blockedEmailBody: "Your account has been suspended due to non-payment. Please contact support.",

    // System Settings
    maintenanceMode: false,
    announcementEnabled: false,
    announcementText: "",

    // Business Limits
    maxStaffPerBusiness: "50",
    maxProductsPerBusiness: "10000",
    maxCustomersPerBusiness: "50000",
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // In a real app, this would call an API
    alert("Settings saved successfully!");
  };return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">

        {/* Main Content */}
        <main className="flex-1 p-6 ">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Platform Settings</h2>
                <p className="text-gray-600">Configure and monitor your platform</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRefreshHealth} variant="outline" disabled={refreshing}>
                  <RefreshCw className={`size-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Status
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="size-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="email">Email Templates</TabsTrigger>
                <TabsTrigger value="limits">Business Limits</TabsTrigger>
                <TabsTrigger value="monitoring">System Health</TabsTrigger>
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">

                {/* Trial & Subscription Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Trial & Subscription</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trial Period (Days)</Label>
                  <Input
                    type="number"
                    value={settings.trialPeriodDays}
                    onChange={(e) => setSettings({ ...settings, trialPeriodDays: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Price ($)</Label>
                  <Input
                    type="number"
                    value={settings.monthlyPrice}
                    onChange={(e) => setSettings({ ...settings, monthlyPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Price ($)</Label>
                  <Input
                    type="number"
                    value={settings.annualPrice}
                    onChange={(e) => setSettings({ ...settings, annualPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Discount (Months Free)</Label>
                  <Input
                    type="number"
                    value={settings.annualDiscount}
                    onChange={(e) => setSettings({ ...settings, annualDiscount: e.target.value })}
                  />
                </div>
              </div>
            </div>

                {/* System Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">System Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Disable all business logins</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <Label>Global Announcement</Label>
                        <p className="text-sm text-gray-500">Show banner to all users</p>
                      </div>
                      <Switch
                        checked={settings.announcementEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, announcementEnabled: checked })}
                      />
                    </div>

                    {settings.announcementEnabled && (
                      <div className="space-y-2">
                        <Label>Announcement Text</Label>
                        <Textarea
                          value={settings.announcementText}
                          onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                          placeholder="Enter announcement message"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Email Templates Tab */}
              <TabsContent value="email" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Email Notification Templates</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Signup Email - Subject</Label>
                  <Input
                    value={settings.signupEmailSubject}
                    onChange={(e) => setSettings({ ...settings, signupEmailSubject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signup Email - Body</Label>
                  <Textarea
                    value={settings.signupEmailBody}
                    onChange={(e) => setSettings({ ...settings, signupEmailBody: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Label>Expiry Warning - Subject</Label>
                  <Input
                    value={settings.expiryWarningSubject}
                    onChange={(e) => setSettings({ ...settings, expiryWarningSubject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Warning - Body</Label>
                  <Textarea
                    value={settings.expiryWarningBody}
                    onChange={(e) => setSettings({ ...settings, expiryWarningBody: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Use {"{days}"} as placeholder for days remaining</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Label>Account Blocked - Subject</Label>
                  <Input
                    value={settings.blockedEmailSubject}
                    onChange={(e) => setSettings({ ...settings, blockedEmailSubject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Blocked - Body</Label>
                  <Textarea
                    value={settings.blockedEmailBody}
                    onChange={(e) => setSettings({ ...settings, blockedEmailBody: e.target.value })}
                    rows={3}
                  />
                  </div>
                </div>
              </div>
              </TabsContent>

              {/* Business Limits Tab */}
              <TabsContent value="limits" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Business Limits</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Max Staff Per Business</Label>
                  <Input
                    type="number"
                    value={settings.maxStaffPerBusiness}
                    onChange={(e) => setSettings({ ...settings, maxStaffPerBusiness: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Products Per Business</Label>
                  <Input
                    type="number"
                    value={settings.maxProductsPerBusiness}
                    onChange={(e) => setSettings({ ...settings, maxProductsPerBusiness: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Customers Per Business</Label>
                  <Input
                    type="number"
                    value={settings.maxCustomersPerBusiness}
                    onChange={(e) => setSettings({ ...settings, maxCustomersPerBusiness: e.target.value })}
                  />
                  </div>
                </div>
              </div>
              </TabsContent>

              {/* System Monitoring Tab */}
              <TabsContent value="monitoring" className="space-y-6">
                {/* Status Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle2 className="size-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">System Status</p>
                        <p className="text-xl font-bold text-green-600">All Systems Operational</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Server className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Uptime</p>
                        <p className="text-xl font-bold">99.9%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Wifi className="size-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="text-xl font-bold">45ms</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-6">System Components</h3>
                  <div className="space-y-6">
                    {/* Database */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Database className="size-5 text-gray-600" />
                          <span className="font-semibold">Database</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Healthy
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Uptime</p>
                          <p className="font-semibold">{systemHealth.database.uptime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time</p>
                          <p className="font-semibold">{systemHealth.database.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Connections</p>
                          <p className="font-semibold">124 active</p>
                        </div>
                      </div>
                    </div>

                    {/* API Server */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Server className="size-5 text-gray-600" />
                          <span className="font-semibold">API Server</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Healthy
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Uptime</p>
                          <p className="font-semibold">{systemHealth.api.uptime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time</p>
                          <p className="font-semibold">{systemHealth.api.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Requests/min</p>
                          <p className="font-semibold">2,341</p>
                        </div>
                      </div>
                    </div>

                    {/* Storage */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <HardDrive className="size-5 text-gray-600" />
                          <span className="font-semibold">Storage</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Healthy
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Used: {systemHealth.storage.used} of {systemHealth.storage.total}</span>
                          <span className="font-semibold">{systemHealth.storage.percentage}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${systemHealth.storage.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Cpu className="size-5 text-gray-600" />
                          <span className="font-semibold">Memory</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Healthy
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Used: {systemHealth.memory.used} of {systemHealth.memory.total}</span>
                          <span className="font-semibold">{systemHealth.memory.percentage}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${systemHealth.memory.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CPU */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Cpu className="size-5 text-gray-600" />
                          <span className="font-semibold">CPU</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Healthy
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Usage</p>
                          <p className="font-semibold">{systemHealth.cpu.usage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cores</p>
                          <p className="font-semibold">{systemHealth.cpu.cores}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Load Average</p>
                          <p className="font-semibold">1.2, 1.5, 1.8</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
