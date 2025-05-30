import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmailComposer from './components/EmailComposer';
import PendingEmails from './components/PendingEmails';
import Templates from './components/Templates';
import EmailAnalytics from './components/EmailAnalytics';
import PricingPage from './components/PricingPage';
import './App.css';

function App() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    return (
        <Router>
            <div className="App">
                <header className="header">
                    <h1>📧 EmailPro</h1>
                    <p>The email tool that prevents regret</p>
                    
                    <nav className="nav">
                        <Link to="/">Compose</Link>
                        <Link to="/pending">Pending</Link>
                        <Link to="/analytics">Analytics</Link>
                        <Link to="/pricing">Pricing</Link>
                    </nav>
                </header>
                
                <Routes>
                    <Route path="/" element={
                        <div>
                            <Templates onSelectTemplate={setSelectedTemplate} />
                            <EmailComposer selectedTemplate={selectedTemplate} />
                        </div>
                    } />
                    <Route path="/pending" element={<PendingEmails />} />
                    <Route path="/analytics" element={<EmailAnalytics />} />
                    <Route path="/pricing" element={<PricingPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;