import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Leaf, Recycle, Users, Shield, TrendingUp, Star, ArrowRight, CheckCircle } from 'lucide-react';
const Landing = () => {
  const features = [{
    icon: <Recycle className="w-6 h-6" />,
    title: "Circular Economy",
    description: "Extend product lifecycles and reduce waste through smart reuse"
  }, {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    description: "Connect with like-minded individuals building sustainable communities"
  }, {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Trading",
    description: "Blockchain-verified ownership history and secure transactions"
  }, {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Smart Pricing",
    description: "AI-powered recommendations for fair and competitive pricing"
  }];
  const categories = [{
    name: "Electronics",
    count: "2.4k",
    color: "bg-eco-green-light"
  }, {
    name: "Clothing",
    count: "5.8k",
    color: "bg-eco-brown"
  }, {
    name: "Home & Garden",
    count: "3.2k",
    color: "bg-eco-tan"
  }, {
    name: "Books & Media",
    count: "1.9k",
    color: "bg-primary"
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
                🌱 Sustainable Future Starts Here
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Inspire. Empower. Innovate.
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
                Join the sustainable revolution with EcoSwap - where every purchase 
                makes a positive impact on our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="bg-lime-100 text-slate-900">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white bg-lime-200 hover:bg-lime-100 text-slate-950">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose EcoSwap?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're building more than a marketplace - we're creating a sustainable ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover amazing pre-loved items across all categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => <Link key={index} to={`/products?category=${category.name.toLowerCase()}`} className="group">
                <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <CardHeader className="pb-2">
                    <div className={`w-16 h-16 mx-auto mb-4 ${category.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Leaf className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{category.count}</p>
                    <p className="text-sm text-muted-foreground">items available</p>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Items Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3.2M</div>
              <div className="text-muted-foreground">CO₂ Saved (kg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 text-center hero-gradient">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users already making sustainable choices
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="bg-white hover:bg-white/90 text-gray-950">
                    Start Trading Now
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" size="lg" className="border-white bg-lime-100 text-gray-900">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Landing;