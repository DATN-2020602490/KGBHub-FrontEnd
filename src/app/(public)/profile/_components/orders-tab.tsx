"use client";
import { User } from "@/models";
import { Order } from "@/models/order"; // Assuming you have this type from the previous code
import { orderApiRequest } from "@/services/order.service"; // You'll need to create this service
import { useAccountContext } from "@/contexts/account";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Empty from "@/components/common/empty";
import { userApiRequest } from "@/services/user.service";
import { X } from "lucide-react";

const OrderDetailPopup = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details when popup opens
  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const res = await userApiRequest.getOrderDetail({ id: order.id });
        if (res.status === 200) {
          setOrderDetails(res.payload);
        } else {
          setError("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("An error occurred while fetching order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order.id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray p-6 rounded-lg">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray p-6 rounded-lg">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-semibold">{orderDetails.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={`
                  px-2 py-1 rounded-full text-xs
                  ${
                    orderDetails.status === "SUCCESS"
                      ? "bg-green-100 text-green-800"
                      : orderDetails.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }
                `}
            >
              {orderDetails.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(orderDetails.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-bold">
              {orderDetails.amount.toLocaleString()} {orderDetails.currency}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Products</h3>
            {orderDetails.productOrders.map((productOrder: any) => (
              <div
                key={productOrder.id}
                className="flex justify-between border-b py-2 last:border-b-0"
              >
                <span>{productOrder.product.name}</span>
                <span>
                  {productOrder.quantity} x{" "}
                  {productOrder.price.toLocaleString()} {orderDetails.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span
            className={`
              px-2 py-1 rounded-full text-xs 
              ${
                order.status === "SUCCESS"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }
            `}
          >
            {order.status}
          </span>
        </div>
      </div>
      <div className="mt-2 flex-grow flex items-end">
        <p className="text-lg font-bold w-full">
          {order.amount.toLocaleString()} {order.currency}
        </p>
      </div>
    </div>
  );
};
const OrderTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userApiRequest.getOrders({
          limit: 12,
          offset: 0,
        });

        if (res.status === 200) {
          setOrders(res.payload);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div
        className={cn(
          "",
          orders && orders.length > 0 ? "grid grid-cols-4 gap-4" : ""
        )}
      >
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="cursor-pointer transition h-full"
            >
              <OrderCard order={order} />
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
      {selectedOrder && (
        <OrderDetailPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default OrderTab;
