import { useEffect, useState } from "react";
import { fetchJobs, deleteJob } from "../services/api.js";

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        const { data } = await fetchJobs();
        setJobs(data);
    };

    return (
        <div>
            <h2>Job Openings</h2>
            {jobs.map((job) => (
                <div key={job.id}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <button onClick={() => deleteJob(job.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default JobList;
