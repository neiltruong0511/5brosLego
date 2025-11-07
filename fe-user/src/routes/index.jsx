import Home from "../pages/Home";
import About from "../pages/About";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import Product from "../pages/Product";
import DetailProduct from "../pages/DetailProduct";
import Login from "../pages/Auth/Login/Login";
import Signin from "../pages/Auth/Signin/Signin";
import Evaluate from "../pages/Evaluate";
import ThankYou from "../pages/Thankyou";
import HistoryOrder from "../pages/HistoryOrder";
import ProtectedRoute from "../components/ProtectedRoute";
import Error404 from "../pages/Error404";

const privateRoute = [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
    { path: "/payment", element: <ProtectedRoute><Payment /></ProtectedRoute> },
    { path: "/product", element: <Product /> },
    { path: "/product/:id", element: <DetailProduct /> },
    { path: "/login", element: <Login />, layout: null },
    { path: "/signin", element: <Signin />, layout: null },
    { path: "/evaluate", element: <ProtectedRoute><Evaluate /></ProtectedRoute>, layout: null },
    { path: "/thankyou", element: <ProtectedRoute><ThankYou /></ProtectedRoute>, layout: null },
    { path: "/history-order", element: <ProtectedRoute><HistoryOrder /></ProtectedRoute> },
    { path: "*", element: <Error404 /> },
];

export { privateRoute };