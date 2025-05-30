import React, { useState } from 'react';
import axios from 'axios';

const EmailComposer = () => {
    const [email, setEmail] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const [sending, setSending] = useState(false);
    const [scheduled, setScheduled] = useState(null);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        
        try {
            const response = await axios.post('/api/emails/send', email);
            setScheduled(response.data);
            setEmail({ to: '', subject: '', body: '' });
        } catch (error) {
            alert('Error sending email');
        }
        
        setSending(false);
    };

    return (
        <div className="email-composer">
            <h2>✍️ Compose Email</h2>
            
            {scheduled && (
                <div className="success-message">
                    <h3>📬 Email Scheduled!</h3>
                    <p>Will send in 2 minutes. You can cancel anytime.</p>
                    <button 
                        onClick={() => window.location.href = '/pending'}
                        className="view-pending-btn"
                    >
                        View Pending Emails
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSend} className="email-form">
                <input
                    type="email"
                    placeholder="To: recipient@email.com"
                    value={email.to}
                    onChange={(e) => setEmail({...email, to: e.target.value})}
                    required
                />
                
                <input
                    type="text"
                    placeholder="Subject"
                    value={email.subject}
                    onChange={(e) => setEmail({...email, subject: e.target.value})}
                    required
                />
                
                <textarea
                    placeholder="Write your email..."
                    value={email.body}
                    onChange={(e) => setEmail({...email, body: e.target.value})}
                    rows="10"
                    required
                />
                
                <button type="submit" disabled={sending} className="send-btn">
                    {sending ? '📤 Scheduling...' : '🚀 Send Email (2min delay)'}
                </button>
            </form>
        </div>
    );
};

export default EmailComposer;