import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002/api", // for development
  //baseURL: "https://MediConnect.onrender.com/api", // for production
  withCredentials: true,
});

export default API;
