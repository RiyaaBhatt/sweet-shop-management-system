import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { addToast } from "@/store/slices/uiSlice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";

type OrderType = {
  id: number;
  status: string;
  createdAt: string;
  total?: number;
};

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const queryClient = useQueryClient();

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

  const { data: orderDetail, isLoading: orderDetailLoading } = useQuery({
    queryKey: ["admin", "order", selectedOrder],
    queryFn: async () => {
      if (!selectedOrder) return null;
      const res = await adminApi.getOrder(selectedOrder);
      return res.data;
    },
    enabled: !!selectedOrder && isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || user?.role !== "admin")
    return <div className="p-8">Access denied</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Order Management</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="sr-only">Status</label>
        <select
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <Button
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] })
          }
        >
          Refresh
        </Button>
      </div>

      <div className="bg-card p-4 rounded">
        {pagedLoading ? (
          <div>Loading...</div>
        ) : pagedOrders && pagedOrders.length ? (
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
                    <td className="py-2">{o.total ? `₹${o.total}` : "-"}</td>
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
                              await adminApi.updateOrderStatus(o.id, "Shipped");
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
        ) : (
          <div>No orders found</div>
        )}

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
        </div>
      </div>

      {/* Order details modal */}
      {selectedOrder ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="bg-card rounded-lg shadow-lg p-6 relative w-11/12 max-w-2xl z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order #{selectedOrder}</h3>
              <Button size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
            {orderDetailLoading ? (
              <div>Loading...</div>
            ) : orderDetail ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Placed</div>
                  <div className="font-medium">
                    {new Date(orderDetail.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium">{orderDetail.status}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{orderDetail.user?.name}</div>
                  <div className="text-sm">{orderDetail.user?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Delivery</div>
                  <div className="font-medium">{orderDetail.recipientName}</div>
                  <div className="text-sm">{orderDetail.deliveryAddress}</div>
                  <div className="text-sm">{orderDetail.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Items</div>
                  <div className="space-y-2">
                    {orderDetail.items?.map((it: any) => (
                      <div
                        key={`${it.productId}-${it.orderId}`}
                        className="flex justify-between"
                      >
                        <div>
                          {it.product?.name || `Product ${it.productId}`}
                        </div>
                        <div>x{it.quantity}</div>
                        <div>₹{it.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>No details</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminOrders;
