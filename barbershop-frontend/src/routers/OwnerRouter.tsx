import React from "react";
import { Route, Routes } from "react-router-dom";
import Owner from "../components/Owner/Owner";
import { Navbar } from "../components/Navbar/Navbar";

const OwnerRouter = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Owner />}></Route>
      </Routes>
    </div>
  );
};

export default OwnerRouter;
