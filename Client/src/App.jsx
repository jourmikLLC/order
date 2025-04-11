import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/HomePage";
import OrderDetailsEntry from "./pages/OrderDetailsEntry";
import OrderDetails from "./pages/OrderDetails";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersScan from "./pages/OrderScan";
import PrivateRoute from "./Route/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Login page route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
      <Route
        path="/order-entry"
        element={<PrivateRoute element={<OrderDetailsEntry />} />}
      />
      <Route
        path="/order/:orderId"
        element={<PrivateRoute element={<OrderDetailPage />} />}
      />
      <Route
        path="/orders-details"
        element={<PrivateRoute element={<OrderDetails />} />}
      />
      <Route
        path="/orders-scan"
        element={<PrivateRoute element={<OrdersScan />} />}
      />
    </Routes>
  );
}

export default App;
