import axios from "axios";
import { Appointment } from "../types/Appointment";

const BACKEND_URL = import.meta.env.BACKEND_URL || "";

export const getAllAppointments = async () => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  console.log(token);
  // Check if token exists
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get<Appointment[]>(
      BACKEND_URL + "/api/appointments",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorMessage =
        error.response?.data?.message || "Failed to fetch appointments";
      console.error("Appointments fetch error:", errorMessage);

      // Handle unauthorized errors (e.g., token expired)
      if (error.response?.status === 401) {
        // Optional: You might want to clear the token and redirect to login
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = '/login';
      }

      throw new Error(errorMessage);
    } else {
      // Handle generic errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const createAppointment = async (appointmentData: Appointment) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Check if token exists
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post<Appointment>(
      BACKEND_URL + "/api/appointments/reserve",
      appointmentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorMessage =
        error.response?.data?.message || "Failed to book appointment";
      console.error("Appointment booking error:", errorMessage);

      // Handle unauthorized errors (e.g., token expired)
      if (error.response?.status === 401) {
        // Optional: You might want to clear the token and redirect to login
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = '/login';
      }

      throw new Error(errorMessage);
    } else {
      // Handle generic errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllUserAppointments = async (): Promise<Appointment[]> => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  console.log(token);

  // Check if token exists
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get<Appointment[]>(
      BACKEND_URL + "/api/appointments/user/appointments",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorMessage =
        error.response?.data?.message || "Failed to fetch appointments";
      console.error("Appointments fetch error:", errorMessage);

      // Handle unauthorized errors (e.g., token expired)
      if (error.response?.status === 401) {
        console.error("Unauthorized request. Token might be expired.");

        // Optional: Clear token and potentially redirect to login
        localStorage.removeItem("token");
        // window.location.href = '/login'; // Uncomment if you want to redirect
      }

      throw new Error(errorMessage); // Re-throw error with a clear message
    } else {
      // Handle generic errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllBarberAppointments = async (): Promise<Appointment[]> => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  console.log(token);

  // Check if token exists
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get<Appointment[]>(
      BACKEND_URL + "/api/appointments/barber/appointments",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorMessage =
        error.response?.data?.message || "Failed to fetch barber appointments";
      console.error("Barber appointments fetch error:", errorMessage);

      // Handle unauthorized errors (e.g., token expired)
      if (error.response?.status === 401) {
        console.error("Unauthorized request. Token might be expired.");

        // Optional: Clear token and potentially redirect to login
        localStorage.removeItem("token");
        // window.location.href = '/login'; // Uncomment if you want to redirect
      }

      throw new Error(errorMessage); // Re-throw error with a clear message
    } else {
      // Handle generic errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: string
): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put<Appointment>(
      BACKEND_URL + `/api/appointments/${appointmentId}/status`,
      { newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Appointment status updated successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to update appointment status";
      console.error("Appointment update error:", errorMessage);

      if (error.response?.status === 401) {
        console.error("Unauthorized request. Token might be expired.");
        // Optional: Clear token and potentially redirect to login
        localStorage.removeItem("token");
        // window.location.href = '/login'; // Uncomment if you want to redirect
      }

      throw new Error(errorMessage);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAppointmentsByBarberAndDay = async (
  barberId: string,
  day: string
) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Check if token exists
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get<Appointment[]>(
      BACKEND_URL + `/api/appointments/${barberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          day: day, // Pass the day as a query parameter
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const errorMessage =
        error.response?.data?.message || "Failed to fetch appointments";
      console.error("Appointments fetch error:", errorMessage);

      // Handle unauthorized errors (e.g., token expired)
      if (error.response?.status === 401) {
        // Optional: You might want to clear the token and redirect to login
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = '/login';
      }

      throw new Error(errorMessage);
    } else {
      // Handle generic errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
