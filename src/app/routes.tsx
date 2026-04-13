import { createBrowserRouter, Outlet } from "react-router";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OTPVerification from "./pages/auth/OTPVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import BusinessAdminDashboard from "./pages/dashboards/BusinessAdminDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UnifiedLayout from "./layouts/UnifiedLayout";

// Super Admin Pages
import Businesses from "./pages/super-admin/Businesses";
import BusinessDetail from "./pages/super-admin/BusinessDetail";
import BusinessTypes from "./pages/super-admin/BusinessTypes";
import RoleManagement from "./pages/super-admin/RoleManagement";
import RevenueReports from "./pages/super-admin/RevenueReports";
import PlatformSettings from "./pages/super-admin/PlatformSettings";

// Admin Pages
import AdminMyBusinesses from "./pages/admin/MyBusinesses";
import AdminPOS from "./pages/admin/POS";
import AdminProducts from "./pages/admin/Products";
import AdminTickets from "./pages/admin/Tickets";
import AdminCustomers from "./pages/admin/Customers";
import AdminOrders from "./pages/admin/Orders";
import AdminStaff from "./pages/admin/Staff";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import SocialPlatforms from "./pages/admin/SocialPlatforms";

// Staff Pages
import StaffPOS from "./pages/staff/POS";
import StaffTickets from "./pages/staff/Tickets";
import StaffCustomers from "./pages/staff/Customers";
import StaffProducts from "./pages/staff/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/otp-verification",
    Component: OTPVerification,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/super-admin",
    element: <ProtectedRoute allowedRoles={["super-admin"]} />,
    children: [
      {
        path: "",
        element: <UnifiedLayout><Outlet /></UnifiedLayout>,
        children: [
          {
            index: true,
            Component: SuperAdminDashboard,
          },
          {
            path: "businesses",
            Component: Businesses,
          },
          {
            path: "businesses/:id",
            Component: BusinessDetail,
          },
          {
            path: "business-types",
            Component: BusinessTypes,
          },
          {
            path: "roles",
            Component: RoleManagement,
          },
          {
            path: "revenue-reports",
            Component: RevenueReports,
          },
          {
            path: "settings",
            Component: PlatformSettings,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "",
        element: <UnifiedLayout><Outlet /></UnifiedLayout>,
        children: [
          {
            index: true,
            Component: BusinessAdminDashboard,
          },
          {
            path: "my-businesses",
            Component: AdminMyBusinesses,
          },
          {
            path: "pos",
            Component: AdminPOS,
          },
          {
            path: "products",
            Component: AdminProducts,
          },
          {
            path: "tickets",
            Component: AdminTickets,
          },
          {
            path: "customers",
            Component: AdminCustomers,
          },
          {
            path: "orders",
            Component: AdminOrders,
          },
          {
            path: "staff",
            Component: AdminStaff,
          },
          {
            path: "reports",
            Component: AdminReports,
          },
          {
            path: "social-platforms",
            Component: SocialPlatforms,
          },
          {
            path: "settings",
            Component: AdminSettings,
          },
        ],
      },
    ],
  },
  {
    path: "/staff",
    element: <ProtectedRoute allowedRoles={["manager", "cashier", "technician"]} />,
    children: [
      {
        path: "",
        element: <UnifiedLayout><Outlet /></UnifiedLayout>,
        children: [
          {
            index: true,
            Component: StaffDashboard,
          },
          {
            path: "pos",
            Component: StaffPOS,
          },
          {
            path: "tickets",
            Component: StaffTickets,
          },
          {
            path: "customers",
            Component: StaffCustomers,
          },
          {
            path: "products",
            Component: StaffProducts,
          },
        ],
      },
    ],
  },
]);
