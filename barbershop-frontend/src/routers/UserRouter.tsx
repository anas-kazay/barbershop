import { Route, Routes } from "react-router-dom";
import Home from "../components/Home/Home";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import AppointmentForm from "../components/Appointment/Appointment";
import Customer from "../components/Cutomer/Customer";
import Barber from "../components/Barber/Barber";

const UserRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/my-profile" element={<Customer />} />
        <Route path="/barber-profile" element={<Barber />} />
      </Routes>
    </div>
  );
};

export default UserRouter;
