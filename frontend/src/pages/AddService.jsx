import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddService = () => {
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!service.name || !service.description || !service.price) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all required fields",
        life: 3000,
      });
      return;
    }

    try {
      console.log("Sending service data:", service);
      const response = await axios.post(
        "http://localhost:3000/services",
        service,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Service added successfully",
        life: 3000,
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Error details:", error.response?.data);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to add service",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-blue-50">
      <Toast ref={toast} />
      <Card title="Add New Service" className="w-30rem shadow-5">
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="name" className="font-bold">
              Service Name *
            </label>
            <InputText
              id="name"
              name="name"
              value={service.name}
              onChange={handleInputChange}
              className="p-inputtext-lg"
              placeholder="Enter service name"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="description" className="font-bold">
              Description *
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={service.description}
              onChange={handleInputChange}
              rows={5}
              className="p-inputtextarea-lg"
              placeholder="Describe your service"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="price" className="font-bold">
              Price *
            </label>
            <InputText
              id="price"
              name="price"
              value={service.price}
              onChange={handleInputChange}
              className="p-inputtext-lg"
              placeholder="Enter service price"
            />
          </div>

          <Button
            label="Add Service"
            icon="pi pi-plus"
            className="p-button-lg"
            onClick={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default AddService;
