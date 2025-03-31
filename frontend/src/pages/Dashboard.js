import JobForm from "../components/JobForm.js";
import JobList from "../components/JobList.js";

const Dashboard = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            <JobForm />
            <JobList />
        </div>
    )
};

export default Dashboard;
