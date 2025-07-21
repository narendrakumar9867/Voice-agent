import { useState } from "react";
import { addJob } from "../services/api.js";

const JobForm = ({ refreshJobs }) => {
    const [job, setJob] = useState({
        title: "",
        description: "",
        requirements: "",
        slots: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        
        try {
            console.log("Submitting Job: ", job);
            await addJob(job);
            setJob({ title: "", description: "", requirements: "", slots: "" });
            setMessage("Job added successfully!");
            console.log("refreshing jobs...");
            if (refreshJobs) {
                refreshJobs();
            }
        } catch (error) {
            console.error("Error adding job:", error);
            setMessage("Error adding job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setJob(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="job-form">
            <h3>Add New Job</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Job Title" 
                        value={job.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <textarea 
                        placeholder="Job Description" 
                        value={job.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <textarea 
                        placeholder="Requirements" 
                        value={job.requirements}
                        onChange={(e) => handleChange('requirements', e.target.value)}
                        rows="3"
                        required
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <input 
                        type="number" 
                        placeholder="Interview Slots" 
                        value={job.slots}
                        onChange={(e) => handleChange('slots', Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Job"}
                </button>
                
                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default JobForm;