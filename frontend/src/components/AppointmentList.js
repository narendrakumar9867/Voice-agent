import { useEffect, useState } from "react";
import { fetchAppointments, updateAppointment, deleteAppointment } from "../services/api.js";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await fetchAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Error loading appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateAppointment(appointmentId, { status: newStatus });
            setAppointments(appointments.map(appointment => 
                appointment.id === appointmentId 
                    ? { ...appointment, status: newStatus }
                    : appointment
            ));
        } catch (error) {
            console.error("Error updating appointment status:", error);
            alert("Error updating appointment status. Please try again.");
        }
    };

    const handleDelete = async (appointmentId) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await deleteAppointment(appointmentId);
                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Error deleting appointment. Please try again.");
            }
        }
    };

    const getFilteredAppointments = () => {
        if (filter === 'all') {
            return appointments;
        }
        return appointments.filter(appointment => appointment.status === filter);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return '#007bff';
            case 'completed':
                return '#28a745';
            case 'cancelled':
                return '#dc3545';
            case 'rescheduled':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div>Loading appointments...</div>;
    }

    const filteredAppointments = getFilteredAppointments();

    return (
        <div className="appointment-list">
            <div className="appointment-list-header">
                <h2>Appointments</h2>
                <div className="appointment-controls">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Appointments</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                    </select>
                    <button onClick={loadAppointments} className="refresh-btn">
                        Refresh
                    </button>
                </div>
            </div>

            <div className="appointment-stats">
                <div className="stat-card">
                    <h4>{appointments.filter(a => a.status === 'scheduled').length}</h4>
                    <p>Scheduled</p>
                </div>
                <div className="stat-card">
                    <h4>{appointments.filter(a => a.status === 'completed').length}</h4>
                    <p>Completed</p>
                </div>
                <div className="stat-card">
                    <h4>{appointments.filter(a => a.status === 'cancelled').length}</h4>
                    <p>Cancelled</p>
                </div>
                <div className="stat-card">
                    <h4>{appointments.length}</h4>
                    <p>Total</p>
                </div>
            </div>
            
            {filteredAppointments.length === 0 ? (
                <p>No appointments found. Appointments will appear here after successful voice interactions.</p>
            ) : (
                <div className="appointments-grid">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-header">
                                <h4>Interview Appointment</h4>
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                                >
                                    {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                                </span>
                            </div>

                            <div className="appointment-details">
                                <p><strong>Candidate:</strong> {appointment.candidate_name || 'N/A'}</p>
                                <p><strong>Phone:</strong> {appointment.candidate_phone || 'N/A'}</p>
                                <p><strong>Job:</strong> {appointment.job_title || 'N/A'}</p>
                                <p><strong>Date & Time:</strong> {formatDateTime(appointment.date_time)}</p>
                                <p><strong>Created:</strong> {new Date(appointment.created_at).toLocaleDateString()}</p>
                            </div>

                            <div className="appointment-actions">
                                {appointment.status === 'scheduled' && (
                                    <>
                                        <button 
                                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                            className="complete-btn"
                                        >
                                            Mark Complete
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(appointment.id, 'rescheduled')}
                                            className="reschedule-btn"
                                        >
                                            Reschedule
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                
                                {appointment.status === 'cancelled' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(appointment.id, 'scheduled')}
                                        className="reactivate-btn"
                                    >
                                        Reactivate
                                    </button>
                                )}

                                <button 
                                    onClick={() => handleDelete(appointment.id)} 
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentList;