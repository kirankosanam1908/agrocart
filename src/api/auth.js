import axios from "axios";

const API_URL = "https://agrocartbackend.onrender.com/api/auth";

// Admin Login API
export const loginAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// Admin Register API
export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/register`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};
