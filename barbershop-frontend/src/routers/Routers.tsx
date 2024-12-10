import { Route, Routes } from "react-router-dom";
import OwnerRouter from "./OwnerRouter";
import UserRouter from "./UserRouter";

const Routers = () => {
  return (
    <Routes>
      {/* <Route path="/owner/*" element={<AdminRoute />} /> */}
      <Route path="/owner/*" element={<OwnerRouter />} />
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
};

export default Routers;
