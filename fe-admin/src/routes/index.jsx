import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Reviews from "../pages/Orders";
import Settings from "../pages/Settings";
import Login from "../pages/Auth/Login/Login";
const privateRoutes = [
  { path: "/dashboard", element: Dashboard },
  { path: "/customers", element: Customers },
  { path: "/products", element: Products },
  { path: "/orders", element: Reviews },
  { path: "/settings", element: Settings },
  {path: "/login", element: Login},
  
];

export { privateRoutes };