import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardHeader, CardContent } from "@mui/material";
import { parseISO } from "date-fns";
import { Navbar } from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

import { getAllBarbers } from "../../services/barbers";
import { getAllServices } from "../../services/serivces";
import { createAppointment } from "../../services/appointments";

import { User } from "../../types/User";
import { Service } from "../../types/Service";
import { Appointment } from "../../types/Appointment";

import { BarberSelection } from "./BarberSelection";
import { ServiceSelection } from "./ServiceSelection";
import { DaySelection } from "./DaySelection";
import { TimeSlotSelection } from "./TimeSlotSelection";
import { AppointmentDetails } from "./AppointmentDetails";

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBarbers = async () => {
      try {
        const fetchedBarbers = await getAllBarbers();
        setBarbers(fetchedBarbers);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchBarbers();
    fetchServices();
  }, [navigate]);

  const handleBarberSelect = (barberId: string) => {
    setFormData((prev) => ({ ...prev, barberId }));
    setCurrentStep(2);
  };

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

  const handleDaySelect = (date: Date) => {
    const isoString = date.toISOString();
    setFormData((prev) => ({
      ...prev,
      time: isoString,
    }));
    setCurrentStep(4);
  };

  const handleTimeSelect = (time: string) => {
    try {
      const selectedDateTime = parseISO(
        formData.time || new Date().toISOString()
      );
      const [hours, minutes] = time.split(":").map(Number);
      const finalDateTime = new Date(selectedDateTime);
      finalDateTime.setHours(hours, minutes, 0, 0);

      setFormData((prev) => ({
        ...prev,
        time: finalDateTime.toISOString(),
      }));

      setCurrentStep(5);
    } catch (error) {
      console.error("Error in time selection:", error);
      alert("An error occurred while selecting the time");
    }
  };

  const handleSubmit = async (comment: string) => {
    const user = JSON.parse(localStorage.getItem("user") ?? "");

    const completeAppointment: Appointment = {
      ...(formData as Appointment),
      _id: crypto.randomUUID(),
      userId: user.id,
      comment: comment,
      updatedAt: new Date(),
    };

    try {
      await createAppointment(completeAppointment);
      alert("Appointment booked successfully!");
      navigate("/my-profile");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to book appointment");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BarberSelection
            barbers={barbers}
            onBarberSelect={handleBarberSelect}
          />
        );
      case 2:
        return (
          <ServiceSelection
            services={services}
            selectedServiceIds={formData.serviceIds || []}
            onServiceSelect={handleServiceSelect}
            onNextStep={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <DaySelection
            barbers={barbers}
            selectedBarberId={formData.barberId || ""}
            onDaySelect={handleDaySelect}
          />
        );
      case 4:
        return (
          <TimeSlotSelection
            barbers={barbers}
            services={services}
            selectedServiceIds={formData.serviceIds || []}
            selectedBarberId={formData.barberId || ""}
            selectedDate={formData.time || ""}
            onTimeSelect={handleTimeSelect}
          />
        );
      case 5:
        return (
          <AppointmentDetails formData={formData} onSubmit={handleSubmit} />
        );
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
