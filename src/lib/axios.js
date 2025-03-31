import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:5001/api",
//     withCredentials: true

// })

export const axiosInstance = axios.create({
    baseURL: "https://smartsearch-backend-7drs.onrender.com/api" || "http://localhost:3000/api",
    withCredentials: true
});