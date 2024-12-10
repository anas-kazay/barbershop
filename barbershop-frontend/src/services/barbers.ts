import axios from "axios";

export async function getAllBarbers() {
  try {
    const response = await axios.get("http://localhost:5000/api/barbers");
    return response.data;
  } catch (error) {
    console.error("Error fetching barbers:");
    throw error;
  }
}
