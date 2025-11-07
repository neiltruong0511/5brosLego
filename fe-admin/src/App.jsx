import React, { Fragment, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DefaultLayout from "./layout/DefaultLayout.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login/Login";
import AOS from "aos";
import "aos/dist/aos.css";
import { privateRoutes } from "./routes/index.jsx";

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const noLayoutPaths = ["/login"];

  useEffect(() => {
    AOS.init();
  }, []);

  // Kiểm tra nếu đường dẫn hiện tại nằm trong danh sách noLayoutPaths
  const shouldShowLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <>
      {shouldShowLayout && <Navbar />}

      <Routes>
        {/* Public route - Login */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected routes */}
        {privateRoutes.map((route, index) => {
          const Page = route.element;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Page />
                  </Layout>
                </ProtectedRoute>
              }
            />
          );
        })}

        {/* Redirect unknown routes to dashboard if authenticated, otherwise to login */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {shouldShowLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;