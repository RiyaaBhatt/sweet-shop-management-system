import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import { Minus, Plus, Trash } from "lucide-react";
import { purchaseSweet } from "@/store/slices/productsSlice";
import { addToast } from "@/store/slices/uiSlice";
import { ordersApi } from "@/api/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, itemsCount } = useAppSelector((s) => s.cart);

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleChange = useCallback(
    (id: string, next: number) => {
      dispatch(updateQuantity({ id, quantity: Math.max(0, next) }));
    },
    [dispatch]
  );
  const handlePurchase = useCallback(
    async (id: number) => {
      try {
        await dispatch(purchaseSweet({ id, quantity: 1 })).unwrap();
        dispatch(addToast({ message: "Purchase successful", type: "success" }));
      } catch (err) {
        dispatch(
          addToast({
            message: "Purchase failed due to insufficient quantity",
            type: "error",
          })
        );
      }
    },
    [dispatch]
  );
  const handleClear = () => dispatch(clearCart());

  // Checkout dialog state
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    if (!recipientName || !deliveryAddress || !phoneNumber) {
      dispatch(
        addToast({
          message: "Please fill required delivery details.",
          type: "error",
        })
      );
      return;
    }

    try {
      const payloadItems = items.map((it) => ({
        productId: Number(it.id),
        quantity: it.quantity,
        price: it.price,
      }));

      await ordersApi.createOrder(payloadItems, {
        recipientName,
        deliveryAddress,
        phoneNumber,
        notes,
      });

      dispatch(clearCart());
      setCheckoutOpen(false);
      dispatch(
        addToast({ message: "Order placed successfully", type: "success" })
      );
      navigate("/orders");
    } catch (err) {
      dispatch(addToast({ message: "Failed to place order", type: "error" }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <div className="text-sm text-muted-foreground">
          {itemsCount} item(s)
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg">Your cart is empty.</p>
          <Link to="/products">
            <Button className="mt-4">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 border rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      ₹{item.price}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-3">
                    <div className="flex items-center border rounded">
                      <button
                        aria-label="decrease"
                        onClick={() => handleChange(item.id, item.quantity - 1)}
                        className="px-2 py-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="px-3">{item.quantity}</div>
                      <button
                        aria-label="increase"
                        onClick={() => handleChange(item.id, item.quantity + 1)}
                        className="px-2 py-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="p-4 border rounded-md h-fit">
            <h4 className="text-lg font-medium mb-4">Order Summary</h4>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{total}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-muted-foreground">Delivery</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>

            <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mb-2">Proceed to Checkout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                  <DialogDescription>
                    Enter delivery details to place your order.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-2">
                  <label className="block">
                    <span className="text-sm">Recipient Name</span>
                    <input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm">Delivery Address</span>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm">Phone Number</span>
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm">Notes (optional)</span>
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </label>
                </div>

                <DialogFooter>
                  <Button onClick={handleConfirmOrder}>Place Order</Button>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" className="w-full" onClick={handleClear}>
              Clear Cart
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
