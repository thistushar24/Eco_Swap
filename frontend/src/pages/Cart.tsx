import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Leaf, 
  CreditCard,
  Shield,
  Truck,
  Tag,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "MacBook Air M1 - Excellent Condition",
      price: 899,
      originalPrice: 1299,
      image: "/api/placeholder/150/150",
      seller: "TechSaver92",
      condition: "Excellent",
      eco_score: 92,
      co2_saved: 12.5,
      quantity: 1,
      selected: true
    },
    {
      id: 2,
      title: "Vintage Leather Jacket - Size M",
      price: 125,
      originalPrice: 350,
      image: "/api/placeholder/150/150",
      seller: "VintageVibes",
      condition: "Good",
      eco_score: 95,
      co2_saved: 8.2,
      quantity: 1,
      selected: true
    },
    {
      id: 3,
      title: "Sustainable Yoga Mat - Eco-Friendly",
      price: 45,
      originalPrice: 80,
      image: "/api/placeholder/150/150",
      seller: "EcoWarrior",
      condition: "Good",
      eco_score: 98,
      co2_saved: 3.2,
      quantity: 1,
      selected: false
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const toggleItemSelection = (id: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = (selected: boolean) => {
    setCartItems(items => 
      items.map(item => ({ ...item, selected }))
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'ECO10') {
      toast({
        title: "Promo Code Applied!",
        description: "You saved 10% with code ECO10",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your promo code and try again.",
        variant: "destructive"
      });
    }
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalSavings = originalTotal - subtotal;
  const totalCO2Saved = selectedItems.reduce((sum, item) => sum + (item.co2_saved * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart and make a positive impact on the environment.
            </p>
            <Link to="/products">
              <Button variant="eco" size="lg">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select All */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      onCheckedChange={(checked) => selectAllItems(checked as boolean)}
                    />
                    <span className="font-medium">Select All Items</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedItems.length} of {cartItems.length} selected
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className={`transition-all ${item.selected ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Selection Checkbox */}
                      <div className="flex items-start pt-2">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </div>

                      {/* Product Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          variant="secondary" 
                          className="absolute top-1 right-1 text-xs bg-eco-green-light text-white"
                        >
                          {item.eco_score}%
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-medium mb-1">{item.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-primary">${item.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>Sold by {item.seller}</span>
                          <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                          <div className="flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-eco-green-light" />
                            <span>{item.co2_saved} kg CO₂ saved</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-eco-green-dark">
                  <span>You save vs new</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Environmental Impact */}
                <div className="p-3 bg-eco-green-light/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-eco-green-light" />
                    <span className="font-medium text-eco-green-dark">Environmental Impact</span>
                  </div>
                  <p className="text-sm text-eco-green-dark">
                    You'll save <strong>{totalCO2Saved.toFixed(1)} kg of CO₂</strong> with this purchase!
                  </p>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      <Tag className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try code "ECO10" for 10% off
                  </p>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="eco"
                  disabled={selectedItems.length === 0}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Security Features */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Buyer Protection Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3 h-3" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-4">
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;