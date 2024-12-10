import { Avatar, IconButton } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { User } from "../../types/User";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); // State to store role

  useEffect(() => {
    const user = localStorage.getItem("user"); // Retrieve user info from localStorage
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser); // Assuming the user object has a `role` property
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleAvatarClick = () => {
    if (user?.role === "customer") {
      navigate("/my-profile");
    } else if (user?.role === "owner") {
      navigate("/owner");
    } else if (user?.role === "barber") {
      navigate("/barber-profile");
    } else {
      navigate("/login"); // Default fallback if role is undefined
    }
  };

  return (
    <div className="px-5 sticky top-0 z-[100] py-[.8rem] bg-[#2b98d3] lg:px-20 flex justify-between">
      <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
        <li
          className="logo font-semibold text-white text-2xl"
          onClick={() => navigate("/")}
        >
          KAZAY BarberShop
        </li>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-10">
        {/* Avatar with Badge */}
        <div className="relative">
          {user ? (
            <Avatar
              onClick={handleAvatarClick}
              sx={{ bgcolor: "white", color: "#2b98d3" }}
            >
              {user.name[0].toUpperCase()}
            </Avatar>
          ) : (
            <IconButton onClick={() => navigate("/login")}>
              <Person />
            </IconButton>
          )}
        </div>
        {/* Shopping cart icon */}
      </div>
    </div>
  );
};
