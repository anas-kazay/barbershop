import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Navbar } from "../Navbar/Navbar";
import { BarberCard } from "./BarberCard";
import { AppointmentsList } from "./AppointmentList";
import { StatusChangeModal } from "./StatusChangeModal";

import { User } from "../../types/User";
import { Appointment } from "../../types/Appointment";
import { getUserData } from "../../services/users";
import {
  getAllBarberAppointments,
  updateAppointmentStatus,
} from "../../services/appointments";

const Barber: React.FC = () => {
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
      try {
        const user = JSON.parse(storedUserString);

        // Check if the user role is not 'customer'
        if (user.role !== "barber") {
          navigate("/");
          return;
        }
        const userDataResponse = await getUserData(navigate);
        if (userDataResponse.success) {
          setUserData(userDataResponse.user);

          const appointmentsResponse = await getAllBarberAppointments();
          setAppointments(appointmentsResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenStatusModal = (
    appointmentId: string,
    currentStatus: string
  ) => {
    setSelectedAppointment({ id: appointmentId, status: currentStatus });
  };

  const handleCloseStatusModal = () => {
    setSelectedAppointment({ id: null, status: null });
  };

  const handleConfirmStatusChange = async () => {
    const { id: appointmentId, status: currentStatus } = selectedAppointment;
    if (appointmentId && currentStatus !== "completed") {
      try {
        await updateAppointmentStatus(appointmentId, "completed");

        // Update local state to reflect the status change
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: "completed" }
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {userData && <BarberCard userData={userData} />}

        <Typography variant="h6" sx={{ mb: 2 }}>
          My Appointments
        </Typography>

        <AppointmentsList
          appointments={appointments}
          onMarkCompleted={handleOpenStatusModal}
        />

        <StatusChangeModal
          open={selectedAppointment.id !== null}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
        />
      </Container>
    </>
  );
};

export default Barber;
