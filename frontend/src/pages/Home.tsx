import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Gift, Truck, Shield, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";
import { Button } from "@/components/ui/button";
import {
  SweetCard,
  SweetCardContent,
  SweetCardHeader,
  SweetCardTitle,
  SweetCardDescription,
} from "@/components/ui/sweet-card";
import heroImage from "@/assets/hero-sweets.jpg";
import traditionalImage from "@/assets/traditional-sweets.jpg";
import sugarFreeImage from "@/assets/sugar-free-sweets.jpg";
import dryFruitsImage from "@/assets/dry-fruits.jpg";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, isLoading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    {
      name: "Traditional Sweets",
      description: "Authentic recipes passed down through generations",
      image: traditionalImage,
      color: "bg-sweet-gold",
    },
    {
      name: "Sugar-Free",
      description: "Delicious treats without compromising on taste",
      image: sugarFreeImage,
      color: "bg-sweet-mint",
    },
    {
      name: "Dry Fruits",
      description: "Premium nuts and dried fruits collection",
      image: dryFruitsImage,
      color: "bg-sweet-pink",
    },
    {
      name: "Cakes",
      description: "Fresh baked cakes for every celebration",
      image: traditionalImage,
      color: "bg-sweet-cream",
    },
  ];

  const features = [
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: "Gift Wrapping",
      description: "Beautiful packaging for your special moments",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Fresh sweets delivered to your doorstep",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Quality Assured",
      description: "Premium ingredients and traditional methods",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Made with Love",
      description: "Every sweet crafted with care and passion",
    },
  ];

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
              Sweet Delights
              <span className="block text-primary-glow mt-2">Await You</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in drop-shadow-md">
              Discover the finest collection of traditional Indian sweets,
              sugar-free options, and premium confectionery. Made fresh daily
              with authentic recipes and premium ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button variant="hero" size="xl" asChild>
                <Link to="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-sweet-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Sweet Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From traditional favorites to modern healthy options, we have
              something for every sweet tooth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <SweetCard key={category.name} variant="hover" className="group">
                <SweetCardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-2xl">🍯</span>
                  </div>
                  <SweetCardHeader className="text-center">
                    <SweetCardTitle className="text-xl mb-2">
                      {category.name}
                    </SweetCardTitle>
                    <SweetCardDescription>
                      {category.description}
                    </SweetCardDescription>
                  </SweetCardHeader>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}

      {/* Features Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Sweet Delights?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to bringing you the finest sweets with exceptional
              service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Satisfy Your Sweet Cravings?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of happy customers who trust us for their sweet
            celebrations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="cream"
              size="xl"
              asChild
              className="dark:bg-white dark:text-primary"
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="
      border-black text-black hover:bg-black hover:text-white
      dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary
    "
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
