import React from "react";
import { Route, Routes } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

import Services from "./Services";
import SideBar from "./SideBar";
import Barbers from "./Barbers";
import Appointments from "./Appointments";
import Users from "./Users";

const Owner = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <div className="flex">
      <div className={`${isSmallScreen ? "w-[10%]" : "w-[20%]"}`}>
        <SideBar />
      </div>
      <div className={`${isSmallScreen ? "w-[100%]" : "w-[80%]"}`}>
        <Routes>
          <Route path="/" element={<Appointments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/users" element={<Users />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/barbers" element={<Barbers />} />
        </Routes>
      </div>
    </div>
  );
};

export default Owner;
