import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingEmails = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingEmails();
        const interval = setInterval(fetchPendingEmails, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchPendingEmails = async () => {
        try {
            const response = await axios.get('/api/emails/pending');
            setEmails(response.data);
        } catch (error) {
            console.error('Error fetching emails');
        }
        setLoading(false);
    };

    const cancelEmail = async (emailId) => {
        try {
            await axios.delete(`/api/emails/cancel/${emailId}`);
            fetchPendingEmails();
        } catch (error) {
            alert('Error cancelling email');
        }
    };

    const getTimeRemaining = (scheduledFor) => {
        const now = new Date();
        const scheduled = new Date(scheduledFor);
        const diff = scheduled - now;
        
        if (diff <= 0) return 'Sending now...';
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="pending-emails">
            <h2>⏳ Pending Emails</h2>
            
            {emails.length === 0 ? (
                <p>No pending emails</p>
            ) : (
                emails.map(email => (
                    <div key={email._id} className="email-card">
                        <div className="email-info">
                            <strong>To:</strong> {email.to}<br/>
                            <strong>Subject:</strong> {email.subject}<br/>
                            <strong>Sends in:</strong> {getTimeRemaining(email.scheduledFor)}
                        </div>
                        
                        <button 
                            onClick={() => cancelEmail(email._id)}
                            className="cancel-btn"
                        >
                            🚫 CANCEL
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default PendingEmails;