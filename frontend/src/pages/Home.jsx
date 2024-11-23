//import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const HomePage = () => {
  return (
    <div>
      <h1>Products</h1>
      <Link to="/create-order">
        <Button
          label="Create Order"
          icon="pi pi-plus"
          className="p-button-raised p-button-rounded"
        />
      </Link>
    </div>
  );
};
export default HomePage;
