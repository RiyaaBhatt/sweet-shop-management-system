import React from 'react';
import { Award, Heart, Users, Clock, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';
import heroImage from '@/assets/hero-sweets.jpg';

const About: React.FC = () => {
  const milestones = [
    { year: '1985', event: 'Sweet Delights founded with a small shop in Mumbai' },
    { year: '1995', event: 'Expanded to 5 locations across the city' },
    { year: '2005', event: 'Introduced online ordering and delivery services' },
    { year: '2015', event: 'Launched sugar-free and healthy sweet options' },
    { year: '2020', event: 'Opened state-of-the-art production facility' },
    { year: '2024', event: 'Serving over 100,000 happy customers nationwide' },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Made with Love',
      description: 'Every sweet is crafted with care, passion, and attention to detail by our experienced artisans.',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Premium Quality',
      description: 'We use only the finest ingredients - pure ghee, premium nuts, and authentic spices.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Family Tradition',
      description: 'Our recipes have been passed down through generations, preserving authentic flavors.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Fresh Daily',
      description: 'All our sweets are made fresh daily in small batches to ensure optimal taste and quality.',
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Food Safety',
      description: 'FSSAI certified facility with strict hygiene standards and quality control processes.',
    },
  ];

  const team = [
    {
      name: 'Rajesh Gupta',
      role: 'Founder & Master Chef',
      description: 'With 40+ years of experience, Rajesh brings authentic traditional recipes to life.',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      description: 'Ensures quality control and manages our state-of-the-art production facility.',
    },
    {
      name: 'Amit Singh',
      role: 'Innovation Chef',
      description: 'Creates new healthy alternatives and seasonal specialties for modern tastes.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Our Sweet Story
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in">
              For nearly four decades, Sweet Delights has been spreading joy through authentic Indian sweets. 
              What started as a small family business has grown into a beloved brand, but our commitment to 
              quality and tradition remains unchanged.
            </p>
            <Button variant="cream" size="lg" className="animate-fade-in">
              Discover Our Products
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-sweet-cream/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                A Legacy of Sweetness
              </h2>
              <p className="text-muted-foreground text-lg">
                From humble beginnings to nationwide recognition
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-foreground font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Makes Us Special
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide everything we do, from sourcing ingredients to serving customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <SweetCard key={index} variant="hover" className="text-center group">
                <SweetCardContent className="p-6">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <SweetCardHeader className="text-center mb-4">
                    <SweetCardTitle className="text-xl">{value.title}</SweetCardTitle>
                  </SweetCardHeader>
                  <SweetCardDescription>{value.description}</SweetCardDescription>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind every sweet creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <SweetCard key={index} variant="default" className="text-center">
                <SweetCardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <SweetCardHeader className="text-center mb-4">
                    <SweetCardTitle className="text-xl">{member.name}</SweetCardTitle>
                    <p className="text-primary font-medium text-sm">{member.role}</p>
                  </SweetCardHeader>
                  <SweetCardDescription>{member.description}</SweetCardDescription>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Awards & Recognition
            </h2>
            <p className="text-muted-foreground text-lg">
              Recognition for our commitment to quality and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Best Sweet Shop 2023',
              'FSSAI Excellence Award',
              'Customer Choice Award',
              'Traditional Recipe Preservation',
            ].map((award, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-medium text-foreground">{award}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Join Our Sweet Family
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the tradition, taste the quality, and become part of our growing family of satisfied customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cream" size="lg">
              Shop Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;