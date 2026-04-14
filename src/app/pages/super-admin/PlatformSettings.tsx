import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Save, RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { AppDispatch, RootState } from "../../../store";
import { fetchPlatformSettings, savePlatformSettings } from "../../../store/super-admin/platformSettingsSlice";

interface PlatformSettings {
  id: string;
  settingName: string;
  value: string | boolean;
  description: string;
}

// Default settings template - always shown even if API has no data
const DEFAULT_SETTINGS: PlatformSettings[] = [
  {
    id: "trial_days_business_owner",
    settingName: "trial_days_business_owner",
    value: "14",
    description: "Trial days granted to business owners.",
  },
  {
    id: "trial_days_admin",
    settingName: "trial_days_admin",
    value: "14",
    description: "Trial days granted to business admins.",
  },
  {
    id: "monthly_price",
    settingName: "monthly_price",
    value: "35",
    description: "Monthly subscription price for new businesses.",
  },
  {
    id: "annual_price",
    settingName: "annual_price",
    value: "350",
    description: "Annual subscription price for new businesses.",
  },
  {
    id: "annual_discount_months",
    settingName: "annual_discount_months",
    value: "2",
    description: "Free months included in the annual plan discount.",
  },
  {
    id: "signup_email_subject",
    settingName: "signup_email_subject",
    value: "Welcome to Global POS!",
    description: "Subject line for the welcome signup email.",
  },
  {
    id: "signup_email_body",
    settingName: "signup_email_body",
    value: "Thank you for signing up. Your 14-day trial has started.",
    description: "Body content for the welcome signup email.",
  },
  {
    id: "expiry_warning_subject",
    settingName: "expiry_warning_subject",
    value: "Your subscription is expiring soon",
    description: "Subject line for subscription expiry warning emails.",
  },
  {
    id: "expiry_warning_body",
    settingName: "expiry_warning_body",
    value: "Your subscription will expire in {days} days. Please renew to continue using our services.",
    description: "Body content for the subscription expiry warning email.",
  },
  {
    id: "blocked_email_subject",
    settingName: "blocked_email_subject",
    value: "Your account has been suspended",
    description: "Subject line for blocked account emails.",
  },
  {
    id: "blocked_email_body",
    settingName: "blocked_email_body",
    value: "Your account has been suspended due to non-payment. Please contact support.",
    description: "Body content for blocked account notifications.",
  },
  {
    id: "maintenance_mode",
    settingName: "maintenance_mode",
    value: "false",
    description: "Toggle global maintenance mode for all businesses.",
  },
  {
    id: "announcement_enabled",
    settingName: "announcement_enabled",
    value: "false",
    description: "Enable or disable platform announcement banner.",
  },
  {
    id: "announcement_text",
    settingName: "announcement_text",
    value: "",
    description: "Global announcement text shown to all users when enabled.",
  },
  {
    id: "max_staff_per_business",
    settingName: "max_staff_per_business",
    value: "50",
    description: "Maximum number of staff accounts allowed per business.",
  },
  {
    id: "max_products_per_business",
    settingName: "max_products_per_business",
    value: "10000",
    description: "Maximum number of products allowed per business.",
  },
  {
    id: "max_customers_per_business",
    settingName: "max_customers_per_business",
    value: "50000",
    description: "Maximum number of customer records allowed per business.",
  },
];

