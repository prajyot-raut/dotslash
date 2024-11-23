import "./App.css";
import HomePage from "./pages/Home";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Menubar } from "primereact/menubar";
import CreateOrderPage from "./pages/CreateOrder"; // Import the new page
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import Auth from "./pages/Auth"; // Import the Auth component
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function App() {
  const isAuthenticated = true; // Replace with actual authentication logic

  const items = [
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
      label: "Features",
      icon: "pi pi-star",
      template: (item, options) => (
        <Link to="/features" className={options.className}>
          <span className={options.iconClassName}></span>
          <span className={options.labelClassName}>{item.label}</span>
        </Link>
      ),
    },
    {
      label: "Create Order",
      icon: "pi pi-plus",
      template: (item, options) => (
        <Link to="/create-order" className={options.className}>
          <span className={options.iconClassName}></span>
          <span className={options.labelClassName}>{item.label}</span>
        </Link>
      ),
    },
    {
      label: "Login",
      icon: "pi pi-plus",
      template: (item, options) => (
        <Link to="/login" className={options.className}>
          <span className={options.iconClassName}></span>
          <span className={options.labelClassName}>{item.label}</span>
        </Link>
      ),
    },
  ];

  return (
    <BrowserRouter>
      <PrimeReactProvider>
        <Menubar model={items} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={HomePage}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/create-order"
            element={
              <ProtectedRoute
                element={CreateOrderPage}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </PrimeReactProvider>
    </BrowserRouter>
  );
}

export default App;
