import React, { useState, useEffect, useRef } from "react";
import { DataView } from "primereact/dataview";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShowServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/services", {
          withCredentials: true,
        });
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error fetching services",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/place-order/${serviceId}`);
  };

  const itemTemplate = (service) => {
    return (
      <div className="col-12 sm:col-6 lg:col-4 p-2">
        <Card
          className="h-full cursor-pointer"
          onClick={() => handleServiceClick(service._id)}
        >
          <div className="flex flex-column gap-3">
            <div className="text-2xl font-bold text-900">{service.name}</div>
            <div className="text-700">{service.description}</div>
            <div className="flex align-items-center gap-2">
              <Rating
                value={getAverageRating(service.ratings)}
                readOnly
                stars={5}
                cancel={false}
              />
              <span className="text-sm text-500">
                ({service.ratings?.length || 0} ratings)
              </span>
            </div>
            <div className="text-xl font-semibold text-primary">
              ${service.price}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {loading ? (
        <div className="flex justify-content-center align-items-center min-h-screen">
          <ProgressSpinner />
        </div>
      ) : (
        <DataView
          value={services}
          itemTemplate={itemTemplate}
          paginator
          rows={6}
          layout="grid"
          header={
            <h1 className="text-3xl font-bold m-0">Available Services</h1>
          }
          emptyMessage="No services available"
        />
      )}
    </div>
  );
};

export default ShowServices;
