import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  MapPin, 
  Grid3X3, 
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Books & Media', 
    'Sports & Outdoors', 'Toys & Games', 'Beauty & Health', 'Automotive'
  ];

  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  const locations = ['Nearby (10 miles)', 'City Wide', 'State Wide', 'Nationwide'];

  // Mock products data
  const products = [
    {
      id: 1,
      title: "MacBook Air M1 - Excellent Condition",
      price: 899,
      originalPrice: 1299,
      image: "/api/placeholder/300/300",
      seller: "TechSaver92",
      rating: 4.8,
      location: "San Francisco, CA",
      condition: "Excellent",
      category: "Electronics",
      eco_score: 92,
      savings: 400,
      co2_saved: 12.5,
      featured: true,
      liked: false
    },
    {
      id: 2,
      title: "Vintage Leather Jacket - Size M",
      price: 125,
      originalPrice: 350,
      image: "/api/placeholder/300/300",
      seller: "VintageVibes",
      rating: 4.9,
      location: "Portland, OR",
      condition: "Good",
      category: "Clothing",
      eco_score: 95,
      savings: 225,
      co2_saved: 8.2,
      featured: false,
      liked: true
    },
    {
      id: 3,
      title: "Professional Camera Lens - Canon 50mm",
      price: 299,
      originalPrice: 450,
      image: "/api/placeholder/300/300",
      seller: "PhotoPro",
      rating: 5.0,
      location: "New York, NY",
      condition: "Like New",
      category: "Electronics",
      eco_score: 88,
      savings: 151,
      co2_saved: 6.8,
      featured: true,
      liked: false
    },
    {
      id: 4,
      title: "Sustainable Yoga Mat - Eco-Friendly",
      price: 45,
      originalPrice: 80,
      image: "/api/placeholder/300/300",
      seller: "EcoWarrior",
      rating: 4.7,
      location: "Austin, TX",
      condition: "Good",
      category: "Sports & Outdoors",
      eco_score: 98,
      savings: 35,
      co2_saved: 3.2,
      featured: false,
      liked: false
    },
    {
      id: 5,
      title: "Designer Coffee Table - Mid-Century Modern",
      price: 275,
      originalPrice: 650,
      image: "/api/placeholder/300/300",
      seller: "ModernLiving",
      rating: 4.6,
      location: "Los Angeles, CA",
      condition: "Excellent",
      category: "Home & Garden",
      eco_score: 90,
      savings: 375,
      co2_saved: 18.5,
      featured: false,
      liked: true
    },
    {
      id: 6,
      title: "Complete Book Set - Harry Potter Collection",
      price: 85,
      originalPrice: 150,
      image: "/api/placeholder/300/300",
      seller: "BookLover23",
      rating: 4.9,
      location: "Seattle, WA",
      condition: "Good",
      category: "Books & Media",
      eco_score: 94,
      savings: 65,
      co2_saved: 4.1,
      featured: false,
      liked: false
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, priceRange]);

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-white">
            Featured
          </Badge>
        )}
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-eco-green-light text-white"
        >
          {product.eco_score}% Eco
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-2 right-2 bg-white/80 hover:bg-white ${
            product.liked ? 'text-red-500' : 'text-muted-foreground'
          }`}
        >
          <Heart className={`w-4 h-4 ${product.liked ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-primary">${product.price}</span>
          <span className="text-sm text-muted-foreground line-through">
            ${product.originalPrice}
          </span>
          <Badge variant="outline" className="text-xs text-eco-green-dark">
            Save ${product.savings}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{product.seller}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span>{product.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline">{product.condition}</Badge>
          <span className="text-eco-green-dark font-medium">
            {product.co2_saved} kg CO₂ saved
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            Discover amazing pre-loved items from our sustainable community
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select defaultValue="relevance">
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="eco-score">Highest Eco Score</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}>
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-categories"
                      checked={!selectedCategory}
                      onCheckedChange={() => setSelectedCategory('')}
                    />
                    <label htmlFor="all-categories" className="text-sm cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category}
                        checked={selectedCategory === category}
                        onCheckedChange={(checked) => 
                          setSelectedCategory(checked ? category : '')
                        }
                      />
                      <label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Condition</h4>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox id={condition} />
                      <label htmlFor={condition} className="text-sm cursor-pointer">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-medium mb-3">Location</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 overflow-hidden rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-medium mb-2 hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-primary">${product.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{product.seller}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span>{product.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{product.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{product.condition}</Badge>
                          <Badge variant="secondary" className="bg-eco-green-light text-white">
                            {product.eco_score}% Eco
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <Button variant="ghost" size="icon">
                          <Heart className={`w-4 h-4 ${product.liked ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                        <Link to={`/product/${product.id}`}>
                          <Button variant="eco" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No products found matching your criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setPriceRange([0, 1000]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;