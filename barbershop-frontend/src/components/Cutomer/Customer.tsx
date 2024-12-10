import { useState, useEffect } from "react";
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
  getAllUserAppointments,
  updateAppointmentStatus,
} from "../../services/appointments";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Navbar } from "../Navbar/Navbar";

const Customer = () => {
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

  const getStatusButtonProps = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "warning", label: "Cancel" };
      case "confirmed":
      case "completed":
      case "cancelled":
        return null; // No button for these statuses
      default:
        return { color: "default", label: status };
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
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
          appointments.map((appointment) => {
            const statusChipProps = getStatusChipProps(appointment.status);
            const statusButtonProps = getStatusButtonProps(appointment.status);

            return (
              <Card
                key={appointment._id}
                sx={{
                  mb: 2,
                  backgroundColor:
                    appointment.status === "completed"
                      ? "success.light"
                      : appointment.status === "cancelled"
                      ? "error.light"
                      : "background.paper",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ flexGrow: 1 }}>
                      {appointment.barberName}
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
                    {statusButtonProps && (
                      <Button
                        variant="contained"
                        color={statusButtonProps.color as any}
                        size="small"
                        onClick={() =>
                          handleOpenStatusModal(
                            appointment._id,
                            appointment.status
                          )
                        }
                      >
                        {statusButtonProps.label}
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
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
                </CardContent>
              </Card>
            );
          })
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
            Confirm Appointment Status Change
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="status-change-dialog-description">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusModal} color="primary">
              No, Keep Current Status
            </Button>
            <Button onClick={handleConfirmStatusChange} color="error" autoFocus>
              Yes, Change Status
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Customer;
