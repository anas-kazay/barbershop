import axios from "axios";

export async function createService(serviceData: {
  name: string;
  price: number;
  duration: number;
}) {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const response = await axios.post(
      "http://localhost:5000/api/owner/services",
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function modifyService(
  serviceId: string,
  updatedData: { name?: string; price?: number; duration?: number }
) {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const response = await axios.put(
      `http://localhost:5000/api/owner/services/${serviceId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error modifying service:", error);
    throw error;
  }
}

export async function deleteService(serviceId: string) {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    console.log(serviceId);
    const response = await axios.delete(
      `http://localhost:5000/api/owner/services/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    console.log(userId);
    const response = await axios.delete(
      `http://localhost:5000/api/owner/barbers/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function createBarber(barberData: object) {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      throw new Error("Missing authentication token"); // Handle missing token gracefully
    }

    const response = await axios.post(
      "http://localhost:5000/api/owner/barbers",
      barberData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set content type for JSON data
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating barber:", error);
    // Handle other potential errors gracefully (e.g., network issues, validation errors)
    throw error; // Re-throw the error for further handling in the calling component
  }
}

export async function updateBarberSchedule(
  barberId: string,
  scheduleData: object
): Promise<any> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Missing authentication token");
    }

    const url = `http://localhost:5000/api/owner/barbers/${barberId}/schedule`;

    const response = await axios.put(url, scheduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating barber schedule:", error);

    if (error.response) {
      if (error.response.status === 400) {
        throw new Error("Validation error: " + error.response.data.message);
      } else {
        throw new Error("Server error: " + error.response.data.message);
      }
    } else if (error.request) {
      throw new Error("Network error: Could not reach server");
    } else {
      throw error;
    }
  }
}
