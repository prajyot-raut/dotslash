import "./App.css";
import HomePage from "./pages/Home";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Menubar } from "primereact/menubar";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import AddService from "./pages/AddService";
import ShowServices from "./pages/showServices";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { useState, useEffect } from "react";
import axios from "axios";
import PlaceOrder from "./pages/placeOrder";
import ShowOrders from "./pages/ShowOrders";
import ShowReceivedOrders from "./pages/ShowReceivedOrders";

// Create an inner component that uses navigation
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout");
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavItems = () => {
    const baseItems = [
      {
        label: "Home",
        icon: "pi pi-home",
        template: (item, options) => (
          <Link to="/" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
      {
        label: "Market Place",
        icon: "pi pi-list",
        template: (item, options) => (
          <Link to="/services" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
    ];

    const authenticatedItems = [
      {
        label: "Sell things",
        icon: "pi pi-plus-circle",
        template: (item, options) => (
          <Link to="/add-service" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
      {
        label: "My Orders",
        icon: "pi pi-shopping-cart",
        template: (item, options) => (
          <Link to="/orders" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
      {
        label: "Received Orders",
        icon: "pi pi-inbox",
        template: (item, options) => (
          <Link to="/received-orders" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: handleLogout,
      },
    ];

    const unauthenticatedItems = [
      {
        label: "Login",
        icon: "pi pi-sign-in",
        template: (item, options) => (
          <Link to="/login" className={options.className}>
            <span className={options.iconClassName}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </Link>
        ),
      },
    ];

    return [
      ...baseItems,
      ...(isAuthenticated ? authenticatedItems : unauthenticatedItems),
    ];
  };

  return (
    <PrimeReactProvider>
      <Menubar model={getNavItems()} />
      <Routes>
        <Route
          path="/"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/add-service"
          element={
            <ProtectedRoute
              element={AddService}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute
              element={ShowServices}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Auth setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/place-order/:serviceId"
          element={
            <ProtectedRoute
              element={PlaceOrder}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              element={ShowOrders}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/received-orders"
          element={
            <ProtectedRoute
              element={ShowReceivedOrders}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </PrimeReactProvider>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
