import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    // defind variables state
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,


    // check if user is authenticated 
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("checkauth response", res.data);

            set({ authUser: res.data.user });
        } catch (error) {
            console.log("❌ Error checking auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // signup and login functions and logout function is sinnup ya not si

    signup: async (data) => {
        set({ isSigninUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);

            set({ authUser: res.data.user });

            toast.success(res.data.message);
        } catch (error) {
            console.log("ther user error signing up", error);
            toast.error("the user error signing up");
        } finally {
            set({ isSigninUp: false });
        }
    },

    // check user is login or not login function
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);

            set({ authUser: res.data.user });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error logging in", error);
            toast.error("Error logging in");
        } finally {
            set({ isLoggingIn: false });
        }
    },


    // check user is login out or not login out function
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });

            toast.success("Logout successful");
        } catch (error) {
            console.log("Error logging out", error);
            toast.error("Error logging out");
        }
    },
}));