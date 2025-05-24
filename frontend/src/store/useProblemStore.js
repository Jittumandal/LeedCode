import { create } from 'zustand';
import axiosInstance from "../lib/axios.js"; // Import the axios instance
import { toast } from 'react-hot-toast';


const useProblemStore = create((set) => ({
    problems: [], // Array to store all problems
    problem: null, // Object to store a single problem
    solvedProblems: [], // Array to store solved problems
    isProblemsLoading: false, // Boolean to indicate if problems are being loaded
    isProblemLoading: false, // Boolean to indicate if a single problem is being loaded


    // Actions to update the state and trigger re-renders feching data by providing the API
    getAllProblems: async () => {
        try {
            // Get the authentication token from the auth store
            set({ isProblemsLoading: true });
            const response = await axiosInstance.get('/problems/get-problems');
            set({ problems: response.data.problems });
        } catch (error) {
            console.error('Error fetching problems data from server:', error);
            toast.error('Error fetching problems data from server');

        } finally {
            set({ isProblemsLoading: false });
        }
    },

    // Action to create a new problem
    getProblemById: async (id) => {
        try {
            // Get the authentication token from the auth store
            set({ isProblemLoading: true });
            const response = await axiosInstance.get(`/problems/get-problem/${id}`);
            set({ problem: response.data.problem });
            toast.success('Problem fetched successfully');
        } catch (error) {
            console.error('Error fetching problem data from server:', error);
            toast.error('Error fetching problem data from server');

        }
        finally {
            set({ isProblemLoading: false });
        }

    },

    getSolvedProblemByUser: async () => {
        try {
            // Get the authentication token from the auth store
            const response = await axiosInstance.get('/problems/get-solved-problems');
            set({ solvedProblems: response.data.solvedProblems });
            toast.success('Solved problems fetched successfully');


        } catch (error) {

            console.error('Error fetching solved problems data from server:', error);
            toast.error('Error fetching solved problems data from server');
        }
        finally {
            set({ isProblemLoading: false });
        }
    },

}));

export default useProblemStore;