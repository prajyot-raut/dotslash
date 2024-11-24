import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

const ShowReceivedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const toast = useRef(null);

  const fetchReceivedOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/orders/received",
        { withCredentials: true }
      );

      // Fetch all buyers' info in parallel
      const buyersInfo = await Promise.all(
        response.data.map((order) =>
          axios.get(`http://localhost:3000/users/${order.from}`, {
            withCredentials: true,
          })
        )
      );

      // Combine orders with buyer info
      const ordersWithBuyerInfo = response.data.map((order, index) => ({
        ...order,
        buyerInfo: buyersInfo[index].data,
      }));

      setOrders(ordersWithBuyerInfo);
    } catch (error) {
      console.error("Error fetching received orders:", error);
    }
  };

  useEffect(() => {
    fetchReceivedOrders();
  }, []);

  const handleStatusUpdate = async (orderId, updateType) => {
    try {
      await axios.put(
        `http://localhost:3000/orders/${orderId}`,
        { updateType },
        { withCredentials: true }
      );

      // Refresh orders
      fetchReceivedOrders();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Order status updated successfully",
      });
      setShowDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update order status",
      });
    }
  };

  const getOrderStatus = (status) => {
    return (
      <span className={`order-status status-${status?.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  const getActionButtons = (order) => {
    if (order.paymentStatus === "payment_done") {
      return (
        <div className="flex flex-column gap-2">
          <div className="text-sm">
            <p>
              <strong>Buyer marked payment as complete</strong>
            </p>
            <p>Please verify the payment details</p>
          </div>
          <Button
            label="Verify Payment"
            severity="success"
            onClick={() => handleStatusUpdate(order._id, "payment_verified")}
          />
        </div>
      );
    }

    if (order.paymentStatus === "initiated") {
      return (
        <div className="flex flex-column gap-2">
          <div className="text-sm">
            <p>
              <strong>Transaction ID:</strong>{" "}
              {order.paymentDetails?.transactionId}
            </p>
            <p>
              <strong>Amount:</strong> {order.paymentDetails?.amount}
            </p>
            <p>
              <strong>Method:</strong> {order.paymentDetails?.method}
            </p>
          </div>
          <Button
            label="Verify Payment"
            severity="success"
            onClick={() => handleStatusUpdate(order._id, "payment_completed")}
          />
        </div>
      );
    }

    switch (order.orderStatus) {
      case "pending":
        return (
          <Button
            label="Accept Order"
            severity="success"
            onClick={() => handleStatusUpdate(order._id, "order_accepted")}
          />
        );
      case "accepted":
        return (
          <Button
            label="Mark Out for Delivery"
            severity="info"
            onClick={() =>
              handleStatusUpdate(order._id, "order_out_for_delivery")
            }
          />
        );
      case "out_for_delivery":
        return (
          <Button
            label="Mark as Delivered"
            severity="success"
            onClick={() => handleStatusUpdate(order._id, "order_delivered")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container m-4">
      <Toast ref={toast} />
      <h2 className="text-4xl font-bold mb-4">Received Orders</h2>
      <div className="grid">
        {orders.map((order) => (
          <div key={order._id} className="col-12 md:col-6 lg:col-4 p-3">
            <Card>
              <div className="text-xl font-bold mb-3">{order.productName}</div>
              <div className="flex align-items-center gap-2 mb-3">
                <i className="pi pi-user" />
                <span className="font-semibold">Buyer Credit Score:</span>
                <span>{order.buyerInfo?.creditScore || "N/A"}</span>
              </div>
              <div className="text-base mb-2">
                <div className="flex justify-content-between mb-2">
                  <span className="font-semibold">Quantity:</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                  <span className="font-semibold">Price:</span>
                  <span>${order.quotedPrice}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                  <span className="font-semibold">Status:</span>
                  {getOrderStatus(order.orderStatus)}
                </div>
                <div className="flex justify-content-between mb-2">
                  <span className="font-semibold">Payment:</span>
                  {getOrderStatus(order.paymentStatus)}
                </div>
                <div className="flex justify-content-between">
                  <span className="font-semibold">Deadline:</span>
                  <span>{new Date(order.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-3">{getActionButtons(order)}</div>
            </Card>
          </div>
        ))}
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Confirm Status Update"
      >
        {/* Add dialog content if needed */}
      </Dialog>
    </div>
  );
};

export default ShowReceivedOrders;
