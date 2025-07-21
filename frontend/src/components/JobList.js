import { useEffect, useState } from "react";
import { fetchJobs, deleteJob } from "../services/api.js";

const JobList = ({ refreshTrigger, onRefresh }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        requirements: "",
        slots: ""
    });

    useEffect(() => {
        loadJobs();
    }, [refreshTrigger]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const { data } = await fetchJobs();
            setJobs(data);
        } catch (error) {
            console.error("Error loading jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await deleteJob(jobId);
                setJobs(jobs.filter(job => job.id !== jobId));
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("Error deleting job. Please try again.");
            }
        }
    };

    const startEdit = (job) => {
        setEditingJob(job.id);
        setEditForm({
            title: job.title,
            description: job.description,
            requirements: job.requirements || "",
            slots: job.slots || ""
        });
    };

    const cancelEdit = () => {
        setEditingJob(null);
        setEditForm({ title: "", description: "", requirements: "", slots: "" });
    };

    const saveEdit = async (jobId) => {
        try {
            // This will be implemented when you provide the backend
            // await updateJob(jobId, editForm);
            console.log("Update job:", jobId, editForm);
            
            // For now, update locally
            setJobs(jobs.map(job => 
                job.id === jobId ? { ...job, ...editForm } : job
            ));
            setEditingJob(null);
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Error updating job. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading jobs...</div>;
    }

    return (
        <div className="job-list">
            <div className="job-list-header">
                <h2>Job Openings</h2>
                <button onClick={loadJobs} className="refresh-btn">
                    Refresh
                </button>
            </div>
            
            {jobs.length === 0 ? (
                <p>No jobs available. Add your first job above.</p>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="job-card">
                        {editingJob === job.id ? (
                            <div className="job-edit-form">
                                <input 
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    placeholder="Job Title"
                                />
                                <textarea 
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    placeholder="Description"
                                    rows="3"
                                ></textarea>
                                <textarea 
                                    value={editForm.requirements}
                                    onChange={(e) => setEditForm({...editForm, requirements: e.target.value})}
                                    placeholder="Requirements"
                                    rows="2"
                                ></textarea>
                                <input 
                                    type="number"
                                    value={editForm.slots}
                                    onChange={(e) => setEditForm({...editForm, slots: Number(e.target.value)})}
                                    placeholder="Slots"
                                    min="1"
                                />
                                <div className="edit-actions">
                                    <button onClick={() => saveEdit(job.id)}>Save</button>
                                    <button onClick={cancelEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="job-display">
                                <h3>{job.title}</h3>
                                <p><strong>Description:</strong> {job.description}</p>
                                {job.requirements && (
                                    <p><strong>Requirements:</strong> {job.requirements}</p>
                                )}
                                <p><strong>Available Slots:</strong> {job.slots || 'Not specified'}</p>
                                <p><strong>Created:</strong> {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</p>
                                
                                <div className="job-actions">
                                    <button onClick={() => startEdit(job)} className="edit-btn">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(job.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default JobList;