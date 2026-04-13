import { useState } from "react";
import { Link } from "react-router";
import {
  Database, Users, Bell, LogOut, Menu, X, Search, Plus, Minus,
  Activity, Ticket, Package, ShoppingCart, Trash2, DollarSign
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function POS() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");

  const isTechnician = user?.role === "technician";

  const products = [
    { id: "PRD-0001", name: "Premium T-Shirt", category: "Apparel", price: 29.99, stock: 150 },
    { id: "PRD-0002", name: "Running Shoes", category: "Footwear", price: 89.99, stock: 75 },
    { id: "PRD-0003", name: "Laptop Bag", category: "Accessories", price: 49.99, stock: 45 },
    { id: "PRD-0004", name: "Water Bottle", category: "Accessories", price: 19.99, stock: 200 },
    { id: "PRD-0005", name: "Wireless Mouse", category: "Electronics", price: 34.99, stock: 12 },
    { id: "PRD-0006", name: "Notebook Set", category: "Stationery", price: 12.99, stock: 85 },
    { id: "PRD-0007", name: "Coffee Mug", category: "Accessories", price: 14.99, stock: 120 },
    { id: "PRD-0008", name: "USB Cable", category: "Electronics", price: 9.99, stock: 95 },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const change = amountReceived ? parseFloat(amountReceived) - total : 0;

  const handleCheckout = () => {
    alert(`Order completed!\nTotal: $${total.toFixed(2)}\nPayment: ${paymentMethod}\nChange: $${change.toFixed(2)}`);
    setCart([]);
    setIsCheckoutDialogOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setAmountReceived("");
  };

  const clearCart = () => {
    if (confirm("Clear all items from cart?")) {
      setCart([]);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="flex">
       

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Point of Sale</h2>
                  <p className="text-gray-600">Select products to add to cart</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Apparel">Apparel</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Stationery">Stationery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Package className="size-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                        <span className="text-xs text-gray-500">{product.stock} in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Current Order</h3>
                      {cart.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600">
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="size-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 last:border-0">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="size-8 p-0"
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="size-8 p-0"
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 h-auto p-0 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <>
                      <div className="p-6 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tax (10%)</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg pt-2 border-t border-gray-200">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-green-600">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="p-6 border-t border-gray-200">
                        <Button
                          onClick={() => setIsCheckoutDialogOpen(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <DollarSign className="size-4 mr-2" />
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Customer Name (Optional)</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Phone (Optional)</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 555-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="digital">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <Label>Amount Received *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                />
                {amountReceived && parseFloat(amountReceived) >= total && (
                  <p className="text-sm text-green-600">
                    Change: ${change.toFixed(2)}
                  </p>
                )}
              </div>
            )}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700"
              disabled={paymentMethod === "cash" && (!amountReceived || parseFloat(amountReceived) < total)}
            >
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
