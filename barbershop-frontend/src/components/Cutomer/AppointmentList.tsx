import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { Appointment } from "../../types/Appointment";
import {
  formatAppointmentTime,
  getStatusChipProps,
  getStatusButtonProps,
} from "./utils";

interface AppointmentListProps {
  appointments: Appointment[];
  onOpenStatusModal: (appointmentId: string, currentStatus: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onOpenStatusModal,
}) => {
  if (appointments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        No appointments found.
      </Typography>
    );
  }

  return (
    <>
      {appointments.map((appointment) => {
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
                      onOpenStatusModal(appointment._id, appointment.status)
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
      })}
    </>
  );
};
