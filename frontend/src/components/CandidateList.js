import { useEffect, useState } from "react";
import { fetchCandidates, deleteCandidate, getConversationsByCandidate } from "../services/api.js";

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [showConversations, setShowConversations] = useState(false);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const { data } = await fetchCandidates();
            setCandidates(data);
        } catch (error) {
            console.error("Error loading candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (candidateId) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await deleteCandidate(candidateId);
                setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
            } catch (error) {
                console.error("Error deleting candidate:", error);
                alert("Error deleting candidate. Please try again.");
            }
        }
    };

    const viewConversations = async (candidate) => {
        setSelectedCandidate(candidate);
        setShowConversations(true);
        
        try {
            const { data } = await getConversationsByCandidate(candidate.id);
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setConversations([]);
        }
    };

    const closeConversations = () => {
        setShowConversations(false);
        setSelectedCandidate(null);
        setConversations([]);
    };

    if (loading) {
        return <div>Loading candidates...</div>;
    }

    if (showConversations) {
        return (
            <div className="conversations-view">
                <div className="conversations-header">
                    <h3>Conversations - {selectedCandidate?.name}</h3>
                    <button onClick={closeConversations}>← Back to Candidates</button>
                </div>
                
                <div className="candidate-details">
                    <p><strong>Phone:</strong> {selectedCandidate?.phone}</p>
                    <p><strong>Experience:</strong> {selectedCandidate?.experience} years</p>
                    <p><strong>Current CTC:</strong> {selectedCandidate?.current_ctc}</p>
                    <p><strong>Expected CTC:</strong> {selectedCandidate?.expected_ctc}</p>
                    <p><strong>Notice Period:</strong> {selectedCandidate?.notice_period}</p>
                </div>

                <div className="conversations-list">
                    {conversations.length === 0 ? (
                        <p>No conversations found for this candidate.</p>
                    ) : (
                        conversations.map((conversation) => (
                            <div key={conversation.id} className="conversation-card">
                                <div className="conversation-header">
                                    <span className="conversation-date">
                                        {new Date(conversation.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="conversation-transcript">
                                    <h5>Transcript:</h5>
                                    <pre>{conversation.transcript}</pre>
                                </div>
                                {conversation.entities_extracted && (
                                    <div className="extracted-entities">
                                        <h5>Extracted Data:</h5>
                                        <pre>{JSON.stringify(JSON.parse(conversation.entities_extracted), null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-list">
            <div className="candidate-list-header">
                <h2>Candidates</h2>
                <button onClick={loadCandidates} className="refresh-btn">
                    Refresh
                </button>
            </div>
            
            {candidates.length === 0 ? (
                <p>No candidates available. Candidates will appear here after voice interactions.</p>
            ) : (
                <div className="candidates-grid">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="candidate-card">
                            <h4>{candidate.name}</h4>
                            <p><strong>Phone:</strong> {candidate.phone}</p>
                            <p><strong>Experience:</strong> {candidate.experience} years</p>
                            <p><strong>Current CTC:</strong> {candidate.current_ctc || 'Not provided'}</p>
                            <p><strong>Expected CTC:</strong> {candidate.expected_ctc || 'Not provided'}</p>
                            <p><strong>Notice Period:</strong> {candidate.notice_period || 'Not provided'}</p>
                            
                            <div className="candidate-actions">
                                <button 
                                    onClick={() => viewConversations(candidate)}
                                    className="view-btn"
                                >
                                    View Conversations
                                </button>
                                <button 
                                    onClick={() => handleDelete(candidate.id)} 
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

export default CandidateList;