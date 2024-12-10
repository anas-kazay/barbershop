import axios from "axios";

export async function getAllServices() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:5000/api/services", {
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
