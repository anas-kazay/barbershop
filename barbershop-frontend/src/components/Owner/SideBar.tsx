import React, { useState } from "react";
import {
  CalendarMonth,
  Dashboard,
  Logout,
  Menu as MenuIcon,
  People,
  ChevronLeft,
} from "@mui/icons-material";
import { Divider, Drawer, IconButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const menu = [
  { title: "Services", icon: <Dashboard />, path: "/services" },
  { title: "Appointments", icon: <CalendarMonth />, path: "/appointments" },
  { title: "Barbers", icon: <People />, path: "/barbers" },
  { title: "Logout", icon: <Logout />, path: "/logout" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (path === "/logout") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } else {
      navigate("/owner" + path);
    }

    // Close drawer on mobile after navigation
    if (isSmallScreen) {
      setIsOpen(false);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button - positioned outside the drawer */}
      {isSmallScreen && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            left: isOpen ? "auto" : 0,
            right: isOpen ? 0 : "auto",
            top: "65px",
            zIndex: 1200,
            margin: "0 10px",
          }}
        >
          {isOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      )}

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        sx={{
          zIndex: 10,
          "& .MuiDrawer-paper": {
            marginTop: "65px", // Adjust based on your navbar height
            height: "calc(100% - 64px)",
            width: isSmallScreen ? "70vw" : "20vw",
          },
        }}
        anchor="left"
        open={isSmallScreen ? isOpen : true}
        onClose={() => setIsOpen(false)}
      >
        <div className="w-full h-screen flex flex-col justify-start text-xl space-y-[1.65rem] mt-4">
          {menu.map((item, index) => (
            <React.Fragment key={index}>
              <div
                onClick={() => handleNavigate(item.path)}
                className="flex items-center px-5 gap-5 cursor-pointer"
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
              {index !== menu.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default SideBar;
