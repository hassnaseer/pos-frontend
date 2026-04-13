import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Shield, BarChart3, Users, Package, Ticket,
  DollarSign, Settings, Clock, TrendingUp, FileText, CheckCircle2,
  Menu, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Database className="size-8 text-blue-600" />
              <span className="font-bold text-xl">Global POS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-blue-600 transition">Features</a>
              <a href="#super-admin" className="text-sm hover:text-blue-600 transition">Super Admin</a>
              <a href="#admin" className="text-sm hover:text-blue-600 transition">Business Admin</a>
              <a href="#staff" className="text-sm hover:text-blue-600 transition">Staff</a>
              <a href="#pricing" className="text-sm hover:text-blue-600 transition">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-sm bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-sm hover:text-blue-600">Features</a>
              <a href="#super-admin" className="block text-sm hover:text-blue-600">Super Admin</a>
              <a href="#admin" className="block text-sm hover:text-blue-600">Business Admin</a>
              <a href="#staff" className="block text-sm hover:text-blue-600">Staff</a>
              <a href="#pricing" className="block text-sm hover:text-blue-600">Pricing</a>
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-bold text-5xl lg:text-7xl tracking-tight mb-6">
                One POS for Every Business
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Manage sales, services, and operations — all from one powerful platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
                <span>★★★★★ 4.9/5</span>
                <span>Trusted by 500+ businesses</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Business analytics dashboard"
                className="rounded-lg shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Super Admin Section */}
      <section id="super-admin" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Platform monitoring"
                className="rounded-lg shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full mb-6">
                <Shield className="size-5 text-blue-400" />
                <span className="text-sm text-blue-300">Super Admin</span>
              </div>

              <h2 className="font-bold text-4xl lg:text-5xl mb-6">
                Platform Control & Oversight
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Complete system-level access to manage businesses, subscriptions, and global configuration
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Database className="size-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Business Management</h3>
                    <p className="text-gray-400">Oversee all registered businesses, subscriptions, and activity</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <DollarSign className="size-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Revenue Analytics</h3>
                    <p className="text-gray-400">Track monthly revenue, trial conversions, and churn metrics</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Settings className="size-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Platform Configuration</h3>
                    <p className="text-gray-400">Manage business types, modules, pricing, and global settings</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Admin Section */}
      <section id="admin" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
                <Users className="size-5 text-green-600" />
                <span className="text-sm text-green-700">Business Admin</span>
              </div>

              <h2 className="font-bold text-4xl lg:text-5xl mb-6">
                Complete Business Operations
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Everything you need to run retail, restaurant, repair, or service businesses from one dashboard
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <BarChart3 className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">POS & Sales</h3>
                    <p className="text-gray-600">Fast checkout with multiple payment methods and real-time inventory</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Ticket className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Ticket System</h3>
                    <p className="text-gray-600">End-to-end repair and service management with status tracking</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Package className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Inventory Management</h3>
                    <p className="text-gray-600">Stock tracking, low-stock alerts, and automated purchase orders</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Reports & Analytics</h3>
                    <p className="text-gray-600">Sales reports, staff performance, and customer insights</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765729003706-355ca161736d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Business operations"
                className="rounded-lg shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section id="staff" className="py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1770226415002-dbbd40327ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Staff operations"
                className="rounded-lg shadow-2xl w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
                <CheckCircle2 className="size-5" />
                <span className="text-sm">Staff Panel</span>
              </div>

              <h2 className="font-bold text-4xl lg:text-5xl mb-6">
                Role-Based Access
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Streamlined interfaces for cashiers, managers, and technicians with permission-based controls
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <DollarSign className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Cashier Access</h3>
                    <p className="text-blue-100">Process sales, manage cart, handle payments with daily activity tracking</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Technician Portal</h3>
                    <p className="text-blue-100">View assigned tickets, update status, add parts and service notes</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 size-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileText className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Manager Tools</h3>
                    <p className="text-blue-100">Approve refunds, view team performance, and oversee all operations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-bold text-4xl lg:text-5xl mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              All features included. No hidden fees.
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-md mx-auto">
              <div className="mb-8">
                <div className="text-5xl font-bold mb-2">$35<span className="text-2xl text-gray-500">/month</span></div>
                <p className="text-gray-600">Annual: 2 months free</p>
              </div>

              <ul className="space-y-4 mb-8 text-left">
                {[
                  'POS & Billing System',
                  'Inventory Management',
                  'Ticket System',
                  'Customer Management',
                  'Reports & Analytics',
                  'Staff Access Control',
                  'Mobile App Access',
                  '24/7 Support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Free Trial — No Credit Card Required
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="size-6 text-blue-400" />
                <span className="font-bold text-lg">Global POS</span>
              </div>
              <p className="text-gray-400 text-sm">
                One platform for every business type
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 Global POS SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
