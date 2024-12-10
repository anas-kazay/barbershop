import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getAllBarbers() {
  try {
    const response = await axios.get(BACKEND_URL + "/api/barbers");
    return response.data;
  } catch (error) {
    console.error("Error fetching barbers:");
    throw error;
  }
}
