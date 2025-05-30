import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Templates = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        subject: '',
        body: '',
        category: 'general'
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('/api/templates');
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates');
        }
    };

    const createTemplate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/templates', newTemplate);
            setNewTemplate({ name: '', subject: '', body: '', category: 'general' });
            setShowCreate(false);
            fetchTemplates();
        } catch (error) {
            alert('Error creating template');
        }
    };

    // RENAMED: useTemplate -> selectTemplate (fixes the React Hook error)
    const selectTemplate = async (template) => {
        try {
            await axios.post(`/api/templates/${template._id}/use`);
            onSelectTemplate(template);
        } catch (error) {
            console.error('Error using template');
        }
    };

    return (
        <div className="templates">
            <div className="templates-header">
                <h3>📝 Email Templates</h3>
                <button 
                    onClick={() => setShowCreate(!showCreate)}
                    className="create-template-btn"
                >
                    + Create Template
                </button>
            </div>

            {showCreate && (
                <form onSubmit={createTemplate} className="create-template-form">
                    <input
                        type="text"
                        placeholder="Template name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Email body"
                        value={newTemplate.body}
                        onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                        rows="5"
                        required
                    />
                    <button type="submit" className="save-template-btn">Save Template</button>
                </form>
            )}

            <div className="templates-grid">
                {templates.map(template => (
                    <div key={template._id} className="template-card">
                        <h4>{template.name}</h4>
                        <p>{template.subject}</p>
                        <small>Used {template.usageCount} times</small>
                        <button 
                            onClick={() => selectTemplate(template)}
                            className="use-template-btn"
                        >
                            Use Template
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;