import axios from "axios";

const API_URL = "http://localhost:7000/api/";

export const fetchJobs = async () => {
    try {
        const response = await axios.get(`${API_URL}/jobs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

export const addJob = async (jobData) => {
    try {
        console.log("Sending job data to API: ", jobData);
        const response = await axios.post(`${API_URL}/jobs`, jobData);
        console.log("api response: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding job:", error.response || error.message);
        throw error;
    }
};

export const updateJob = async (id, jobData) => {
    try {
        const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};

const apiService = {
    fetchJobs,
    addJob,
    updateJob,
    deleteJob
};

export default apiService;
