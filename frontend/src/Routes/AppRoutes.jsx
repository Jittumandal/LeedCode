import { Routes, Route, Navigate } from "react-router-dom";
import WebApp from "../WebApp";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AddProblem from "../pages/AddProblem";

import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "@mantine/core";
import Layout from "../Layout/Layout";
import AdminRoute from "../components/AdminRoute";

const AppRoutes = () => {
  // Get authentication state and actions from the store
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <Loader color="blue" />;
  }

  // If the user is authenticated, show the WebApp
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <WebApp /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="signup"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/addproblem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
