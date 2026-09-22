import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "@fontsource-variable/inter";
import "./index.css";

import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Workers from "./pages/Workers.jsx";
import Foods from "./pages/Foods.jsx";
import Categories from "./pages/Categories.jsx";
import Wallet from "./pages/Wallet.jsx";
import Calendar from "./pages/Calendar.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "workers", element: <Workers /> },
      { path: "foods", element: <Foods /> },
      { path: "categories", element: <Categories /> },
      { path: "wallet", element: <Wallet /> },
      { path: "calendar", element: <Calendar /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={2500} />
  </StrictMode>
);
