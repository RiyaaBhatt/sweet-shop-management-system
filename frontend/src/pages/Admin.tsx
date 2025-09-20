import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, Plus, Settings, BarChart3, FileText } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SweetCard, SweetCardContent, SweetCardHeader, SweetCardTitle, SweetCardDescription } from '@/components/ui/sweet-card';
import SweetManagement from '@/components/admin/SweetManagement';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: products, isLoading } = useAppSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      dispatch(addToast({
        message: 'Access denied. Admin privileges required.',
        type: 'error',
      }));
      navigate('/login');
      return;
    }
    
    dispatch(fetchProducts());
  }, [isAuthenticated, user, navigate, dispatch]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package className="h-8 w-8" />,
      color: 'text-sweet-gold',
      bg: 'bg-sweet-gold/10',
    },
    {
      title: 'Orders Today',
      value: '24',
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'text-sweet-mint',
      bg: 'bg-sweet-mint/10',
    },
    {
      title: 'Active Customers',
      value: '1,247',
      icon: <Users className="h-8 w-8" />,
      color: 'text-sweet-pink',
      bg: 'bg-sweet-pink/10',
    },
    {
      title: 'Revenue This Month',
      value: '₹2,45,670',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const recentOrders = [
    { id: '001', customer: 'Priya Sharma', items: 'Kaju Katli, Gulab Jamun', amount: '₹850', status: 'Completed' },
    { id: '002', customer: 'Rajesh Kumar', items: 'Mixed Sweet Box', amount: '₹1,200', status: 'Processing' },
    { id: '003', customer: 'Anita Singh', items: 'Sugar-Free Laddu', amount: '₹600', status: 'Shipped' },
    { id: '004', customer: 'Vikram Patel', items: 'Dry Fruits Box', amount: '₹1,500', status: 'Pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage your sweet shop operations.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <SweetCard key={index} variant="hover" className="group">
                  <SweetCardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                    </div>
                  </SweetCardContent>
                </SweetCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <SweetCard variant="default">
                <SweetCardContent className="p-6">
                  <SweetCardHeader className="mb-6">
                    <SweetCardTitle className="text-xl">Recent Orders</SweetCardTitle>
                    <SweetCardDescription>Latest customer orders and their status</SweetCardDescription>
                  </SweetCardHeader>

                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground">#{order.id}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.items}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-primary">{order.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </Button>
                </SweetCardContent>
              </SweetCard>

              {/* Quick Actions */}
              <SweetCard variant="default">
                <SweetCardContent className="p-6">
                  <SweetCardHeader className="mb-6">
                    <SweetCardTitle className="text-xl">Quick Actions</SweetCardTitle>
                    <SweetCardDescription>Common administrative tasks</SweetCardDescription>
                  </SweetCardHeader>

                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="sweet" className="justify-start h-12" size="lg" onClick={() => setActiveTab('products')}>
                      <Plus className="h-4 w-4 mr-3" />
                      Manage Products
                    </Button>
                    <Button variant="mint" className="justify-start h-12" size="lg" onClick={() => setActiveTab('products')}>
                      <Package className="h-4 w-4 mr-3" />
                      Inventory Management
                    </Button>
                    <Button variant="pink" className="justify-start h-12" size="lg" onClick={() => setActiveTab('orders')}>
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Process Orders
                    </Button>
                    <Button variant="cream" className="justify-start h-12" size="lg">
                      <Users className="h-4 w-4 mr-3" />
                      Customer Management
                    </Button>
                    <Button variant="gradient" className="justify-start h-12" size="lg" onClick={() => setActiveTab('reports')}>
                      <TrendingUp className="h-4 w-4 mr-3" />
                      Sales Analytics
                    </Button>
                  </div>
                </SweetCardContent>
              </SweetCard>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <SweetManagement />
          </TabsContent>

          <TabsContent value="orders">
            <SweetCard variant="default">
              <SweetCardContent className="p-6">
                <SweetCardHeader className="mb-6">
                  <SweetCardTitle className="text-2xl">Order Management</SweetCardTitle>
                  <SweetCardDescription>
                    View and manage customer orders
                  </SweetCardDescription>
                </SweetCardHeader>
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Order Management</h3>
                  <p className="text-muted-foreground">
                    Order management features will be available with full API integration
                  </p>
                </div>
              </SweetCardContent>
            </SweetCard>
          </TabsContent>

          <TabsContent value="reports">
            <SweetCard variant="default">
              <SweetCardContent className="p-6">
                <SweetCardHeader className="mb-6">
                  <SweetCardTitle className="text-2xl">Reports & Analytics</SweetCardTitle>
                  <SweetCardDescription>
                    Sales reports and business analytics
                  </SweetCardDescription>
                </SweetCardHeader>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Advanced analytics and reporting will be available with full API integration
                  </p>
                </div>
              </SweetCardContent>
            </SweetCard>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;