export default function PlatformSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.superAdmin.platformSettings);
  const [localSettings, setLocalSettings] = useState<PlatformSettings[]>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchPlatformSettings());
  }, [dispatch]);

  useEffect(() => {
    // If we have settings from the API, merge them with defaults
    // This ensures all fields are always shown
    if (settings && settings.length > 0) {
      const settingsMap = new Map(settings.map(s => [s.settingName, s]));
      const merged = DEFAULT_SETTINGS.map(defaultSetting => 
        settingsMap.get(defaultSetting.settingName) || defaultSetting
      );
      setLocalSettings(merged);
    } else {
      // If no API data, use defaults (fields will still show)
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [settings]);

  // Group settings by category for easier access
  const settingsByCategory = useMemo(() => {
    const grouped = {
      trial: [] as typeof localSettings,
      pricing: [] as typeof localSettings,
      emails: [] as typeof localSettings,
      system: [] as typeof localSettings,
      limits: [] as typeof localSettings,
    };

    localSettings.forEach((setting) => {
      if (setting.settingName.includes("trial")) grouped.trial.push(setting);
      else if (setting.settingName.includes("price") || setting.settingName.includes("discount")) grouped.pricing.push(setting);
      else if (setting.settingName.includes("email")) grouped.emails.push(setting);
      else if (setting.settingName.includes("maintenance") || setting.settingName === "announcement_enabled") grouped.system.push(setting);
      else if (setting.settingName.includes("max_")) grouped.limits.push(setting);
    });

    return grouped;
  }, [localSettings]);

  const handleSettingChange = (id: string, key: "value" | "description", newValue: string | boolean) => {
    setLocalSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, [key]: String(newValue) } : setting
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(savePlatformSettings(localSettings)).unwrap();
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Platform Settings</h2>
                <p className="text-gray-600">Configure trial periods, pricing, email templates, business limits, and system settings</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => dispatch(fetchPlatformSettings())} variant="outline" disabled={loading}>
                  <RefreshCw className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
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
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">
                {/* Trial & Subscription Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Trial & Subscription</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {settingsByCategory.trial.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <Label>
                          {setting.settingName === "trial_days_business_owner"
                            ? "Trial Days - Business Owner"
                            : "Trial Days - Admin"}
                        </Label>
                        <Input
                          type="number"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                        />
                        {setting.description && <p className="text-xs text-gray-500">{setting.description}</p>}
                      </div>
                    ))}
                    {settingsByCategory.pricing.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <Label>
                          {setting.settingName === "monthly_price"
                            ? "Monthly Price ($)"
                            : setting.settingName === "annual_price"
                            ? "Annual Price ($)"
                            : "Annual Discount (Months Free)"}
                        </Label>
                        <Input
                          type="number"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">System Settings</h3>
                  <div className="space-y-4">
                    {settingsByCategory.system.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                        <div>
                          <Label>
                            {setting.settingName === "maintenance_mode" ? "Maintenance Mode" : "Global Announcement"}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {setting.settingName === "maintenance_mode"
                              ? "Disable all business logins"
                              : "Show banner to all users"}
                          </p>
                        </div>
                        <Switch
                          checked={setting.value === "true"}
                          onCheckedChange={(checked) => handleSettingChange(setting.id, "value", checked.toString())}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Email Templates Tab */}
              <TabsContent value="email" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Email Notification Templates</h3>
                  <div className="space-y-6">
                    {settingsByCategory.emails.map((setting) => (
                      <div key={setting.id} className="space-y-2 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                        <Label className="font-semibold">
                          {setting.settingName
                            .replace(/_/g, " ")
                            .replace(/email|subject|body/gi, (m) => m.toUpperCase())
                            .split(" ")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Label>
                        {setting.settingName.includes("body") ? (
                          <Textarea
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <Input
                            type="text"
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                          />
                        )}
                        {setting.description && <p className="text-xs text-gray-500">{setting.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Business Limits Tab */}
              <TabsContent value="limits" className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-lg mb-4">Business Limits</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {settingsByCategory.limits.map((setting) => (
                      <div key={setting.id} className="space-y-2">
                        <Label>
                          {setting.settingName === "max_staff_per_business"
                            ? "Max Staff Per Business"
                            : setting.settingName === "max_products_per_business"
                            ? "Max Products Per Business"
                            : "Max Customers Per Business"}
                        </Label>
                        <Input
                          type="number"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                        />
                        {setting.description && <p className="text-xs text-gray-500 mt-1">{setting.description}</p>}
                      </div>
                    ))}
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
