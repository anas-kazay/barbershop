import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Navbar } from "../Navbar/Navbar";
import { User } from "../../types/User";
import { Appointment } from "../../types/Appointment";
import { getUserData } from "../../services/users";
import {
  getAllUserAppointments,
  updateAppointmentStatus,
} from "../../services/appointments";
import { AppointmentList } from "./AppointmentList";
import { AppointmentStatusModal } from "./AppointmentModalStatus";
import { UserCard } from "./UserCard";

const Customer: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string | null;
    status: string | null;
  }>({ id: null, status: null });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserString = localStorage.getItem("user") || "{}";
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      const user = JSON.parse(storedUserString);

      // Check if the user role is not 'customer'
      if (user.role !== "customer") {
        navigate("/");
        return;
      }
      try {
        const userDataResponse = await getUserData(navigate);
        if (userDataResponse.success) {
          setUserData(userDataResponse.user);

          const appointmentsResponse = await getAllUserAppointments();
          setAppointments(appointmentsResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleOpenStatusModal = (
    appointmentId: string,
    currentStatus: string
  ) => {
    // Only allow opening the modal if the status is "pending"
    if (currentStatus === "pending") {
      setSelectedAppointment({ id: appointmentId, status: currentStatus });
    }
  };

  const handleCloseStatusModal = () => {
    setSelectedAppointment({ id: null, status: null });
  };

  const handleConfirmStatusChange = async () => {
    const { id: appointmentId, status: currentStatus } = selectedAppointment;
    if (appointmentId && currentStatus === "pending") {
      try {
        // Only allow changing from "pending" to "cancelled"
        await updateAppointmentStatus(appointmentId, "cancelled");

        // Update local state to reflect the status change
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: "cancelled" }
              : appointment
          )
        );

        handleCloseStatusModal();
      } catch (error) {
        console.error("Error updating appointment status:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {userData && <UserCard user={userData} onLogout={handleLogout} />}

        <Typography variant="h6" sx={{ mb: 2 }}>
          My Appointments
        </Typography>

        <AppointmentList
          appointments={appointments}
          onOpenStatusModal={handleOpenStatusModal}
        />

        <AppointmentStatusModal
          open={selectedAppointment.id !== null}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
        />
      </Container>
    </>
  );
};

export default Customer;
