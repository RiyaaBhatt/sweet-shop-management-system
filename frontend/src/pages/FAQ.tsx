import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Package, Truck, CreditCard, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle } from '@/components/ui/sweet-card';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Orders & Products',
      question: 'What types of sweets do you offer?',
      answer: 'We offer a wide variety of traditional Indian sweets including Kaju Katli, Gulab Jamun, Rasgulla, Jalebi, various types of Barfi and Laddu, as well as sugar-free options and premium dry fruits. All our sweets are made fresh daily using authentic recipes and premium ingredients.',
    },
    {
      id: '2',
      category: 'Orders & Products',
      question: 'Are your sweets made fresh daily?',
      answer: 'Yes, absolutely! All our sweets are prepared fresh every day in our FSSAI-certified kitchen. We never use preservatives or artificial colors, ensuring you get the freshest and most authentic taste.',
    },
    {
      id: '3',
      category: 'Orders & Products',
      question: 'Do you have sugar-free options?',
      answer: 'Yes, we have a dedicated range of sugar-free sweets made with natural sweeteners like dates, jaggery, and stevia. These are perfect for health-conscious customers and those managing diabetes.',
    },
    {
      id: '4',
      category: 'Delivery & Shipping',
      question: 'Which areas do you deliver to?',
      answer: 'We deliver to all major cities across India. Local delivery in Mumbai is available within 2-4 hours, while other cities typically receive orders within 1-3 business days depending on the location.',
    },
    {
      id: '5',
      category: 'Delivery & Shipping',
      question: 'What are your delivery charges?',
      answer: 'Delivery charges vary by location and order value. Orders above ₹1000 qualify for free delivery within Mumbai. For other cities, charges range from ₹50-150. Express delivery options are also available.',
    },
    {
      id: '6',
      category: 'Delivery & Shipping',
      question: 'Can I track my order?',
      answer: 'Yes, once your order is dispatched, you\'ll receive a tracking number via SMS and email. You can track your order real-time on our website or through the courier partner\'s website.',
    },
    {
      id: '7',
      category: 'Payment & Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including UPI, credit/debit cards, net banking, and cash on delivery (where available). All online transactions are secured with 256-bit SSL encryption.',
    },
    {
      id: '8',
      category: 'Payment & Pricing',
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer attractive discounts for bulk orders, especially for weddings, festivals, and corporate events. Please contact us directly for custom pricing on orders above ₹5000.',
    },
    {
      id: '9',
      category: 'Returns & Quality',
      question: 'What is your return/refund policy?',
      answer: 'We strive for 100% customer satisfaction. If you\'re not satisfied with your order, please contact us within 24 hours of delivery. We offer refunds or replacements for quality issues or damaged products.',
    },
    {
      id: '10',
      category: 'Returns & Quality',
      question: 'How do you ensure quality and freshness?',
      answer: 'Our sweets are made in small batches daily, packed in food-grade containers, and shipped with temperature-controlled packaging when needed. We follow strict FSSAI guidelines and maintain the highest hygiene standards.',
    },
    {
      id: '11',
      category: 'Special Services',
      question: 'Do you provide gift wrapping?',
      answer: 'Yes, we offer beautiful gift wrapping services for ₹50 extra. We also provide personalized messages and premium gift boxes for special occasions.',
    },
    {
      id: '12',
      category: 'Special Services',
      question: 'Can I customize orders for events?',
      answer: 'Absolutely! We specialize in custom orders for weddings, birthdays, festivals, and corporate events. We can create personalized sweet boxes, custom packaging, and even develop new flavors based on your requirements.',
    },
  ];

  const categories = [
    { name: 'Orders & Products', icon: <Package className="h-5 w-5" />, color: 'text-sweet-gold' },
    { name: 'Delivery & Shipping', icon: <Truck className="h-5 w-5" />, color: 'text-sweet-mint' },
    { name: 'Payment & Pricing', icon: <CreditCard className="h-5 w-5" />, color: 'text-sweet-pink' },
    { name: 'Returns & Quality', icon: <Shield className="h-5 w-5" />, color: 'text-primary' },
    { name: 'Special Services', icon: <HelpCircle className="h-5 w-5" />, color: 'text-muted-foreground' },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const groupedFaqs = categories.map(category => ({
    ...category,
    faqs: filteredFaqs.filter(faq => faq.category === category.name)
  }));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about our sweets, orders, delivery, and services
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => (
            <SweetCard key={category.name} variant="hover" className="text-center group cursor-pointer">
              <SweetCardContent className="p-4">
                <div className={`${category.color} group-hover:scale-110 transition-transform duration-300 mb-2 flex justify-center`}>
                  {category.icon}
                </div>
                <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {faqs.filter(faq => faq.category === category.name).length} questions
                </p>
              </SweetCardContent>
            </SweetCard>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {groupedFaqs.map((group) => {
            if (group.faqs.length === 0) return null;
            
            return (
              <div key={group.name}>
                <div className="flex items-center mb-6">
                  <div className={`${group.color} mr-3`}>
                    {group.icon}
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{group.name}</h2>
                </div>

                <div className="space-y-4">
                  {group.faqs.map((faq) => (
                    <SweetCard key={faq.id} variant="default" className="overflow-hidden">
                      <SweetCardContent className="p-0">
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full p-6 text-left hover:bg-muted/30 transition-colors focus:outline-none focus:bg-muted/30"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-foreground pr-4">{faq.question}</h3>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        
                        {openItems.includes(faq.id) && (
                          <div className="px-6 pb-6 animate-fade-in">
                            <div className="pt-4 border-t border-border">
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </SweetCardContent>
                    </SweetCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">No FAQs found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any questions matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-hero rounded-2xl p-8 text-white">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Call: +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;