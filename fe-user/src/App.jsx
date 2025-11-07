import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { privateRoute } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Chatbox from "./components/chatbox";

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 0,
      duration: 300,
      easing: "ease-in-sine",
      delay: 50,
    });
    AOS.refresh();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {privateRoute.map((route, index) => {
            let Layout = DefaultLayout;

            if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    {route.element}
                  </Layout>
                }
              />
            );
          })}
        </Routes>

        {/* ✅ Chatbox luôn hiển thị trên mọi trang */}
        <Chatbox />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

