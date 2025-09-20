import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  FileText,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SweetCard,
  SweetCardContent,
  SweetCardHeader,
  SweetCardTitle,
  SweetCardDescription,
} from "@/components/ui/sweet-card";
import SweetManagement from "@/components/admin/SweetManagement";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: products, isLoading } = useAppSelector(
    (state) => state.products
  );
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      dispatch(
        addToast({
          message: "Access denied. Admin privileges required.",
          type: "error",
        })
      );
      navigate("/login");
      return;
    }

    dispatch(fetchProducts({ page: 1 }));
  }, [isAuthenticated, user, navigate, dispatch]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // Replace static placeholder data with 'Coming soon' until real APIs are available
  const stats = [];
  const recentOrders: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
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
            {/* Stats Cards - Coming soon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SweetCard key={i} variant="hover" className="group">
                  <SweetCardContent className="p-6 text-center">
                    <div className="py-8">
                      <h3 className="text-lg font-medium mb-2">Coming soon</h3>
                      <p className="text-sm text-muted-foreground">
                        This statistic will be available once analytics are
                        integrated.
                      </p>
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
                    <SweetCardTitle className="text-xl">
                      Recent Orders
                    </SweetCardTitle>
                    <SweetCardDescription>
                      Latest customer orders and their status
                    </SweetCardDescription>
                  </SweetCardHeader>

                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Order Management
                    </h3>
                    <p className="text-muted-foreground">
                      Order management features will be available with full API
                      integration
                    </p>
                  </div>
                </SweetCardContent>
              </SweetCard>

              {/* Quick Actions */}
              <SweetCard variant="default">
                <SweetCardContent className="p-6">
                  <SweetCardHeader className="mb-6">
                    <SweetCardTitle className="text-xl">
                      Quick Actions
                    </SweetCardTitle>
                    <SweetCardDescription>
                      Common administrative tasks
                    </SweetCardDescription>
                  </SweetCardHeader>

                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      variant="sweet"
                      className="justify-start h-12"
                      size="lg"
                      onClick={() => setActiveTab("products")}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Manage Products
                    </Button>
                    <Button
                      variant="mint"
                      className="justify-start h-12"
                      size="lg"
                      onClick={() => setActiveTab("products")}
                    >
                      <Package className="h-4 w-4 mr-3" />
                      Inventory Management
                    </Button>
                    <Button
                      variant="pink"
                      className="justify-start h-12"
                      size="lg"
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Process Orders
                    </Button>
                    <Button
                      variant="cream"
                      className="justify-start h-12"
                      size="lg"
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Customer Management
                    </Button>
                    <Button
                      variant="gradient"
                      className="justify-start h-12"
                      size="lg"
                      onClick={() => setActiveTab("reports")}
                    >
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
                  <SweetCardTitle className="text-2xl">
                    Order Management
                  </SweetCardTitle>
                  <SweetCardDescription>
                    View and manage customer orders
                  </SweetCardDescription>
                </SweetCardHeader>
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Order Management</h3>
                  <p className="text-muted-foreground">
                    Order management features will be available with full API
                    integration
                  </p>
                </div>
              </SweetCardContent>
            </SweetCard>
          </TabsContent>

          <TabsContent value="reports">
            <SweetCard variant="default">
              <SweetCardContent className="p-6">
                <SweetCardHeader className="mb-6">
                  <SweetCardTitle className="text-2xl">
                    Reports & Analytics
                  </SweetCardTitle>
                  <SweetCardDescription>
                    Sales reports and business analytics
                  </SweetCardDescription>
                </SweetCardHeader>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Advanced analytics and reporting will be available with full
                    API integration
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
