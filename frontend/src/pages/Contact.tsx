import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(addToast({
      message: 'Message sent successfully! We\'ll get back to you soon.',
      type: 'success',
    }));
    
    reset();
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Our Store',
      details: ['123 Sweet Street',  'Ahmadabad, Gujarat, India'],
      color: 'text-sweet-gold',
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      details: [ 'Toll Free: 1800-SWEETS'],
      color: 'text-sweet-mint',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      details: ['hello@sweetdelights.com', 'orders@sweetdelights.com', 'support@sweetdelights.com'],
      color: 'text-sweet-pink',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Store Hours',
      details: ['Mon-Sat: 9:00 AM - 9:00 PM', 'Sunday: 10:00 AM - 8:00 PM', 'Online: 24/7'],
      color: 'text-primary',
    },
  ];

  const faqs = [
    {
      question: 'Do you deliver nationwide?',
      answer: 'Yes, we deliver to all major cities across India. Delivery time varies from 1-3 days depending on location.',
    },
    {
      question: 'Are your sweets preservative-free?',
      answer: 'Absolutely! All our sweets are made fresh daily without any artificial preservatives or colors.',
    },
    {
      question: 'Can I place bulk orders for events?',
      answer: 'Yes, we specialize in bulk orders for weddings, festivals, and corporate events. Contact us for special pricing.',
    },
    {
      question: 'Do you have sugar-free options?',
      answer: 'Yes, we have a dedicated range of sugar-free sweets made with natural sweeteners like dates and jaggery.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our sweets or need help with your order? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <SweetCard variant="default" className="shadow-warm">
              <SweetCardContent className="p-8">
                <SweetCardHeader className="mb-6">
                  <SweetCardTitle className="text-2xl flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2 text-primary" />
                    Send Us a Message
                  </SweetCardTitle>
                  <SweetCardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </SweetCardDescription>
                </SweetCardHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </SweetCardContent>
            </SweetCard>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <SweetCard key={index} variant="hover" className="group">
                <SweetCardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${info.color} group-hover:scale-110 transition-transform duration-300`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <SweetCard key={index} variant="default" className="h-full">
                <SweetCardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold mb-3 text-primary">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </SweetCardContent>
              </SweetCard>
            ))}
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="mb-16">
          <SweetCard variant="default">
            <SweetCardContent className="p-0">
              <div className="h-64 bg-gradient-card rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold mb-2">Find Us Here</h3>
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
            </SweetCardContent>
          </SweetCard>
        </div>

      </div>
    </div>
  );
};

export default Contact;