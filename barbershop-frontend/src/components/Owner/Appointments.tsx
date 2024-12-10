import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import { Appointment } from "./../../types/Appointment";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "./../../services/appointments";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusOptions: Appointment["status"][] = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const fetchedAppointments = await getAllAppointments();
        setAppointments(fetchedAppointments);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      // Call the update status function
      await updateAppointmentStatus(appointmentId, newStatus);

      // Optimistically update the local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      // Handle error (you might want to show an error message)
      console.error("Failed to update appointment status", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" className="text-center mt-10">
        Error: {error}
      </Typography>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <Typography variant="h4" className="pb-6 font-bold text-gray-800">
        Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography variant="body1" className="text-center text-gray-500">
          No appointments found.
        </Typography>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <Card
              key={appointment._id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader
                title={`${appointment.barberName} for ${appointment.customerName}`}
                subheader={new Date(appointment.time).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                className="border-b"
              />
              <CardContent>
                <div className="space-y-3">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            appointment._id,
                            e.target.value as Appointment["status"]
                          )
                        }
                        color={getStatusColor(appointment.status)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: (() => {
                              switch (appointment.status) {
                                case "pending":
                                  return "orange";
                                case "confirmed":
                                  return "blue";
                                case "completed":
                                  return "green";
                                case "cancelled":
                                  return "red";
                              }
                            })(),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: (() => {
                              switch (appointment.status) {
                                case "pending":
                                  return "orange";
                                case "confirmed":
                                  return "blue";
                                case "completed":
                                  return "green";
                                case "cancelled":
                                  return "red";
                              }
                            })(),
                          },
                          "& .MuiSelect-icon": {
                            color: (() => {
                              switch (appointment.status) {
                                case "pending":
                                  return "orange";
                                case "confirmed":
                                  return "blue";
                                case "completed":
                                  return "green";
                                case "cancelled":
                                  return "red";
                              }
                            })(),
                          },
                        }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography variant="body2" className="flex justify-between">
                    <span className="font-semibold">Total Price:</span>
                    <span>${appointment.totalPrice.toFixed(2)}</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{appointment.totalDuration} mins</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between">
                    <span className="font-semibold">Services:</span>
                    <span>
                      {appointment.serviceNames.map((name, index) => (
                        <span key={index}>{name}</span>
                      ))}
                    </span>
                  </Typography>
                  {appointment.comment && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="italic"
                    >
                      "{appointment.comment}"
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
