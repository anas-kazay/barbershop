import { Route, Routes, Navigate } from "react-router-dom";
import OwnerRouter from "./OwnerRouter";
import UserRouter from "./UserRouter";

// Helper function to check authentication and role
const isAuthenticatedOwner = (): boolean => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) return false;

  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === "owner"; // Ensure user role is "owner"
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return false;
  }
};

// Protected route for owner
const ProtectedOwnerRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticatedOwner() ? children : <Navigate to="/" />;
};

const Routers = () => {
  return (
    <Routes>
      <Route
        path="/owner/*"
        element={
          <ProtectedOwnerRoute>
            <OwnerRouter />
          </ProtectedOwnerRoute>
        }
      />
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
};

export default Routers;
