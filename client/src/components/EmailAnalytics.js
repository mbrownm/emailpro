import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        openRate: 0,
        clickRate: 0,
        recentEmails: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics');
        }
    };

    return (
        <div className="analytics-dashboard">
            <h2>📊 Email Analytics</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{analytics.totalSent}</h3>
                    <p>Emails Sent</p>
                </div>
                <div className="stat-card">
                    <h3>{analytics.openRate}%</h3>
                    <p>Open Rate</p>
                </div>
                <div className="stat-card">
                    <h3>{analytics.clickRate}%</h3>
                    <p>Click Rate</p>
                </div>
                <div className="stat-card">
                    <h3>{analytics.totalOpened}</h3>
                    <p>Total Opens</p>
                </div>
            </div>

            <div className="recent-emails">
                <h3>Recent Email Performance</h3>
                {analytics.recentEmails.map(email => (
                    <div key={email._id} className="email-performance">
                        <div className="email-info">
                            <strong>{email.subject}</strong>
                            <small>To: {email.recipient}</small>
                        </div>
                        <div className="performance-stats">
                            {email.opened ? (
                                <span className="opened">✅ Opened</span>
                            ) : (
                                <span className="not-opened">❌ Not Opened</span>
                            )}
                            <span className="clicks">{email.clicks} clicks</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmailAnalytics;