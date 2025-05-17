import { Routes, Route, Navigate } from "react-router-dom";
import WebApp from "../WebApp";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

const AppRoutes = () => {
  let authUser = null;
  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <WebApp /> : <Navigate to={"/login"} />}
      />
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="signup"
        element={!authUser ? <Signup /> : <Navigate to={"/"} />}
      />
    </Routes>
  );
};

export default AppRoutes;
