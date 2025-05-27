import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useplayListstore = create((set, get) => ({
    playLists: [],
    currentplayLists: null,
    isLoading: false,
    error: null,

    createplayLists: async (playListsData) => {
        try {
            set({ isLoading: true });
            const response = await axiosInstance.post(
                "/playlist/createplaylist",
                playListsData
            );

            set((state) => ({
                playLists: [...state.playLists, response.data.playLists],
            }));

            toast.success("created playLists successfully");
            return response.data.playLists;
        } catch (error) {
            console.error("Error creating playLists:", error);
            toast.error(error.response?.data?.error || "Failed to create playLists");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getAllplayLists: async () => {
        try {
            set({ isLoading: true });
            const response = await axiosInstance.get("/playLists");
            set({ playLists: response.data.playLists });
        } catch (error) {
            console.error("Error fetching playLists:", error);
            toast.error("Failed to fetch playLists");
        } finally {
            set({ isLoading: false });
        }
    },

    getplayListsDetails: async (playListsId) => {
        try {
            set({ isLoading: true });
            const response = await axiosInstance.get(`/playLists/${playListsId}`);
            set({ currentplayLists: response.data.playLists });
        } catch (error) {
            console.error("Error fetching playLists details:", error);
            toast.error("Failed to fetch playLists details");
        } finally {
            set({ isLoading: false });
        }
    },

    addProblemToplayLists: async (playListsId, problemIds) => {
        try {
            set({ isLoading: true });
            await axiosInstance.post(`/playLists/${playListsId}/add-problem`, {
                problemIds,
            });

            toast.success("Problem added to playLists");

            // Refresh the playLists details
            if (get().currentplayLists?.id === playListsId) {
                await get().getplayListsDetails(playListsId);
            }
        } catch (error) {
            console.error("Error adding problem to playLists:", error);
            toast.error("Failed to add problem to playLists");
        } finally {
            set({ isLoading: false });
        }
    },

    removeProblemFromplayLists: async (playListsId, problemIds) => {
        try {
            set({ isLoading: true });
            await axiosInstance.post(`/playLists/${playListsId}/remove-problems`, {
                problemIds,
            });

            toast.success("Problem removed from playLists");

            // Refresh the playLists details
            if (get().currentplayLists?.id === playListsId) {
                await get().getplayListsDetails(playListsId);
            }
        } catch (error) {
            console.error("Error removing problem from playLists:", error);
            toast.error("Failed to remove problem from playLists");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteplayLists: async (playListsId) => {
        try {
            set({ isLoading: true });
            await axiosInstance.delete(`/playLists/${playListsId}`);

            set((state) => ({
                playLists: state.playLists.filter((p) => p.id !== playListsId),
            }));

            toast.success("playLists deleted successfully");
        } catch (error) {
            console.error("Error deleting playLists:", error);
            toast.error("Failed to delete playLists");
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useplayListstore;