import axios from "axios";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export async function loginUser(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const response = await axios.post(BACKEND_URL + "/api/users/login", {
      email,
      password,
    });

    if (response.status === 200) {
      const { token, user } = response.data; // Extract token and user from the response

      // Store token and user in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user as a JSON string

      console.log("Authentication successful");
      return true;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<boolean> {
  try {
    const response = await axios.post(BACKEND_URL + "/api/users/register", {
      name,
      email,
      password,
    });

    if (response.status === 200 || response.status === 201) {
      // Handle successful creation (201 Created)
      return true;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function getUserData(
  navigate: ReturnType<typeof useNavigate>
): Promise<{
  user: User;
  success: boolean;
}> {
  try {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found in localStorage. Please login first.");
    }

    const response = await axios.get(BACKEND_URL + "/api/users/userData", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
    });

    if (response.status === 200) {
      const user = response.data;
      return { user, success: true };
    } else {
      throw new Error("Failed to retrieve user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    throw error; // Re-throw for handling in the calling code
  }
}
