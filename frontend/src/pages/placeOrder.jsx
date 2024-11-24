import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

const PlaceOrder = () => {
  const { serviceId } = useParams();
  const toast = useRef(null);
  const [service, setService] = useState(null);
  const [order, setOrder] = useState({
    productName: "",
    quantity: 1,
    quotedPrice: "",
    estimatedDeliveryDate: null,
    deadline: null,
    extraInfo: "",
  });
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/services/${serviceId}`,
          {
            withCredentials: true,
          }
        );
        setService(response.data);

        // Fetch seller info including credit score
        const sellerResponse = await axios.get(
          `http://localhost:3000/users/${response.data.createdBy}`,
          { withCredentials: true }
        );
        setSellerInfo(sellerResponse.data);

        setOrder((prev) => ({
          ...prev,
          productName: response.data.name,
          quotedPrice: response.data.price,
        }));
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching service details",
        });
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:3000/orders/${serviceId}`, order, {
        withCredentials: true,
      });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Order placed successfully",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Error placing order",
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-blue-50">
      <Toast ref={toast} />
      <Card title="Place Order" className="w-30rem shadow-5">
        {sellerInfo && (
          <div className="mb-4 p-3 surface-100 border-round">
            <h3 className="text-xl mb-2">Seller Information</h3>
            <div className="flex align-items-center gap-2">
              <i className="pi pi-star text-yellow-500" />
              <span className="font-bold">Credit Score:</span>
              <span>{sellerInfo.creditScore || "N/A"}</span>
            </div>
          </div>
        )}
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="productName">Product Name</label>
            <InputText
              id="productName"
              value={order.productName}
              onChange={(e) =>
                setOrder({ ...order, productName: e.target.value })
              }
              disabled
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber
              id="quantity"
              value={order.quantity}
              onValueChange={(e) => setOrder({ ...order, quantity: e.value })}
              min={1}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="deadline">Deadline</label>
            <Calendar
              id="deadline"
              value={order.deadline}
              onChange={(e) => setOrder({ ...order, deadline: e.value })}
              showTime
              minDate={new Date()}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="estimatedDeliveryDate">estimatedDeliveryDate</label>
            <Calendar
              id="estimatedDeliveryDate"
              value={order.estimatedDeliveryDate}
              onChange={(e) =>
                setOrder({ ...order, estimatedDeliveryDate: e.value })
              }
              showTime
              minDate={new Date()}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="extraInfo">Additional Information</label>
            <InputTextarea
              id="extraInfo"
              value={order.extraInfo}
              onChange={(e) =>
                setOrder({ ...order, extraInfo: e.target.value })
              }
              rows={3}
            />
          </div>

          <Button label="Place Order" onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default PlaceOrder;
