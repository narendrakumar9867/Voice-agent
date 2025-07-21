import { useState } from "react";
import JobForm from "../components/JobForm.js";
import JobList from "../components/JobList.js";
import CandidateList from "../components/CandidateList.js";
import AppointmentList from "../components/AppointmentList.js";

const Dashboard = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('jobs');

    const handleRefreshJobs = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'jobs':
                return (
                    <div className="jobs-section">
                        <JobForm refreshJobs={handleRefreshJobs} />
                        <JobList refreshTrigger={refreshTrigger} onRefresh={handleRefreshJobs} />
                    </div>
                );
            case 'candidates':
                return <CandidateList />;
            case 'appointments':
                return <AppointmentList />;
            default:
                return null;
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage job descriptions, monitor candidates, and track appointments</p>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'jobs' ? 'active' : ''}
                    onClick={() => setActiveTab('jobs')}
                >
                    Job Management
                </button>
                <button 
                    className={activeTab === 'candidates' ? 'active' : ''}
                    onClick={() => setActiveTab('candidates')}
                >
                    Candidates
                </button>
                <button 
                    className={activeTab === 'appointments' ? 'active' : ''}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
            </div>

            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Dashboard;