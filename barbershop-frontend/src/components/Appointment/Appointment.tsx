import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { format, addDays, parseISO } from "date-fns";
import {
  createAppointment,
  getAppointmentsByBarberAndDay,
} from "../../services/appointments";
import { User } from "../../types/User";
import { getAllBarbers } from "../../services/barbers";
import { Service } from "../../types/Service";
import { getAllServices } from "../../services/serivces";
import { Appointment } from "../../types/Appointment";
import { Navbar } from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

// Interfaces
export interface WorkingSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [barbers, setBarbers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const fetchedBarbers = await getAllBarbers();

        setBarbers(fetchedBarbers);
      } catch (error) {
        // setError(error);
      }
    };

    fetchBarbers();
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getAllServices();
        console.log(fetchedServices);
        setServices(fetchedServices);
      } catch (error) {
        // setError(error);
      }
    };
    fetchServices();
  }, []);

  // Step 1: Barber Selection
  const BarberSelection: React.FC = () => {
    const handleBarberSelect = (barberId: string) => {
      setFormData((prev) => ({ ...prev, barberId }));
      setCurrentStep(2);
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Select a Barber
        </Typography>
        <Grid container spacing={2}>
          {barbers.map((barber) => (
            <Grid item xs={12} key={barber.id}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleBarberSelect(barber.id)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  paddingLeft: "72px", // Increased padding for larger avatar
                  height: "64px", // Increased button height
                }}
              >
                <Avatar
                  src={barber.profilePicture}
                  alt={barber.name + "'s profile picture"}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48, // Larger avatar width
                    height: 48, // Larger avatar height
                  }}
                />
                <span style={{ fontSize: "1rem" }}>{barber.name}</span>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Step 2: Service Selection
  const ServiceSelection: React.FC = () => {
    const handleServiceSelect = (serviceId: string) => {
      const currentServices = formData.serviceIds || [];
      const newServices = currentServices.includes(serviceId)
        ? currentServices.filter((id) => id !== serviceId)
        : [...currentServices, serviceId];

      // Calculate total price and duration
      const totalPrice = newServices.reduce((sum, id) => {
        const service = services.find((s) => s._id === id);
        return sum + (service ? service.price : 0);
      }, 0);

      const totalDuration = newServices.reduce((sum, id) => {
        const service = services.find((s) => s._id === id);
        return sum + (service ? service.duration : 0);
      }, 0);

      setFormData((prev) => ({
        ...prev,
        serviceIds: newServices,
        totalPrice,
        totalDuration,
      }));
    };

    const isSelected = (serviceId: string) =>
      formData.serviceIds?.includes(serviceId) || false;

    const nextStep = () => setCurrentStep(3);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Select Services
        </Typography>
        {services.map((service) => (
          <FormControlLabel
            key={service._id}
            control={
              <Checkbox
                checked={isSelected(service._id)}
                onChange={() => handleServiceSelect(service._id)}
              />
            }
            label={`${service.name} - $${service.price}`}
          />
        ))}
        <Button
          variant="contained"
          fullWidth
          onClick={nextStep}
          disabled={!formData.serviceIds?.length}
          sx={{ mt: 2 }}
        >
          Next
        </Button>
      </Box>
    );
  };

  // Step 3: Day Selection
  // Step 3: Day Selection
  const DaySelection: React.FC = () => {
    // Generate next 7 days including today
    const availableDays = useMemo(() => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);
        return {
          date,
          dayOfWeek: date.getDay(),
          formattedDate: format(date, "yyyy-MM-dd"),
          dayName: format(date, "EEEE"),
        };
      });
    }, []);

    // Check if barber is working on this day
    const isDayAvailable = (dayOfWeek: number) => {
      console.log("Selected Barber ID:", formData.barberId);
      const barber = barbers.find((b) => b.id === formData.barberId);

      if (!barber) {
        console.error("No barber selected");
        return false;
      }

      const scheduleForDay = barber.workingSchedule?.find(
        (schedule) => schedule.dayOfWeek === dayOfWeek
      );

      console.log("Schedule for day:", scheduleForDay);
      return scheduleForDay?.isWorking || false;
    };

    const handleDaySelect = (date: Date) => {
      console.log("Detailed Date Info:", {
        date,
        isDate: date instanceof Date,
        isValidDate: !isNaN(date.getTime()),
        isoString: date.toISOString(),
        dayOfWeek: date.getDay(),
      });

      // Ensure the date is valid before setting
      if (date instanceof Date && !isNaN(date.getTime())) {
        const isoString = date.toISOString();

        // Extra validation
        try {
          const parsedDate = parseISO(isoString);

          // Verify the parsed date is valid
          if (isNaN(parsedDate.getTime())) {
            console.error("Invalid parsed date");
            alert("Unable to process the selected date");
            return;
          }

          setFormData((prev) => ({
            ...prev,
            time: isoString,
          }));

          // Explicitly log the updated form data
          console.log("Updated Form Data:", {
            ...formData,
            time: isoString,
          });

          // Move to next step
          setCurrentStep(4);
        } catch (error) {
          console.error("Error processing date:", error);
          alert("An error occurred while selecting the date");
        }
      } else {
        console.error("Invalid date selected", date);
        alert("Please select a valid date");
      }
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Select a Day
        </Typography>
        <Grid container spacing={2}>
          {availableDays.map((day) => {
            const isAvailable = isDayAvailable(day.dayOfWeek);
            console.log(`Day ${day.dayName} availability:`, isAvailable);

            return (
              <Grid item xs={4} key={day.formattedDate}>
                <Button
                  variant={isAvailable ? "contained" : "outlined"}
                  fullWidth
                  disabled={!isAvailable}
                  onClick={() => {
                    console.log("Button clicked:", {
                      date: day.date,
                      dayOfWeek: day.dayOfWeek,
                      formattedDate: day.formattedDate,
                    });
                    handleDaySelect(day.date);
                  }}
                >
                  {day.dayName + " "}

                  {format(day.date, "MMM dd")}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Step 4: Time Slot Selection
  const TimeSlotSelection: React.FC = () => {
    const [selectedTime, setSelectedTime] = useState("");
    const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>(
      []
    );

    // Add this useEffect to fetch booked appointments when the component mounts
    useEffect(() => {
      const fetchBookedAppointments = async () => {
        try {
          if (formData.barberId && formData.time) {
            const selectedDate = parseISO(formData.time);
            const formattedDay = format(selectedDate, "yyyy-MM-dd");

            const appointments = await getAppointmentsByBarberAndDay(
              formData.barberId,
              formattedDay
            );

            console.log(appointments);

            setBookedAppointments(appointments);
          }
        } catch (error) {
          console.error("Error fetching booked appointments:", error);
        }
      };

      fetchBookedAppointments();
    }, [formData.barberId, formData.time]);

    // Add the handleTimeSelect function
    const handleTimeSelect = () => {
      console.log("Time Selection Details:", {
        selectedTime,
        formDataTime: formData.time,
      });

      // Combine the selected date and time
      try {
        const selectedDateTime = parseISO(
          formData.time || new Date().toISOString()
        );

        const [hours, minutes] = selectedTime.split(":").map(Number);
        const finalDateTime = new Date(selectedDateTime);
        finalDateTime.setHours(hours, minutes, 0, 0);

        setFormData((prev) => ({
          ...prev,
          time: finalDateTime.toISOString(),
        }));

        // Move to next step
        setCurrentStep(5);
      } catch (error) {
        console.error("Error in time selection:", error);
        alert("An error occurred while selecting the time");
      }
    };

    const availableTimeSlots = useMemo(() => {
      console.log("Time Slot Selection - Form Data:", {
        barberId: formData.barberId,
        time: formData.time,
      });

      // Find the barber and their schedule for the selected day
      const selectedDate = parseISO(formData.time || new Date().toISOString());
      const barber = barbers.find((b) => b.id === formData.barberId);
      const daySchedule =
        barber?.workingSchedule?.find(
          (schedule) => schedule.dayOfWeek === selectedDate.getDay()
        ) ?? null;

      if (!daySchedule) {
        console.error("No schedule found for the selected day");
        return [];
      }

      // Generate time slots
      const generatedSlots: string[] = [];
      const [startHour, startMinute] = daySchedule.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = daySchedule.endTime.split(":").map(Number);

      let currentTime = new Date(selectedDate);
      currentTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      while (currentTime < endTime) {
        generatedSlots.push(format(currentTime, "HH:mm"));
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }

      // Create a map to track blocked time slots
      const blockedSlots = new Set<string>();

      // Determine blocked slots based on booked appointments
      bookedAppointments.forEach((appointment) => {
        const appointmentTime = parseISO(appointment.time);
        const appointmentTimeString = format(appointmentTime, "HH:mm");
        console.log(appointmentTimeString);
        // Find the corresponding services to check duration
        const serviceIds = appointment.serviceIds;
        const totalDuration = services
          .filter((service) => serviceIds.includes(service._id))
          .reduce((sum, service) => sum + service.duration, 0);
        console.log("tatal Duration : ", totalDuration);

        // Calculate how many slots this appointment takes
        const slotsNeeded = Math.ceil(totalDuration / 30);

        // Find the index of the appointment time slot
        const startIndex = generatedSlots.indexOf(appointmentTimeString);

        // Block out the required number of slots
        for (let i = 0; i < slotsNeeded; i++) {
          const slotToBlock = generatedSlots[startIndex + i];
          if (slotToBlock) {
            blockedSlots.add(slotToBlock);
          }
        }
      });
      console.log(blockedSlots);
      // Return only unblocked time slots
      return generatedSlots.filter((timeSlot) => !blockedSlots.has(timeSlot));
    }, [formData.barberId, formData.time, bookedAppointments, services]);

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
                onClick={() => {
                  console.log("Time Slot Clicked:", timeSlot);
                  setSelectedTime(timeSlot);
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            console.log("Next Button Clicked", {
              selectedTime,
              canProceed: !!selectedTime,
            });
            handleTimeSelect();
          }}
          disabled={!selectedTime}
          sx={{ mt: 2 }}
        >
          Next
        </Button>
      </Box>
    );
  };

  // Step 5: Final Details and Submission
  const AppointmentDetails: React.FC = () => {
    const [localComment, setLocalComment] = useState("");

    const handleSubmit = async () => {
      // Final form submission
      const user = JSON.parse(localStorage.getItem("user") ?? "");
      console.log(user.id);
      const completeAppointment: Appointment = {
        ...(formData as Appointment),
        _id: crypto.randomUUID(),
        userId: user.id, // Use the ObjectId from the user object
        comment: localComment,
        updatedAt: new Date(),
      };

      console.log(completeAppointment.userId);

      try {
        console.log(completeAppointment);
        await createAppointment(completeAppointment);

        alert("Appointment booked successfully!");
        navigate("/my-profile");
        // Reset form or navigate away
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to book appointment");
      }
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Appointment Details
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Comments"
          value={localComment}
          onChange={(e) => setLocalComment(e.target.value)}
          placeholder="Any special requests?"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Book Appointment
        </Button>
      </Box>
    );
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BarberSelection />;
      case 2:
        return <ServiceSelection />;
      case 3:
        return <DaySelection />;
      case 4:
        return <TimeSlotSelection />;
      case 5:
        return <AppointmentDetails />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Card sx={{ maxWidth: 500, margin: "auto" }}>
          <CardHeader
            title="Book Your Appointment"
            titleTypographyProps={{ variant: "h5", align: "center" }}
          />
          <CardContent>
            {renderStep()}
            {currentStep > 1 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                sx={{ mt: 2 }}
              >
                Back
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default AppointmentForm;
