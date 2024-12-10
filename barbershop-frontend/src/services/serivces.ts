import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getAllServices() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(BACKEND_URL + "/api/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}
