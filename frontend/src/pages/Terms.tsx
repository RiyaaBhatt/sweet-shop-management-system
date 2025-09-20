import React from 'react';
import { FileText, Shield, ShoppingCart, Truck, RefreshCw, AlertTriangle } from 'lucide-react';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle } from '@/components/ui/sweet-card';

const Terms: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="h-6 w-6" />,
      content: `By accessing and using the Sweet Delights website and services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and Sweet Delights.

If you do not agree to abide by the above, please do not use this service. We reserve the right to update these terms at any time without prior notice.`,
    },
    {
      id: 'products-services',
      title: 'Products and Services',
      icon: <ShoppingCart className="h-6 w-6" />,
      content: `Sweet Delights offers traditional Indian sweets, confectionery, dry fruits, and related products for sale through our website and physical stores.

• All products are subject to availability
• Prices are subject to change without notice
• Product images are for illustration purposes only
• We reserve the right to limit quantities purchased
• Custom orders require advance booking and may have different terms
• Seasonal and festival specials have limited availability periods`,
    },
    {
      id: 'ordering-payment',
      title: 'Ordering and Payment',
      icon: <Shield className="h-6 w-6" />,
      content: `When you place an order with us, you agree to:

• Provide accurate and complete information
• Pay the full amount including applicable taxes and delivery charges
• Accept responsibility for all charges incurred under your account
• Confirm order details before completing purchase

Payment Methods:
• We accept UPI, credit/debit cards, net banking, and cash on delivery (where available)
• All online payments are processed through secure, encrypted systems
• Payment must be received before order processing
• Failed payments may result in order cancellation`,
    },
    {
      id: 'delivery-shipping',
      title: 'Delivery and Shipping',
      icon: <Truck className="h-6 w-6" />,
      content: `Delivery Terms:

• Delivery times are estimates and may vary based on location and demand
• We are not responsible for delays caused by weather, natural disasters, or courier issues
• A signature may be required upon delivery
• Delivery addresses cannot be changed once order is dispatched
• Additional charges apply for express or same-day delivery

Risk of Loss:
• Risk of loss and title for products pass to you upon delivery
• Please inspect products upon delivery and report any issues immediately
• We are not responsible for stolen or damaged packages after successful delivery`,
    },
    {
      id: 'returns-cancellations',
      title: 'Returns and Cancellations',
      icon: <RefreshCw className="h-6 w-6" />,
      content: `Order Cancellations:
• Orders can be cancelled free of charge before preparation begins
• Once preparation starts, cancellation fees may apply
• Custom orders cannot be cancelled once production begins

Returns and Refunds:
• Due to the perishable nature of our products, returns are limited
• We accept returns only for damaged, defective, or incorrect products
• Return requests must be made within 24 hours of delivery
• Refunds will be processed to the original payment method within 7-10 business days
• Custom orders are non-returnable unless defective`,
    },
    {
      id: 'quality-safety',
      title: 'Product Quality and Food Safety',
      icon: <Shield className="h-6 w-6" />,
      content: `We are committed to providing high-quality, safe food products:

• All products are prepared in FSSAI-certified facilities
• We follow strict hygiene and quality control standards
• Products are made fresh daily without preservatives
• Proper packaging and temperature control during shipping
• Best before dates are clearly marked on all products

Customer Responsibilities:
• Store products as instructed upon receipt
• Consume products within recommended timeframes
• Follow any specific storage instructions provided
• Report any quality issues immediately`,
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Shield className="h-6 w-6" />,
      content: `All content on this website, including but not limited to text, graphics, logos, images, recipes, and software, is the property of Sweet Delights and is protected by intellectual property laws.

You may not:
• Copy, modify, or distribute our content without permission
• Use our trademarks or brand names without authorization
• Reproduce our recipes for commercial purposes
• Create derivative works based on our content

Limited License:
We grant you a limited, non-exclusive license to access and use our website for personal, non-commercial purposes only.`,
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: <AlertTriangle className="h-6 w-6" />,
      content: `To the maximum extent permitted by law, Sweet Delights shall not be liable for:

• Indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Damages arising from product allergies (customer responsible for checking ingredients)
• Issues arising from third-party services (payment gateways, delivery partners)

Maximum Liability:
Our total liability for any claim shall not exceed the amount paid for the specific product or service giving rise to the claim.

Force Majeure:
We are not responsible for delays or failures due to circumstances beyond our control, including natural disasters, government actions, or supply chain disruptions.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Please read these Terms of Service carefully before using our website or purchasing our products. 
            These terms govern your relationship with Sweet Delights and outline your rights and responsibilities.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-gold group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Fair Ordering</h3>
              <p className="text-sm text-muted-foreground">
                Transparent pricing and clear ordering process
              </p>
            </SweetCardContent>
          </SweetCard>
          
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-mint group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Reliable Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Timely delivery with proper packaging and care
              </p>
            </SweetCardContent>
          </SweetCard>
          
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-pink group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                FSSAI certified with strict quality standards
              </p>
            </SweetCardContent>
          </SweetCard>
          
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-primary group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <RefreshCw className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Customer Support</h3>
              <p className="text-sm text-muted-foreground">
                Responsive support for orders and issues
              </p>
            </SweetCardContent>
          </SweetCard>
        </div>

        {/* Terms Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <SweetCard key={section.id} variant="default" id={section.id}>
              <SweetCardContent className="p-8">
                <SweetCardHeader className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-4">
                      {section.icon}
                    </div>
                    <SweetCardTitle className="text-2xl">{section.title}</SweetCardTitle>
                  </div>
                </SweetCardHeader>
                
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </SweetCardContent>
            </SweetCard>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-16">
          <SweetCard variant="default" className="border-l-4 border-l-primary">
            <SweetCardContent className="p-8">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-primary mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-2">Important Notice</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These terms and conditions are governed by the laws of India. Any disputes arising from 
                    these terms will be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra. 
                    If any part of these terms is found to be invalid, the remaining parts will continue to be enforceable.
                  </p>
                </div>
              </div>
            </SweetCardContent>
          </SweetCard>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:legal@sweetdelights.com" className="text-primary hover:text-primary/80">
              legal@sweetdelights.com
            </a>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/privacy" className="text-primary hover:text-primary/80 font-medium">
              Privacy Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/cookies" className="text-primary hover:text-primary/80 font-medium">
              Cookie Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/returns" className="text-primary hover:text-primary/80 font-medium">
              Return Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/contact" className="text-primary hover:text-primary/80 font-medium">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;