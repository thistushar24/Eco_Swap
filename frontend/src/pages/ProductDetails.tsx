import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Shield, 
  Truck, 
  RotateCcw, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Calendar,
  User,
  Package,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock product data
  const product = {
    id: 1,
    title: "MacBook Air M1 - Excellent Condition",
    price: 899,
    originalPrice: 1299,
    images: [
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600"
    ],
    description: `This MacBook Air M1 is in excellent condition and has been my trusted companion for the past year. I'm upgrading to the new MacBook Pro, so this beautiful machine needs a new home.

The laptop comes with the original charger, box, and all documentation. The battery health is at 94% and there are no scratches or dents. It has been used primarily for web development and design work.

Perfect for students, professionals, or anyone looking for a reliable and powerful laptop at a great price.`,
    specifications: {
      "Processor": "Apple M1 Chip",
      "Memory": "8GB Unified Memory",
      "Storage": "256GB SSD",
      "Display": "13.3-inch Retina Display",
      "Battery": "94% Health",
      "Color": "Space Gray",
      "Year": "2021"
    },
    condition: "Excellent",
    seller: {
      name: "Sarah Chen",
      username: "TechSaver92",
      avatar: "/api/placeholder/150/150",
      rating: 4.8,
      reviewCount: 47,
      memberSince: "March 2022",
      responseTime: "Usually responds within 1 hour",
      verifiedSeller: true
    },
    location: "San Francisco, CA",
    category: "Electronics",
    eco_score: 92,
    savings: 400,
    co2_saved: 12.5,
    posted: "3 days ago",
    views: 156,
    interested: 23,
    blockchain_history: [
      {
        date: "2021-11-15",
        event: "Original Purchase",
        owner: "Apple Store",
        price: "$1,299"
      },
      {
        date: "2024-01-10",
        event: "Listed on EcoSwap",
        owner: "Sarah Chen",
        price: "$899"
      }
    ],
    shipping: {
      free: true,
      estimatedDays: "3-5 business days",
      methods: ["Standard", "Express"]
    },
    returns: {
      accepted: true,
      period: "14 days",
      condition: "Item must be in same condition"
    }
  };

  const similarProducts = [
    {
      id: 2,
      title: "MacBook Pro 13-inch M1",
      price: 1199,
      image: "/api/placeholder/200/200",
      eco_score: 89
    },
    {
      id: 3,
      title: "iPad Air M1 - Like New",
      price: 549,
      image: "/api/placeholder/200/200",
      eco_score: 95
    },
    {
      id: 4,
      title: "Apple Magic Keyboard",
      price: 89,
      image: "/api/placeholder/200/200",
      eco_score: 91
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleContactSeller = () => {
    toast({
      title: "Message Sent!",
      description: "Your message has been sent to the seller.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Badge 
                variant="secondary" 
                className="absolute top-4 right-4 bg-eco-green-light text-white"
              >
                {product.eco_score}% Eco
              </Badge>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                </div>
                <Badge variant="outline" className="text-eco-green-dark">
                  Save ${product.savings}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {product.posted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{product.views} views</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline" className="text-sm">{product.condition}</Badge>
                <Badge variant="secondary" className="bg-eco-green-light text-white">
                  {product.co2_saved} kg CO₂ saved
                </Badge>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                      <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.seller.name}</span>
                        {product.seller.verifiedSeller && (
                          <Shield className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{product.seller.rating}</span>
                          <span>({product.seller.reviewCount})</span>
                        </div>
                        <span>•</span>
                        <span>Member since {product.seller.memberSince}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/seller/${product.seller.username}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">{product.seller.responseTime}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1" variant="eco" size="lg">
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className="h-11 w-11"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={handleContactSeller}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-muted-foreground">{product.shipping.estimatedDays}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Returns Accepted</div>
                  <div className="text-muted-foreground">{product.returns.period}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium">Buyer Protection</div>
                  <div className="text-muted-foreground">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="blockchain">Ownership History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blockchain" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verified Ownership History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {product.blockchain_history.map((record, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{record.event}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.owner} • {record.date} • {record.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This ownership history is verified on the blockchain and cannot be tampered with, 
                    ensuring transparency and trust in the marketplace.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Products */}
        <Card>
          <CardHeader>
            <CardTitle>Similar Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group">
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2 bg-eco-green-light text-white"
                      >
                        {item.eco_score}% Eco
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                      <div className="text-xl font-bold text-primary">${item.price}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;