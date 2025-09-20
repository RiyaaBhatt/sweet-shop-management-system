import React from 'react';
import { Shield, Eye, Lock, Users, Mail, Phone } from 'lucide-react';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle } from '@/components/ui/sweet-card';

const Privacy: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Users className="h-6 w-6" />,
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support. This includes:
      
      • Personal information (name, email address, phone number, shipping address)
      • Payment information (processed securely through encrypted payment gateways)
      • Order history and preferences
      • Communication records when you contact our customer service
      • Device information and usage data when you visit our website`,
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <Eye className="h-6 w-6" />,
      content: `We use the information we collect to:
      
      • Process and fulfill your orders
      • Provide customer service and support
      • Send you order confirmations, shipping notifications, and delivery updates
      • Communicate about promotions, new products, and special offers (with your consent)
      • Improve our products, services, and website experience
      • Prevent fraud and ensure security
      • Comply with legal obligations`,
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: <Shield className="h-6 w-6" />,
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
      
      • With trusted service providers who help us operate our business (payment processors, shipping companies, etc.)
      • When required by law or to protect our rights and safety
      • In connection with a business transfer or acquisition
      • With your explicit consent
      
      All third-party service providers are bound by confidentiality agreements and are prohibited from using your information for any purpose other than providing services to us.`,
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="h-6 w-6" />,
      content: `We implement appropriate technical and organizational security measures to protect your personal information:
      
      • 256-bit SSL encryption for all data transmission
      • Secure payment processing through PCI DSS compliant systems
      • Regular security audits and vulnerability assessments
      • Limited access to personal information on a need-to-know basis
      • Secure data storage with backup and recovery procedures
      
      While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but we continuously work to improve our security measures.`,
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <Eye className="h-6 w-6" />,
      content: `We use cookies and similar tracking technologies to:
      
      • Remember your preferences and shopping cart contents
      • Analyze website traffic and user behavior
      • Provide personalized content and recommendations
      • Improve our website functionality and user experience
      
      You can control cookie settings through your browser preferences. However, disabling cookies may limit some website functionality.`,
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: <Users className="h-6 w-6" />,
      content: `You have the following rights regarding your personal information:
      
      • Access: Request a copy of the personal information we hold about you
      • Correction: Update or correct inaccurate information
      • Deletion: Request deletion of your personal information (subject to legal requirements)
      • Portability: Request transfer of your data to another service provider
      • Opt-out: Unsubscribe from marketing communications at any time
      • Restriction: Request restriction of processing in certain circumstances
      
      To exercise these rights, please contact us using the information provided below.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            At Sweet Delights, we are committed to protecting your privacy and personal information. 
            This policy explains how we collect, use, and safeguard your data when you use our services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-gold group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Data Protection</h3>
              <p className="text-sm text-muted-foreground">
                Your personal information is protected with industry-standard security measures
              </p>
            </SweetCardContent>
          </SweetCard>
          
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-mint group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Secure Transactions</h3>
              <p className="text-sm text-muted-foreground">
                All payments are processed through encrypted, PCI-compliant systems
              </p>
            </SweetCardContent>
          </SweetCard>
          
          <SweetCard variant="hover" className="text-center group">
            <SweetCardContent className="p-6">
              <div className="text-sweet-pink group-hover:scale-110 transition-transform duration-300 mb-4 flex justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">Your Rights</h3>
              <p className="text-sm text-muted-foreground">
                You have full control over your personal data and privacy preferences
              </p>
            </SweetCardContent>
          </SweetCard>
        </div>

        {/* Privacy Policy Sections */}
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

        {/* Contact Information */}
        <div className="mt-16">
          <SweetCard variant="gradient" className="text-center">
            <SweetCardContent className="p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact us.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-foreground">privacy@sweetdelights.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-foreground">+91 98765 43210</span>
                </div>
              </div>
            </SweetCardContent>
          </SweetCard>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">Related Policies:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/terms" className="text-primary hover:text-primary/80 text-sm font-medium">
              Terms of Service
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/cookies" className="text-primary hover:text-primary/80 text-sm font-medium">
              Cookie Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/returns" className="text-primary hover:text-primary/80 text-sm font-medium">
              Return Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;