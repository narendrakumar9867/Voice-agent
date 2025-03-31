import { useState } from "react";
import { addJob } from "../services/api.js";

const JobForm = ({ refreshJobs }) => {
    const [job, setJob] = useState({
        title: "",
        description: "",
        slots: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addJob(job);
            setJob({ title: "", description: "", slots: "" });
            refreshJobs();
        } catch (error) {
            console.error("Error adding job:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Job Title" onChange={(e) => setJob({ ...job, title: e.target.value })} />
            <textarea placeholder="Description" onChange={(e) => setJob({ ...job, description: e.target.value })}></textarea>
            <input type="number" placeholder="Interview Slots" onChange={(e) => setJob({ ...job, slots: e.target.value })} />
            <button type="submit">Add Job</button>
        </form>
    )
};

export default JobForm;
