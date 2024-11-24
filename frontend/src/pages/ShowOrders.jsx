import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import axios from "axios";

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch orders",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getSeverity = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "info";
      case "out_for_delivery":
        return "primary";
      case "delivered":
        return "success";
      default:
        return "warning";
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.orderStatus}
        severity={getSeverity(rowData.orderStatus)}
      />
    );
  };

  const paymentStatusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.paymentStatus}
        severity={rowData.paymentStatus === "completed" ? "success" : "warning"}
      />
    );
  };

  const dateBodyTemplate = (rowData, field) => {
    return new Date(rowData[field]).toLocaleDateString();
  };

  const calculateTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const remaining = end - now;
    return remaining > 0 ? remaining : 0;
  };

  const timerBodyTemplate = (rowData) => {
    if (rowData.orderStatus === "delivered" && rowData.disputeDeadline) {
      const remaining = calculateTimeRemaining(rowData.disputeDeadline);
      const totalTime = rowData.timers.deliveryTimer * 24 * 60 * 60 * 1000;
      const progress = ((totalTime - remaining) / totalTime) * 100;

      return (
        <div className="w-full">
          <ProgressBar value={progress} />
          <small className="block mt-1">
            {Math.ceil(remaining / (1000 * 60 * 60 * 24))} days remaining for
            dispute
          </small>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card m-4">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {loading ? (
        <div className="flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={orders}
          paginator
          rows={10}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="productName" header="Product" sortable />
          <Column field="quantity" header="Quantity" sortable />
          <Column field="quotedPrice" header="Price" sortable />
          <Column
            field="deadline"
            header="Deadline"
            body={(rowData) => dateBodyTemplate(rowData, "deadline")}
            sortable
          />
          <Column
            field="estimatedDeliveryDate"
            header="Delivery Date"
            body={(rowData) =>
              dateBodyTemplate(rowData, "estimatedDeliveryDate")
            }
            sortable
          />
          <Column
            field="orderStatus"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
          <Column
            field="paymentStatus"
            header="Payment"
            body={paymentStatusBodyTemplate}
            sortable
          />
          <Column
            field="timer"
            header="Dispute Timer"
            body={timerBodyTemplate}
          />
        </DataTable>
      )}
    </div>
  );
};

export default ShowOrders;
