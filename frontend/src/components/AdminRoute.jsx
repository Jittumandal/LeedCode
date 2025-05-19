import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "@mantine/core";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  // Show a loader while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader color="blue" />
      </div>
    );
  }

  // Check if the user is authenticated and has the role of "ADMIN"

  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
