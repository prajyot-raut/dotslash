import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./../css/createOrder.css";

const CreateOrderPage = () => {
  const [transaction, setTransaction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [quotedPrice, setQuotedPrice] = useState(null);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const [extraInfo, setExtraInfo] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [productionStatus, setProductionStatus] = useState("Not Started");
  const [delivered, setDelivered] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const productionStatusOptions = ["Not Started", "In Progress", "Completed"];
  const paymentStatusOptions = ["Pending", "Completed", "Failed"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/orders", {
        transaction,
        from,
        to,
        productName,
        quantity,
        quotedPrice,
        estimatedDeliveryDate,
        extraInfo,
        deadline,
        inProgress,
        productionStatus,
        delivered,
        paymentStatus,
      });
      setMessage("Order created successfully");
    } catch (error) {
      setMessage("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-container">
      <Card title="Create Order" className="create-order-card">
        <form onSubmit={handleSubmit}>
          <div className="p-field">
            <label htmlFor="to">To User ID</label>
            <InputText
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="productName">Product Name</label>
            <InputText
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber
              id="quantity"
              value={quantity}
              onValueChange={(e) => setQuantity(e.value)}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="quotedPrice">Quoted Price</label>
            <InputNumber
              id="quotedPrice"
              value={quotedPrice}
              onValueChange={(e) => setQuotedPrice(e.value)}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="estimatedDeliveryDate">
              Estimated Delivery Date
            </label>
            <Calendar
              id="estimatedDeliveryDate"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.value)}
              showIcon
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="extraInfo">Extra Info</label>
            <InputTextarea
              id="extraInfo"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              required
              rows={3}
              cols={30}
            />
          </div>
          <div className="p-field">
            <label htmlFor="deadline">Deadline</label>
            <Calendar
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.value)}
              showIcon
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="inProgress">In Progress</label>
            <InputText
              id="inProgress"
              value={inProgress}
              onChange={(e) => setInProgress(e.target.value === "true")}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="productionStatus">Production Status</label>
            <Dropdown
              id="productionStatus"
              value={productionStatus}
              options={productionStatusOptions}
              onChange={(e) => setProductionStatus(e.value)}
              placeholder="Select a Status"
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="delivered">Delivered</label>
            <InputText
              id="delivered"
              value={delivered}
              onChange={(e) => setDelivered(e.target.value === "true")}
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="paymentStatus">Payment Status</label>
            <Dropdown
              id="paymentStatus"
              value={paymentStatus}
              options={paymentStatusOptions}
              onChange={(e) => setPaymentStatus(e.value)}
              placeholder="Select a Status"
              required
            />
          </div>
          <Button
            type="submit"
            label="Create Order"
            icon="pi pi-check"
            loading={loading}
            className="p-mt-2"
          />
        </form>
        {message && <p className="p-mt-2">{message}</p>}
      </Card>
    </div>
  );
};

export default CreateOrderPage;
