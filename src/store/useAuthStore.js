import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast, { Toaster } from "react-hot-toast";


export const useAuthStore = create((set, get)=>({
    authUser:null,
    isCheckingAuth:true,

    checkAuth: async () => {
        try{
           const res = await axiosInstance.get("auth/user/me");
           set({authUser:res.data});
           console.log("authUser in checkAuth :" , res.data);
        } catch (error){
           set({authUser:null})
           console.error("Error in checkAuth ", error)
        } finally {
            set({isCheckingAuth:false})
        }
    },

    signup: async (userData) => {
        try {
          const response = await axiosInstance.post("http://localhost:5001/api/auth/signup", userData);
          set({ authUser: response.data });
          return response.data; // Correctly returning API response
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Signup failed";
          set({ authUser: null });
          toast.error(errorMessage);
          return null; // Returning error message
        } finally {
          set({ isLoading: false });
        }
      },
   
    login: async (userData) => {
        try{
            const response = await axiosInstance.post("http://localhost:5001/api/auth/login", userData);
            set({authUser: response.data});
            return response.data;

        } catch (error){
            const errorMessage = error.response?.data?.message || "Login failed";
            set({authUser : null});
            toast.error(errorMessage);
            return null

        } finally {
            set({isLoading:false})
        }
    },

    logout: async () => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");

        } catch(error){
            toast.error(error.response.data.message);
   
        }
    },
    
    
      
}))

