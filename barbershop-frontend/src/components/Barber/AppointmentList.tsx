import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { Appointment } from "../../types/Appointment";
import { formatAppointmentTime, getStatusChipProps } from "./barberUtils";

interface AppointmentsListProps {
  appointments: Appointment[];
  onMarkCompleted: (appointmentId: string, currentStatus: string) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  onMarkCompleted,
}) => {
  if (appointments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        No appointments found.
      </Typography>
    );
  }

  return (
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
                        onMarkCompleted(appointment._id, appointment.status)
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
  );
};
