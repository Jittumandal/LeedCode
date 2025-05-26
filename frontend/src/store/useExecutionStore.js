import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";



const useExecutionStore = create((set,) => ({
    isExecuting: false,
    submission: null,

    executeCode: async (source_code, language_id, stdin, excepected_output, problemId) => {
        try {
            set({ isExecuting: true });
            console.log("Submission:", JSON.stringify({
                source_code,
                language_id,
                stdin,
                excepected_output,
                problemId
            }));
            const res = await axiosInstance.post("/excute-code", { source_code, language_id, stdin, excepected_output, problemId });
            console.log("Response from execute-code:", res);
            set({ submission: res.data.submission });


            toast.success(res.data.message);
        } catch (error) {
            console.log("Error executing code", error);
            toast.error("Error executing code");
        }
        finally {
            set({ isExecuting: false });
        }
    }
}))

export default useExecutionStore;