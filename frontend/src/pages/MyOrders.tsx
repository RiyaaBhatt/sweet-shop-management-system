import React, { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { ordersApi } from "@/api/orders";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MyOrders: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);

  type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  type Order = {
    id: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    total: number;
  };

  const { data, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await ordersApi.getMyOrders();
      return res.data as Order[];
    },
    enabled: !!user,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (user) refetch();
  }, [user, refetch]);

  if (!user)
    return <div className="p-4">Please login to view your orders.</div>;

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {!data || data.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <div className="grid gap-4">
          {data.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>
                  Order #{order.id} - {order.status}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="mt-2">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between py-1">
                      <div>
                        {it.name} x {it.quantity}
                      </div>
                      <div>₹{it.price * it.quantity}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-medium">Total: ₹{order.total}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
