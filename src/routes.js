/** @format */

import { Navigate, useRoutes, Outlet } from "react-router-dom";

// layouts
import DashboardLayout from "./layouts/dashboard";
//
import Login from "./pages/login/Login";
import ForgetPassword from "./pages/login/forgotPassword";
import ResetPassword from "./pages/login/resetPassword";
import Dashboard from "./pages/dashboard/Dashboard";

// Families

import Families from "./pages/family/Families";
import FamilyCreate from "./pages/family/create";
import FamilyUpdate from "./pages/family/Update";

// User
import User from "./pages/User/User";
import UserCreate from "./pages/User/Create";
import UserUpdate from "./pages/User/Update";

// Urbanization

import Urbanization from "./pages/urbanization/Urbanization";
import UrbanizationCreate from "./pages/urbanization/Create";
import UrbanizationUpdate from "./pages/urbanization/Update";

// Profile

import Profile from "./pages/profile/profile";

// Payment

import Payments from "./pages/carreras/payments";

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "home", element: <Dashboard /> },
        {
          path: "users",
          element: <Outlet />,
          children: [
            { path: "", element: <User /> },
            { path: "create", element: <UserCreate /> },
            { path: "update/:id", element: <UserUpdate /> },
          ],
        },
        {
          path: "families",
          element: <Outlet />,
          children: [
            { path: "", element: <Families /> },
            { path: "create", element: <FamilyCreate /> },
            { path: "update/:id", element: <FamilyUpdate /> },
          ],
        },
        {
          path: "urbanizations",
          element: <Outlet />,
          children: [
            { path: "", element: <Urbanization /> }, // Urbanization
            { path: "create", element: <UrbanizationCreate /> },
            { path: "update/:id", element: <UrbanizationUpdate /> },
          ],
        },
        { path: "profile", element: <Profile /> },
        { path: "payments", element: <Payments /> },
      ],
    },

    { path: "login", element: <Login /> },
    { path: "forget-password", element: <ForgetPassword /> },
    { path: "reset-password", element: <ResetPassword /> },
    { path: "/", element: <Navigate to="/dashboard/home" /> },
    { path: "*", element: <Navigate to="/dashboard/home" replace /> },
  ]);
}
