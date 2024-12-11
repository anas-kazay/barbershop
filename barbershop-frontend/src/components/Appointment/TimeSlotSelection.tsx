import React, { useState, useMemo, useEffect } from "react";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import { format, parseISO } from "date-fns";
import { User } from "../../types/User";
import { Service } from "../../types/Service";
import { Appointment } from "../../types/Appointment";
import { getAppointmentsByBarberAndDay } from "../../services/appointments";

interface TimeSlotSelectionProps {
  barbers: User[];
  services: Service[];
  selectedBarberId: string;
  selectedDate: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  barbers,
  services,
  selectedBarberId,
  selectedDate,
  onTimeSelect,
}) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>(
    []
  );

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        if (selectedBarberId && selectedDate) {
          const formattedDay = format(parseISO(selectedDate), "yyyy-MM-dd");
          const appointments = await getAppointmentsByBarberAndDay(
            selectedBarberId,
            formattedDay
          );
          setBookedAppointments(appointments);
        }
      } catch (error) {
        console.error("Error fetching booked appointments:", error);
      }
    };

    fetchBookedAppointments();
  }, [selectedBarberId, selectedDate]);

  const availableTimeSlots = useMemo(() => {
    const barber = barbers.find((b) => b.id === selectedBarberId);
    const selectedFullDate = parseISO(selectedDate);
    const daySchedule =
      barber?.workingSchedule?.find(
        (schedule) => schedule.dayOfWeek === selectedFullDate.getDay()
      ) ?? null;

    if (!daySchedule) {
      console.error("No schedule found for the selected day");
      return [];
    }

    const generatedSlots: string[] = [];
    const [startHour, startMinute] = daySchedule.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = daySchedule.endTime.split(":").map(Number);

    let currentTime = new Date(selectedFullDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(selectedFullDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      generatedSlots.push(format(currentTime, "HH:mm"));
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    const blockedSlots = new Set<string>();

    bookedAppointments.forEach((appointment) => {
      const appointmentTime = parseISO(appointment.time);
      const appointmentTimeString = format(appointmentTime, "HH:mm");

      const serviceIds = appointment.serviceIds;
      const totalDuration = services
        .filter((service) => serviceIds.includes(service._id))
        .reduce((sum, service) => sum + service.duration, 0);

      const slotsNeeded = Math.ceil(totalDuration / 30);
      const startIndex = generatedSlots.indexOf(appointmentTimeString);

      for (let i = 0; i < slotsNeeded; i++) {
        const slotToBlock = generatedSlots[startIndex + i];
        if (slotToBlock) {
          blockedSlots.add(slotToBlock);
        }
      }
    });

    return generatedSlots.filter((timeSlot) => !blockedSlots.has(timeSlot));
  }, [selectedBarberId, selectedDate, bookedAppointments, services]);

  const handleTimeSelect = () => {
    if (selectedTime) {
      onTimeSelect(selectedTime);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Time Slot
      </Typography>
      <Grid container spacing={2}>
        {availableTimeSlots.map((timeSlot) => (
          <Grid item xs={4} key={timeSlot}>
            <Chip
              label={timeSlot}
              clickable
              color={selectedTime === timeSlot ? "primary" : "default"}
              onClick={() => setSelectedTime(timeSlot)}
            />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        fullWidth
        onClick={handleTimeSelect}
        disabled={!selectedTime}
        sx={{ mt: 2 }}
      >
        Next
      </Button>
    </Box>
  );
};
