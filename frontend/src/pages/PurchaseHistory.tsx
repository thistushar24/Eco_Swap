import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Download, 
  Star, 
  Package, 
  Truck, 
  CheckCircle, 
  RotateCcw,
  MessageCircle,
  Leaf,
  Calendar,
  DollarSign,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PurchaseHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const orders = [
    {
      id: "ECO-2024-001",
      date: "2024-01-15",
      status: "delivered",
      items: [
        {
          id: 1,
          title: "MacBook Air M1 - Excellent Condition",
          price: 899,
          image: "/api/placeholder/100/100",
          seller: "TechSaver92",
          quantity: 1,
          eco_score: 92,
          co2_saved: 12.5
        }
      ],
      total: 899,
      shipping: 0,
      tax: 71.92,
      finalTotal: 970.92,
      trackingNumber: "1Z999AA1234567890",
      canReview: true,
      canReturn: false
    },
    {
      id: "ECO-2024-002",
      date: "2024-01-08",
      status: "delivered",
      items: [
        {
          id: 2,
          title: "Vintage Leather Jacket - Size M",
          price: 125,
          image: "/api/placeholder/100/100",
          seller: "VintageVibes",
          quantity: 1,
          eco_score: 95,
          co2_saved: 8.2
        },
        {
          id: 3,
          title: "Sustainable Yoga Mat - Eco-Friendly",
          price: 45,
          image: "/api/placeholder/100/100",
          seller: "EcoWarrior",
          quantity: 1,
          eco_score: 98,
          co2_saved: 3.2
        }
      ],
      total: 170,
      shipping: 0,
      tax: 13.60,
      finalTotal: 183.60,
      trackingNumber: "1Z999BB1234567891",
      canReview: true,
      canReturn: true
    },
    {
      id: "ECO-2024-003",
      date: "2024-01-20",
      status: "in_transit",
      items: [
        {
          id: 4,
          title: "Professional Camera Lens - Canon 50mm",
          price: 299,
          image: "/api/placeholder/100/100",
          seller: "PhotoPro",
          quantity: 1,
          eco_score: 88,
          co2_saved: 6.8
        }
      ],
      total: 299,
      shipping: 0,
      tax: 23.92,
      finalTotal: 322.92,
      trackingNumber: "1Z999CC1234567892",
      canReview: false,
      canReturn: false
    },
    {
      id: "ECO-2024-004",
      date: "2024-01-22",
      status: "processing",
      items: [
        {
          id: 5,
          title: "Designer Coffee Table - Mid-Century Modern",
          price: 275,
          image: "/api/placeholder/100/100",
          seller: "ModernLiving",
          quantity: 1,
          eco_score: 90,
          co2_saved: 18.5
        }
      ],
      total: 275,
      shipping: 25,
      tax: 24.00,
      finalTotal: 324.00,
      trackingNumber: null,
      canReview: false,
      canReturn: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_transit':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-yellow-500" />;
      default:
        return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      default:
        return 'Unknown';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'in_transit':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleReorder = (orderId: string) => {
    toast({
      title: "Items Added to Cart",
      description: `Items from order ${orderId} have been added to your cart.`,
    });
  };

  const handleWriteReview = (itemId: number) => {
    toast({
      title: "Review Form Opened",
      description: "You can now write a review for this item.",
    });
  };

  const handleTrackOrder = (trackingNumber: string) => {
    toast({
      title: "Tracking Information",
      description: `Tracking order with number: ${trackingNumber}`,
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    if (!matchesSearch || !matchesStatus) return false;

    if (filterPeriod === 'all') return true;
    
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (filterPeriod) {
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'quarter':
        return daysDiff <= 90;
      default:
        return true;
    }
  });

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.finalTotal, 0),
    totalCO2Saved: orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + (item.co2_saved * item.quantity), 0), 0
    ),
    avgEcoScore: Math.round(
      orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.eco_score, 0) / order.items.length, 0
      ) / orders.length
    )
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Purchase History</h1>
          <p className="text-muted-foreground">
            Track your orders and view your sustainable shopping impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                  <p className="text-2xl font-bold">{stats.totalCO2Saved.toFixed(1)} kg</p>
                </div>
                <Leaf className="w-8 h-8 text-eco-green-light" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Eco Score</p>
                  <p className="text-2xl font-bold">{stats.avgEcoScore}%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${order.finalTotal.toFixed(2)}</div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          variant="secondary" 
                          className="absolute top-0 right-0 text-xs bg-eco-green-light text-white"
                        >
                          {item.eco_score}%
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors">
                          <h4 className="font-medium mb-1">{item.title}</h4>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {item.seller}</span>
                          <span>Qty: {item.quantity}</span>
                          <div className="flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-eco-green-light" />
                            <span>{item.co2_saved} kg CO₂ saved</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">${item.price}</div>
                        {order.canReview && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleWriteReview(item.id)}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {order.trackingNumber && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTrackOrder(order.trackingNumber!)}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>
                    )}
                    {order.canReturn && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Return
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                  
                  <Button 
                    variant="eco" 
                    size="sm"
                    onClick={() => handleReorder(order.id)}
                  >
                    Buy Again
                  </Button>
                </div>

                {/* Environmental Impact Summary */}
                <div className="p-3 bg-eco-green-light/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-eco-green-light" />
                      <span className="font-medium text-eco-green-dark">Environmental Impact</span>
                    </div>
                    <span className="text-eco-green-dark font-medium">
                      {order.items.reduce((sum, item) => sum + (item.co2_saved * item.quantity), 0).toFixed(1)} kg CO₂ saved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStatus !== 'all' || filterPeriod !== 'all'
                ? "Try adjusting your filters to see more results."
                : "You haven't made any purchases yet. Start shopping to see your orders here!"}
            </p>
            <Link to="/products">
              <Button variant="eco">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PurchaseHistory;