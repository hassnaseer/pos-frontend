import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, BarChart3, ShoppingCart, Package,
  Ticket, FileText, TrendingUp, Clock, Settings as SettingsIcon, Save
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function Settings() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    businessName: user?.businessName || "",
    businessType: user?.businessType || "",
    email: user?.email || "",
    phone: "+1 555-1234",
    address: "123 Business Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    taxRate: "10",
    currency: "USD",
    receiptMessage: "Thank you for your business!",
  });

  const handleLogout = () => {
    logout();
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
     <div className="flex">
       <main className="flex-1 p-6 ">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Business Settings</h2>
                <p className="text-gray-600">Manage your business configuration</p>
              </div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Type</Label>
                      <Input
                        value={settings.businessType}
                        onChange={(e) => setSettings({ ...settings, businessType: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Sales Settings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Input
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Receipt Message</Label>
                      <Textarea
                        value={settings.receiptMessage}
                        onChange={(e) => setSettings({ ...settings, receiptMessage: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Business Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={settings.city}
                          onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={settings.state}
                          onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          value={settings.zipCode}
                          onChange={(e) => setSettings({ ...settings, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Subscription Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div>
                        <p className="font-semibold">Current Plan</p>
                        <p className="text-sm text-gray-500">Professional Plan</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-medium text-sm">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div>
                        <p className="font-semibold">Next Billing Date</p>
                        <p className="text-sm text-gray-500">May 12, 2024</p>
                      </div>
                      <p className="font-bold text-green-600">$99.00</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Subscription Started</p>
                        <p className="text-sm text-gray-500">December 1, 2023</p>
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
