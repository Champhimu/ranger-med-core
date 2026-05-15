
import React, { useState } from 'react';
import '../zordon/ZordonDashboard.css';
import './ContentManagement.css';

function ContentManagement() {
  const [activeTab, setActiveTab] = useState('articles');

  return (
    <div className="zordon-dashboard">
      <div className="overdrive-background">
        <div className="overdrive-grid"></div>
        <div className="overdrive-particles"></div>
      </div>
      <div className="zordon-header">
        <div className="header-left">
          <div className="zordon-logo" style={{fontSize: 32, color: '#ffaa00'}}>📚</div>
          <div className="header-info">
            <h1>CONTENT & KNOWLEDGE MANAGEMENT</h1>
            <p>HEALTH ARTICLES • WELLNESS TIPS • AI TRAINING • SYMPTOM KB</p>
          </div>
        </div>
        <div className="header-right">
          <div className="system-status">
            <span className="status-indicator"></span>
            <span>EDITOR MODE</span>
          </div>
        </div>
      </div>
      <div className="zordon-content">
        <div className="cm-stats">
          <div className="cm-stat-card">
            <div className="cm-stat-icon">📰</div>
            <div className="cm-stat-value">42</div>
            <div className="cm-stat-label">Health Articles</div>
          </div>
          <div className="cm-stat-card">
            <div className="cm-stat-icon">💡</div>
            <div className="cm-stat-value">18</div>
            <div className="cm-stat-label">Wellness Tips</div>
          </div>
          <div className="cm-stat-card">
            <div className="cm-stat-icon">🤖</div>
            <div className="cm-stat-value">7</div>
            <div className="cm-stat-label">AI Training Sets</div>
          </div>
          <div className="cm-stat-card">
            <div className="cm-stat-icon">🩺</div>
            <div className="cm-stat-value">5</div>
            <div className="cm-stat-label">Symptom KBs</div>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-section health-section" style={{width: '100%'}}>
            <div className="cm-section-header">
              <h2>KNOWLEDGE BASE MANAGEMENT</h2>
              <div className="cm-tabs">
                <button className={activeTab === 'articles' ? 'active' : ''} onClick={() => setActiveTab('articles')}>Health Articles</button>
                <button className={activeTab === 'wellness' ? 'active' : ''} onClick={() => setActiveTab('wellness')}>Wellness Tips</button>
                <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>AI Training Content</button>
                <button className={activeTab === 'symptom' ? 'active' : ''} onClick={() => setActiveTab('symptom')}>Symptom Checker KB</button>
              </div>
            </div>
            <div style={{marginTop: 24}}>
              {activeTab === 'articles' && (
                <div>
                  <h3>Manage Health Info Articles</h3>
                  <p>Add, update, or remove health information articles. (Table/list and editor placeholder)</p>
                  <div className="placeholder-panel">[Articles Table & Editor Here]</div>
                </div>
              )}
              {activeTab === 'wellness' && (
                <div>
                  <h3>Add/Update Wellness Tips</h3>
                  <p>Manage daily/weekly wellness tips for users. (List and editor placeholder)</p>
                  <div className="placeholder-panel">[Wellness Tips List & Editor Here]</div>
                </div>
              )}
              {activeTab === 'ai' && (
                <div>
                  <h3>Approve AI Training Content</h3>
                  <p>Review and approve AI training data and prompts. (Approval workflow placeholder)</p>
                  <div className="placeholder-panel">[AI Training Content Approval Here]</div>
                </div>
              )}
              {activeTab === 'symptom' && (
                <div>
                  <h3>Manage Symptom Checker Knowledge Base</h3>
                  <p>Update and maintain the symptom checker’s knowledge base. (KB editor placeholder)</p>
                  <div className="placeholder-panel">[Symptom KB Editor Here]</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
