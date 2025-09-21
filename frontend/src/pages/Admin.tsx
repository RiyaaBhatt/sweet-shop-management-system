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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
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
  // Queries (keep hooks unconditional)
  type OrderType = {
    id: number;
    status: string;
    createdAt: string;
    total?: number;
  };
  type TopProduct = { productId: number; name: string; totalQuantity: number };
  type SalesDay = { date: string; revenue: number; orders: number };
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await adminApi.getStats();
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: topProducts, isLoading: topLoading } = useQuery({
    queryKey: ["admin", "topProducts"],
    queryFn: async () => {
      const res = await adminApi.getTopProducts(10);
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Reports state: preset days or custom range
  const [reportDays, setReportDays] = useState<number>(30);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const {
    data: salesByDay,
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useQuery({
    queryKey: [
      "admin",
      "salesByDay",
      { days: reportDays, from: fromDate, to: toDate },
    ],
    queryFn: async () => {
      if (fromDate && toDate) {
        const res = await adminApi.getSalesByRange(fromDate, toDate);
        return res.data;
      }
      const res = await adminApi.getSalesByDay(reportDays);
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery<OrderType[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const res = await adminApi.getOrders();
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Orders filters & pagination
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: pagedOrders, isLoading: pagedLoading } = useQuery({
    queryKey: ["admin", "orders", { status: statusFilter, page }],
    queryFn: async () => {
      const res = await adminApi.getOrders({
        status: statusFilter,
        page,
        pageSize,
      });
      return res.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const { data: orderDetail, isLoading: orderDetailLoading } = useQuery({
    queryKey: ["admin", "order", selectedOrder],
    queryFn: async () => {
      if (!selectedOrder) return null;
      const res = await adminApi.getOrder(selectedOrder);
      return res.data;
    },
    enabled: !!selectedOrder && isAuthenticated && user?.role === "admin",
  });

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

  const queryClient = useQueryClient();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Admin access required</h2>
          <p className="text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SweetCard variant="hover" className="group">
                <SweetCardContent className="p-6 text-center">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-2">Total Orders</h3>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : statsData?.totalOrders ?? 0}
                    </p>
                  </div>
                </SweetCardContent>
              </SweetCard>
              <SweetCard variant="hover" className="group">
                <SweetCardContent className="p-6 text-center">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-2">Total Users</h3>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : statsData?.totalUsers ?? 0}
                    </p>
                  </div>
                </SweetCardContent>
              </SweetCard>
              <SweetCard variant="hover" className="group">
                <SweetCardContent className="p-6 text-center">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold">
                      {statsLoading ? "..." : `₹${statsData?.totalSales ?? 0}`}
                    </p>
                  </div>
                </SweetCardContent>
              </SweetCard>
              <SweetCard variant="hover" className="group">
                <SweetCardContent className="p-6 text-center">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-2">Top Product</h3>
                    <p className="text-sm">
                      {topLoading
                        ? "..."
                        : (topProducts && topProducts[0]?.name) || "-"}
                    </p>
                  </div>
                </SweetCardContent>
              </SweetCard>
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

                  {ordersLoading ? (
                    <div className="text-center py-12">Loading orders...</div>
                  ) : ordersData && ordersData.length ? (
                    <div className="space-y-3">
                      {ordersData.slice(0, 6).map((o: OrderType) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div>
                            <div className="font-medium">Order #{o.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(o.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{o.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">No recent orders</div>
                  )}
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

                {pagedLoading ? (
                  <div className="text-center py-12">Loading orders...</div>
                ) : pagedOrders && pagedOrders.length ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr>
                            <th className="py-2">Order</th>
                            <th className="py-2">Placed</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Total</th>
                            <th className="py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedOrders.map((o: OrderType) => (
                            <tr key={o.id} className="border-t">
                              <td className="py-2">#{o.id}</td>
                              <td className="py-2">
                                {new Date(o.createdAt).toLocaleString()}
                              </td>
                              <td className="py-2">{o.status}</td>
                              <td className="py-2">
                                {o.total ? `₹${o.total}` : "-"}
                              </td>
                              <td className="py-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedOrder(o.id)}
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateOrderStatus(
                                          o.id,
                                          "Processing"
                                        );
                                        queryClient.invalidateQueries({
                                          queryKey: [
                                            "admin",
                                            "orders",
                                            { status: statusFilter, page },
                                          ],
                                        });
                                        dispatch(
                                          addToast({
                                            message: "Order set to Processing",
                                            type: "success",
                                          })
                                        );
                                      } catch (err) {
                                        dispatch(
                                          addToast({
                                            message: "Failed to update order",
                                            type: "error",
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    Processing
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateOrderStatus(
                                          o.id,
                                          "Shipped"
                                        );
                                        queryClient.invalidateQueries({
                                          queryKey: [
                                            "admin",
                                            "orders",
                                            { status: statusFilter, page },
                                          ],
                                        });
                                        dispatch(
                                          addToast({
                                            message: "Order marked as Shipped",
                                            type: "success",
                                          })
                                        );
                                      } catch (err) {
                                        dispatch(
                                          addToast({
                                            message: "Failed to update order",
                                            type: "error",
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    Shipped
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateOrderStatus(
                                          o.id,
                                          "Completed"
                                        );
                                        queryClient.invalidateQueries({
                                          queryKey: [
                                            "admin",
                                            "orders",
                                            { status: statusFilter, page },
                                          ],
                                        });
                                        dispatch(
                                          addToast({
                                            message: "Order completed",
                                            type: "success",
                                          })
                                        );
                                      } catch (err) {
                                        dispatch(
                                          addToast({
                                            message: "Failed to update order",
                                            type: "error",
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={async () => {
                                      try {
                                        await adminApi.updateOrderStatus(
                                          o.id,
                                          "Cancelled"
                                        );
                                        queryClient.invalidateQueries({
                                          queryKey: [
                                            "admin",
                                            "orders",
                                            { status: statusFilter, page },
                                          ],
                                        });
                                        dispatch(
                                          addToast({
                                            message: "Order cancelled",
                                            type: "success",
                                          })
                                        );
                                      } catch (err) {
                                        dispatch(
                                          addToast({
                                            message: "Failed to cancel order",
                                            type: "error",
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination & Filters */}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <Button
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Prev
                        </Button>
                        <span className="px-3">Page {page}</span>
                        <Button size="sm" onClick={() => setPage((p) => p + 1)}>
                          Next
                        </Button>
                      </div>
                      <div>
                        <label className="text-sm mr-2">Status:</label>
                        <select
                          aria-label="Filter orders by status"
                          value={statusFilter ?? ""}
                          onChange={(e) =>
                            setStatusFilter(e.target.value || undefined)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">No orders found</div>
                )}
              </SweetCardContent>
            </SweetCard>

            {/* Order details modal */}
            {selectedOrder ? (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setSelectedOrder(null)}
                />
                <div className="bg-card rounded-lg shadow-lg p-6 relative w-11/12 max-w-2xl z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Order #{selectedOrder}
                    </h3>
                    <Button size="sm" onClick={() => setSelectedOrder(null)}>
                      Close
                    </Button>
                  </div>
                  {orderDetailLoading ? (
                    <div>Loading...</div>
                  ) : orderDetail ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Placed
                        </div>
                        <div className="font-medium">
                          {new Date(orderDetail.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Status
                        </div>
                        <div className="font-medium">{orderDetail.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Customer
                        </div>
                        <div className="font-medium">
                          {orderDetail.user?.name}
                        </div>
                        <div className="text-sm">{orderDetail.user?.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Delivery
                        </div>
                        <div className="font-medium">
                          {orderDetail.recipientName}
                        </div>
                        <div className="text-sm">
                          {orderDetail.deliveryAddress}
                        </div>
                        <div className="text-sm">{orderDetail.phoneNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Items
                        </div>
                        <div className="space-y-2">
                          {orderDetail.items?.map(
                            (it: {
                              productId: number;
                              orderId: number;
                              quantity: number;
                              price: number;
                              product?: { name?: string };
                            }) => (
                              <div
                                key={`${it.productId}-${it.orderId}`}
                                className="flex justify-between"
                              >
                                <div>
                                  {it.product?.name ||
                                    `Product ${it.productId}`}
                                </div>
                                <div>x{it.quantity}</div>
                                <div>₹{it.price}</div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No details</div>
                  )}
                </div>
              </div>
            ) : null}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Top Products</h4>
                    {topLoading ? (
                      <div>Loading...</div>
                    ) : topProducts && topProducts.length ? (
                      <table className="w-full text-left">
                        <thead>
                          <tr>
                            <th className="py-2">Product</th>
                            <th className="py-2">Quantity Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProducts.map((p: TopProduct) => (
                            <tr key={p.productId} className="border-t">
                              <td className="py-2">{p.name}</td>
                              <td className="py-2">{p.totalQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div>No data</div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium">Sales Report</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setReportDays(7);
                            setFromDate(null);
                            setToDate(null);
                          }}
                        >
                          7d
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setReportDays(30);
                            setFromDate(null);
                            setToDate(null);
                          }}
                        >
                          30d
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setReportDays(90);
                            setFromDate(null);
                            setToDate(null);
                          }}
                        >
                          90d
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-4">
                      <label className="sr-only">From date</label>
                      <input
                        aria-label="From date"
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={fromDate ?? ""}
                        onChange={(e) => setFromDate(e.target.value || null)}
                      />
                      <label className="sr-only">To date</label>
                      <input
                        aria-label="To date"
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={toDate ?? ""}
                        onChange={(e) => setToDate(e.target.value || null)}
                      />
                      <Button size="sm" onClick={() => refetchSales()}>
                        Apply
                      </Button>
                    </div>

                    {salesLoading ? (
                      <div>Loading...</div>
                    ) : salesByDay && salesByDay.length ? (
                      <div>
                        {/* Simple inline bar chart */}
                        <div className="w-full h-40 grid grid-cols-6 gap-2 items-end">
                          {salesByDay
                            .slice(-30)
                            .map((s: SalesDay, idx: number) => {
                              const max = Math.max(
                                ...salesByDay.map((x: SalesDay) => x.revenue),
                                1
                              );
                              const height = Math.round(
                                (s.revenue / max) * 100
                              );
                              return (
                                <div
                                  key={s.date}
                                  className="flex flex-col items-center"
                                  role="img"
                                  aria-label={`Revenue ${s.revenue} on ${s.date}`}
                                >
                                  <div
                                    className="w-full bg-rose-300"
                                    style={{ height: `${height}%` }}
                                    aria-hidden="true"
                                  />
                                  <div className="text-xs mt-1">
                                    {s.date.slice(5)}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="mt-3">
                          <div className="text-sm">
                            Total: ₹
                            {salesByDay.reduce(
                              (a: number, b: SalesDay) => a + b.revenue,
                              0
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>No data</div>
                    )}
                  </div>
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
