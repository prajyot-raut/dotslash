import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";

const ShowReceivedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchReceivedOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/orders/received",
          { withCredentials: true } // Add this configuration
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching received orders:", error);
      }
    };

    fetchReceivedOrders();
  }, []);

  const getOrderStatus = (status) => {
    return (
      <span className={`order-status status-${status?.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container m-4">
      <h2 className="text-4xl font-bold mb-4">Received Orders</h2>
      <div className="grid">
        {orders.map((order) => (
          <div key={order._id} className="col-12 md:col-6 lg:col-4 p-3">
            <Card>
              <div className="text-xl font-bold mb-3">{order.productName}</div>
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
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowReceivedOrders;
