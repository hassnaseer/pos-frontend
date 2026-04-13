import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, BarChart3, ShoppingCart, Package,
  Ticket, FileText, TrendingUp, Clock, Settings, Download, Eye, Plus,
  Wrench, Pill, Factory, Building2, Shield, DollarSign, Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import { UserRole, UserPermissions, useAuth } from "../contexts/AuthContext";

interface UnifiedLayoutProps {
  children: React.ReactNode;
  userName?: string;
  businessName?: string;
}

interface SidebarItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  allowedRoles: UserRole[];
  permissionKey?: keyof UserPermissions;
}

const getSidebarItems = (role: UserRole, businessType?: string, permissions?: UserPermissions) => {
  const allItems: SidebarItem[] = [
    {
      path: "/super-admin",
      icon: BarChart3,
      label: "Dashboard",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/admin",
      icon: BarChart3,
      label: "Dashboard",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/super-admin/businesses",
      icon: Building2,
      label: "Businesses",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/super-admin/business-types",
      icon: Factory,
      label: "Business Types",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/super-admin/roles",
      icon: Shield,
      label: "Role Management",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/super-admin/revenue-reports",
      icon: DollarSign,
      label: "Revenue Reports",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/super-admin/settings",
      icon: Settings,
      label: "Platform Settings",
      allowedRoles: ["super-admin"] as UserRole[],
    },
    {
      path: "/admin/my-businesses",
      icon: Building2,
      label: "My Businesses",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/pos",
      icon: ShoppingCart,
      label: "POS",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/products",
      icon: Package,
      label: "Products",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/tickets",
      icon: Ticket,
      label: "Tickets",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/customers",
      icon: Users,
      label: "Customers",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/orders",
      icon: FileText,
      label: "Orders",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/staff",
      icon: Users,
      label: "Staff",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/reports",
      icon: BarChart3,
      label: "Reports",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/admin/settings",
      icon: Settings,
      label: "Settings",
      allowedRoles: ["admin"] as UserRole[],
    },
    {
      path: "/staff",
      icon: BarChart3,
      label: "Dashboard",
      allowedRoles: ["manager", "cashier", "technician"] as UserRole[],
    },
    {
      path: "/staff/pos",
      icon: ShoppingCart,
      label: "POS",
      allowedRoles: ["manager", "cashier", "technician"] as UserRole[],
      permissionKey: "canAccessPOS",
    },
    {
      path: "/staff/products",
      icon: Package,
      label: "Products",
      allowedRoles: ["manager", "technician"] as UserRole[],
      permissionKey: "canManageProducts",
    },
    {
      path: "/staff/tickets",
      icon: Ticket,
      label: "Tickets",
      allowedRoles: ["manager", "technician"] as UserRole[],
      permissionKey: "canManageTickets",
    },
    {
      path: "/staff/customers",
      icon: Users,
      label: "Customers",
      allowedRoles: ["manager", "cashier"] as UserRole[],
      permissionKey: "canManageCustomers",
    },
  ];

  // Add Social Platform items for Repair Shop businesses
  if (businessType === "Repair Shop" && role === "admin") {
    allItems.splice(15, 0, {
      path: "/admin/social-platforms",
      icon: Activity,
      label: "Social Platforms",
      allowedRoles: ["admin"] as UserRole[],
    });
  }

  return allItems.filter((item) => {
    if (!item.allowedRoles.includes(role)) {
      return false;
    }
    if (item.permissionKey) {
      return !!permissions?.[item.permissionKey];
    }
    return true;
  });
};

export default function UnifiedLayout({
  children,
  userName = "User",
  businessName = "Business"
}: UnifiedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const sidebarItems = getSidebarItems(user?.role || "admin", user?.businessType, user?.permissions);
  const displayName = user?.name || "User"
  const displayBusiness = user?.businessName || businessName
  const displayRole = user?.role === "super-admin"
    ? "Platform Admin"
    : user?.role === "admin"
      ? "Business Admin"
      : "Staff"

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
              <Link to={user?.role === "super-admin" ? "/super-admin" : user?.role === "admin" ? "/admin" : "/staff"} className="flex items-center gap-2">
                <Building2 className="size-8 text-blue-600" />
                <div>
                  <h1 className="font-bold text-xl">{displayBusiness}</h1>
                  <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="size-5 text-gray-600" />
              </button>
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] fixed lg:sticky top-[73px] z-30`}>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}