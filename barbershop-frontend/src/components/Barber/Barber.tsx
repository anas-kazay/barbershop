import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Box,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { User } from "../../types/User";
import { Appointment } from "../../types/Appointment";
import { getUserData } from "../../services/users";
import {
  getAllBarberAppointments,
  updateAppointmentStatus,
} from "../../services/appointments";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Navbar } from "../Navbar/Navbar";

const Barber = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string | null;
    status: string | null;
  }>({ id: null, status: null });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await getUserData();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatAppointmentTime = (isoTime: string) => {
    try {
      const parsedDate = parseISO(isoTime);
      return format(parsedDate, "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return isoTime;
    }
  };

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

  const getStatusChipProps = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "warning", label: "Pending" };
      case "confirmed":
        return { color: "info", label: "Confirmed" };
      case "completed":
        return { color: "success", label: "Completed" };
      case "cancelled":
        return { color: "error", label: "Cancelled" };
      default:
        return { color: "default", label: status };
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {userData && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" gutterBottom>
                    {userData.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userData.email}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Typography variant="h6" sx={{ mb: 2 }}>
          My Appointments
        </Typography>

        {appointments.length > 0 ? (
          <Grid container spacing={2}>
            {appointments.map((appointment) => {
              const statusChipProps = getStatusChipProps(appointment.status);

              return (
                <Grid item xs={12} sm={6} md={4} key={appointment._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor:
                        appointment.status === "completed"
                          ? "success.light"
                          : appointment.status === "cancelled"
                          ? "error.light"
                          : "background.paper",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography sx={{ flexGrow: 1 }}>
                          {appointment.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {formatAppointmentTime(appointment.time)}
                        </Typography>
                        <Chip
                          label={statusChipProps.label}
                          color={statusChipProps.color as any}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>

                      <Box sx={{ display: "grid", gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Services:
                        </Typography>
                        <Typography variant="body2">
                          {appointment.serviceNames.join(", ")}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">
                          Total Price:
                        </Typography>
                        <Typography variant="body2">
                          ${appointment.totalPrice.toFixed(2)}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold">
                          Duration:
                        </Typography>
                        <Typography variant="body2">
                          {appointment.totalDuration} minutes
                        </Typography>

                        {appointment.comment && (
                          <>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Comment:
                            </Typography>
                            <Typography variant="body2">
                              {appointment.comment}
                            </Typography>
                          </>
                        )}
                      </Box>

                      {appointment.status !== "completed" && (
                        <Box sx={{ mt: 2, textAlign: "right" }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                              handleOpenStatusModal(
                                appointment._id,
                                appointment.status
                              )
                            }
                          >
                            Mark Completed
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No appointments found.
          </Typography>
        )}

        {/* Status Change Confirmation Modal */}
        <Dialog
          open={selectedAppointment.id !== null}
          onClose={handleCloseStatusModal}
          aria-labelledby="status-change-dialog-title"
          aria-describedby="status-change-dialog-description"
        >
          <DialogTitle id="status-change-dialog-title">
            Confirm Appointment Completion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="status-change-dialog-description">
              Are you sure you want to mark this appointment as completed? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusModal} color="primary">
              No, Keep Current Status
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              color="success"
              autoFocus
            >
              Yes, Mark Completed
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Barber;
