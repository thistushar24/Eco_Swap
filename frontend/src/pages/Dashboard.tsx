import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  TrendingUp, 
  ShoppingBag, 
  Heart, 
  Star,
  Plus,
  Package,
  Users,
  Leaf,
  DollarSign,
  Clock,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const [user] = useState({
    name: "Alex Green",
    avatar: "/api/placeholder/150/150",
    ecoScore: 85,
    itemsSold: 23,
    itemsBought: 17,
    savings: 1250,
    co2Saved: 45.2
  });

  const categories = [
    { name: "Electronics", icon: <Package className="w-6 h-6" />, items: 1247, trending: true },
    { name: "Clothing", icon: <ShoppingBag className="w-6 h-6" />, items: 3892, trending: true },
    { name: "Home & Garden", icon: <Leaf className="w-6 h-6" />, items: 2156, trending: false },
    { name: "Books & Media", icon: <Star className="w-6 h-6" />, items: 987, trending: false },
  ];

  const recommendedItems = [
    {
      id: 1,
      title: "MacBook Air M1 - Excellent Condition",
      price: 899,
      originalPrice: 1299,
      image: "/api/placeholder/200/200",
      seller: "TechSaver92",
      rating: 4.8,
      location: "San Francisco",
      eco_score: 92
    },
    {
      id: 2,
      title: "Vintage Leather Jacket - Size M",
      price: 125,
      originalPrice: 350,
      image: "/api/placeholder/200/200",
      seller: "VintageVibes",
      rating: 4.9,
      location: "Portland",
      eco_score: 95
    },
    {
      id: 3,
      title: "Professional Camera Lens - Canon 50mm",
      price: 299,
      originalPrice: 450,
      image: "/api/placeholder/200/200",
      seller: "PhotoPro",
      rating: 5.0,
      location: "New York",
      eco_score: 88
    }
  ];

  const recentActivity = [
    { action: "Purchased", item: "Sustainable Yoga Mat", price: 45, date: "2 hours ago" },
    { action: "Sold", item: "iPhone 12 Pro", price: 650, date: "1 day ago" },
    { action: "Favorited", item: "Vintage Denim Jacket", price: 89, date: "2 days ago" },
    { action: "Listed", item: "Nike Running Shoes", price: 75, date: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🌱</h1>
          <p className="text-muted-foreground">Here's what's happening in your sustainable marketplace</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eco Score</CardTitle>
              <Leaf className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{user.ecoScore}/100</div>
              <Progress value={user.ecoScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                +5 points this week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-eco-green-light" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.itemsSold}</div>
              <p className="text-xs text-muted-foreground">
                +3 this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-eco-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user.savings}</div>
              <p className="text-xs text-muted-foreground">
                vs buying new
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.co2Saved} kg</div>
              <p className="text-xs text-muted-foreground">
                Environmental impact
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Popular Categories
                </CardTitle>
                <CardDescription>
                  Discover trending items in different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category, index) => (
                    <Link 
                      key={index} 
                      to={`/products?category=${category.name.toLowerCase()}`}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group-hover:border-primary">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            {category.icon}
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.items.toLocaleString()} items
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {category.trending && (
                            <Badge variant="secondary" className="text-xs">
                              Trending
                            </Badge>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Items picked based on your interests and eco score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedItems.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`} className="group">
                      <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-primary text-white"
                          >
                            {item.eco_score}% Eco
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-primary">${item.price}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{item.seller}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              <span>{item.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="eco">
                  <Plus className="w-4 h-4 mr-2" />
                  List New Item
                </Button>
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  View Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">
                          {activity.action} {activity.item}
                        </div>
                        <div className="text-muted-foreground">{activity.date}</div>
                      </div>
                      <div className="font-medium text-primary">
                        ${activity.price}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15,247</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-green-light">2.3M kg</div>
                  <div className="text-sm text-muted-foreground">CO₂ Saved Together</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-brown">98.5%</div>
                  <div className="text-sm text-muted-foreground">Happy Traders</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;