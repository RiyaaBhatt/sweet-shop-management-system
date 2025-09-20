import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Leaf, Cake, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';
import traditionalImage from '@/assets/traditional-sweets.jpg';
import sugarFreeImage from '@/assets/sugar-free-sweets.jpg';
import dryFruitsImage from '@/assets/dry-fruits.jpg';

const Categories: React.FC = () => {
  const categories = [
    {
      id: 'traditional',
      name: 'Traditional Sweets',
      description: 'Authentic recipes passed down through generations. Made with pure ghee, premium ingredients, and traditional methods.',
      image: traditionalImage,
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-sweet-gold',
      textColor: 'text-sweet-brown',
      items: ['Kaju Katli', 'Gulab Jamun', 'Rasgulla', 'Jalebi', 'Barfi', 'Laddu'],
      count: 45,
    },
    {
      id: 'sugar-free',
      name: 'Sugar-Free Options',
      description: 'Delicious healthy alternatives sweetened with dates, jaggery, and natural sweeteners. Perfect for health-conscious customers.',
      image: sugarFreeImage,
      icon: <Leaf className="h-8 w-8" />,
      color: 'bg-sweet-mint',
      textColor: 'text-sweet-brown',
      items: ['Date Laddu', 'Jaggery Barfi', 'Stevia Sweets', 'Fig Rolls', 'Nut Clusters'],
      count: 28,
    },
    {
      id: 'dry-fruits',
      name: 'Premium Dry Fruits',
      description: 'Hand-picked premium nuts, dates, and dried fruits. Perfect for gifting and healthy snacking.',
      image: dryFruitsImage,
      icon: <Gift className="h-8 w-8" />,
      color: 'bg-sweet-pink',
      textColor: 'text-sweet-brown',
      items: ['Cashews', 'Almonds', 'Pistachios', 'Dates', 'Mixed Nuts', 'Dry Fruit Boxes'],
      count: 32,
    },
    {
      id: 'cakes',
      name: 'Fresh Cakes',
      description: 'Freshly baked cakes for celebrations. Custom designs available for special occasions.',
      image: traditionalImage,
      icon: <Cake className="h-8 w-8" />,
      color: 'bg-sweet-cream',
      textColor: 'text-sweet-brown',
      items: ['Birthday Cakes', 'Wedding Cakes', 'Cupcakes', 'Pastries', 'Custom Designs'],
      count: 20,
    },
    {
      id: 'seasonal',
      name: 'Seasonal Specials',
      description: 'Limited-time seasonal offerings for festivals and special occasions throughout the year.',
      image: traditionalImage,
      icon: <Sparkles className="h-8 w-8" />,
      color: 'bg-gradient-accent',
      textColor: 'text-sweet-brown',
      items: ['Diwali Specials', 'Holi Colors', 'Christmas Treats', 'Eid Delights', 'New Year Gifts'],
      count: 15,
    },
    {
      id: 'gift-boxes',
      name: 'Gift Boxes',
      description: 'Beautifully curated gift boxes perfect for festivals, weddings, and corporate gifting.',
      image: dryFruitsImage,
      icon: <Gift className="h-8 w-8" />,
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      items: ['Festival Boxes', 'Wedding Favors', 'Corporate Gifts', 'Premium Assortments'],
      count: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sweet Categories
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Explore our diverse collection of sweets, from traditional favorites to modern healthy options. 
            Each category is carefully crafted to satisfy every sweet craving.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <SweetCard key={category.id} variant="hover" className="group h-full">
              <SweetCardContent className="p-0 h-full flex flex-col">
                {/* Image */}
                <div className="aspect-video bg-sweet-cream rounded-t-xl overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className={`absolute top-4 left-4 ${category.color} ${category.textColor} p-3 rounded-full`}>
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 text-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {category.count} items
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <SweetCardHeader className="mb-4">
                    <SweetCardTitle className="text-xl mb-2">
                      {category.name}
                    </SweetCardTitle>
                    <SweetCardDescription className="text-sm">
                      {category.description}
                    </SweetCardDescription>
                  </SweetCardHeader>
                  
                  {/* Popular Items */}
                  <div className="mb-4 flex-1">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Popular Items:</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.items.slice(0, 4).map((item, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                      {category.items.length > 4 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{category.items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Button variant="sweet" size="sm" className="w-full" asChild>
                    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                      Explore {category.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </SweetCardContent>
            </SweetCard>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Can't Decide? Try Our Mixed Boxes!
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Get the best of all categories with our carefully curated mixed sweet boxes. 
            Perfect for trying new flavors or sharing with family and friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cream" size="lg" asChild>
              <Link to="/products?featured=true">
                View Mixed Boxes
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/custom-orders">
                Create Custom Box
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;