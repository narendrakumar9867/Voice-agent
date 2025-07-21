import axios from "axios";

const API_URL = "http://localhost:7000/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============ JOB APIS ============
export const fetchJobs = async () => {
    try {
        const response = await api.get('/jobs');
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};

export const addJob = async (jobData) => {
    try {
        console.log("Sending job data to API: ", jobData);
        const response = await api.post('/jobs', jobData);
        console.log("API response: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding job:", error.response?.data || error.message);
        throw error;
    }
};

export const updateJob = async (id, jobData) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};

export const getJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job:", error);
        throw error;
    }
};

// ============ CANDIDATE APIS ============
export const fetchCandidates = async () => {
    try {
        const response = await api.get('/candidates');
        return response.data;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        throw error;
    }
};

export const addCandidate = async (candidateData) => {
    try {
        const response = await api.post('/candidates', candidateData);
        return response.data;
    } catch (error) {
        console.error("Error adding candidate:", error);
        throw error;
    }
};

export const updateCandidate = async (id, candidateData) => {
    try {
        const response = await api.put(`/candidates/${id}`, candidateData);
        return response.data;
    } catch (error) {
        console.error("Error updating candidate:", error);
        throw error;
    }
};

export const deleteCandidate = async (id) => {
    try {
        const response = await api.delete(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting candidate:", error);
        throw error;
    }
};

export const getCandidateById = async (id) => {
    try {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching candidate:", error);
        throw error;
    }
};

// ============ APPOINTMENT APIS ============
export const fetchAppointments = async () => {
    try {
        const response = await api.get('/appointments');
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

export const bookAppointment = async (appointmentData) => {
    try {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw error;
    }
};

export const updateAppointment = async (id, appointmentData) => {
    try {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        return response.data;
    } catch (error) {
        console.error("Error updating appointment:", error);
        throw error;
    }
};

export const deleteAppointment = async (id) => {
    try {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting appointment:", error);
        throw error;
    }
};

// ============ CONVERSATION APIS ============
export const fetchConversations = async () => {
    try {
        const response = await api.get('/conversations');
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error;
    }
};

export const saveConversation = async (conversationData) => {
    try {
        const response = await api.post('/conversations', conversationData);
        return response.data;
    } catch (error) {
        console.error("Error saving conversation:", error);
        throw error;
    }
};

export const getConversationsByCandidate = async (candidateId) => {
    try {
        const response = await api.get(`/conversations/candidate/${candidateId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations for candidate:", error);
        throw error;
    }
};

// ============ VOICE AGENT APIS ============
export const initiateCall = async (candidateId, jobId) => {
    try {
        const response = await api.post('/voice/initiate', {
            candidateId,
            jobId
        });
        return response.data;
    } catch (error) {
        console.error("Error initiating call:", error);
        throw error;
    }
};

export const processVoiceInput = async (input, sessionId) => {
    try {
        const response = await api.post('/voice/process', {
            input,
            sessionId
        });
        return response.data;
    } catch (error) {
        console.error("Error processing voice input:", error);
        throw error;
    }
};

// ============ EXPORT DEFAULT ============
const apiService = {
    // Jobs
    fetchJobs,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    
    // Candidates
    fetchCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidateById,
    
    // Appointments
    fetchAppointments,
    bookAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Conversations
    fetchConversations,
    saveConversation,
    getConversationsByCandidate,
    
    // Voice Agent
    initiateCall,
    processVoiceInput
};

export default apiService;