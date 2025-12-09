/**
 * RangerBot - AI Health Assistant
 * Operation Overdrive Medical AI System
 * Personalized health guidance and support
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RangerBot.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorsThunk } from '../../store/doctorSlice';

function RangerBot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchDoctorsThunk());
  }, [dispatch]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Greetings, Ranger! I'm RangerBot, your AI health assistant powered by Zordon's advanced medical algorithms. How can I assist you today?",
      timestamp: new Date(),
      category: 'greeting',
      priority: 'normal',
      metadata: {
        source: 'Zordon Medical AI',
        version: 'v2.5.0',
        confidence: 100
      }
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: 'symptoms', icon: '🔬', text: 'Check Symptoms', action: 'symptoms' },
    { id: 'appointment', icon: '📅', text: 'Book Appointment', action: 'appointment' },
    { id: 'medications', icon: '💊', text: 'Medication Info', action: 'medications' },
    { id: 'wellness', icon: '💪', text: 'Wellness Tips', action: 'wellness' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Symptom-related queries
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('sick')) {
      return {
        text: "I can help you check your symptoms! Based on what you're experiencing, I recommend:\n\n" +
              "1. Use our Symptom Checker for AI-powered analysis\n" +
              "2. Log your symptoms in the Symptom Tracker\n" +
              "3. Monitor for any changes over the next 24 hours\n\n" +
              "Would you like me to open the Symptom Checker for you?",
        suggestions: ['Open Symptom Checker', 'Log Symptoms', 'Tell me more'],
        category: 'symptoms',
        priority: 'high',
        confidence: 92,
        relatedTopics: ['symptom-checker', 'health-tracking', 'doctor-consultation']
      };
    }
    
    // Appointment queries
    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor') || lowerMessage.includes('visit')) {
       // Generate dynamic doctor list
      const doctorList =
        doctors.length > 0
          ? doctors.map((d) => `• ${d.name} - ${d.specialty}`).join("\n")
          : "• No doctors available right now.";
      return {
        text: "I can help you schedule an appointment! We have the following options:\n\n" +
              doctorList +
              "\n Which type of appointment would you like to schedule?",
        suggestions: ['Schedule Now', 'View Availability', 'Emergency'],
        category: 'appointments',
        priority: 'medium',
        confidence: 95,
        relatedTopics: ['medical-staff', 'scheduling', 'availability']
      };
    }
    
    // Medication queries
    if (lowerMessage.includes('medication') || lowerMessage.includes('capsule') || lowerMessage.includes('medicine')) {
      return {
        text: "Let me help you with your medications! I can:\n\n" +
              "✓ Show your current medication schedule\n" +
              "✓ Set up dosage reminders\n" +
              "✓ Track medication history\n" +
              "✓ Alert you about refills\n\n" +
              "What would you like to know about your medications?",
        suggestions: ['View Medications', 'Set Reminder', 'Refill Status'],
        category: 'medications',
        priority: 'high',
        confidence: 98,
        relatedTopics: ['capsules', 'dosage', 'reminders', 'refills']
      };
    }
    
    // Wellness and health tips
    if (lowerMessage.includes('wellness') || lowerMessage.includes('health') || lowerMessage.includes('tip')) {
      return {
        text: "Here are some personalized wellness recommendations for you:\n\n" +
              "💧 Hydration: Aim for 8 glasses of water daily, especially after morphing\n" +
              "😴 Rest: Rangers need 7-9 hours of quality sleep\n" +
              "🏃 Exercise: Balance combat training with recovery\n" +
              "🧘 Mental Health: Practice meditation to manage mission stress\n\n" +
              "Would you like more specific advice on any of these areas?",
        suggestions: ['Sleep Tips', 'Nutrition Guide', 'Stress Management'],
        category: 'wellness',
        priority: 'normal',
        confidence: 90,
        relatedTopics: ['hydration', 'sleep', 'exercise', 'mental-health']
      };
    }
    
    if (lowerMessage.includes("availability") || lowerMessage.includes("available")) {

      if (!doctors || doctors.length === 0) {
        return {
          text: "No doctor availability data found.",
          suggestions: ["Book Appointment", "View Medications"],
          category: "appointments",
          priority: "medium"
        };
      }

      const availabilityList = doctors
        .map((doc) => {
          const schedule = doc.weeklyAvailability
            .map((slot) => `   • ${slot.day}: ${slot.startTime} - ${slot.endTime}`)
            .join("\n");

          return `👨‍⚕️ *${doc.name}* (${doc.specialty})\n${schedule}\n`;
        })
        .join("\n");

      return {
        text:
          "Here is the weekly availability of our doctors:\n\n" +
          availabilityList +
          "\nWould you like to book an appointment?",
        suggestions: ["Book Appointment", "Schedule Now", "Back"],
        category: "appointments",
        priority: "medium"
      };
    }

    // Default response
    return {
      text: "I'm here to help with your health needs! I can assist you with:\n\n" +
            "• Analyzing symptoms and suggesting conditions\n" +
            "• Scheduling medical appointments\n" +
            "• Managing your medications\n" +
            "• Providing personalized wellness guidance\n" +
            "• Answering health-related questions\n\n" +
            "What can I help you with today?",
      suggestions: ['Check Symptoms', 'Book Appointment', 'Medication Help', 'Wellness Tips'],
      category: 'general',
      priority: 'normal',
      confidence: 85,
      relatedTopics: ['symptoms', 'appointments', 'medications', 'wellness']
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message with detailed metadata
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date(),
      category: 'query',
      priority: 'normal',
      metadata: {
        characterCount: inputText.length,
        wordCount: inputText.trim().split(/\s+/).length,
        containsEmergency: /emergency|urgent|critical|help/i.test(inputText)
      }
    };
    
    setMessages(prev => [...prev, userMessage].sort((a, b) => a.timestamp - b.timestamp));
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const response = generateBotResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: new Date(),
        category: response.category || 'response',
        priority: response.priority || 'normal',
        metadata: {
          source: 'Zordon Medical AI',
          confidence: response.confidence || 95,
          responseTime: '1.2s',
          relatedTopics: response.relatedTopics || []
        }
      };
      
      setMessages(prev => [...prev, botMessage].sort((a, b) => a.timestamp - b.timestamp));
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch(action) {
      case 'symptoms':
        message = 'I need help checking my symptoms';
        break;
      case 'appointment':
        message = 'I want to book an appointment';
        break;
      case 'medications':
        message = 'Tell me about my medications';
        break;
      case 'wellness':
        message = 'Give me wellness tips';
        break;
      default:
        message = 'Help me';
    }
    setInputText(message);
  };

  const handleSuggestionClick = (suggestion) => {

    if (suggestion === "Open Symptom Checker") {
      navigate("/symptom-checker");
    }else if(suggestion === "Log Symptoms") {
      navigate("/symptoms");
    }else if(suggestion === "Book Appointment" || suggestion === "Schedule Now") {
      navigate("/appointments")
    }else if(suggestion === "View Medications") {
      navigate("/capsules")
    }

    setInputText(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="rangerbot-page">
      {/* Background */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="rangerbot-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>🤖 RANGERBOT AI ASSISTANT</h1>
          <p>OPERATION OVERDRIVE - MEDICAL AI SYSTEM</p>
        </div>
        <div className="bot-status">
          <span className="status-indicator online"></span>
          <span>AI Online</span>
        </div>
      </div>

      <div className="rangerbot-container">
        {/* Chat Area */}
        <div className="chat-section">
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="message-text">{message.text}</div>
                    {message.metadata && (
                      <div className="message-metadata">
                        {message.type === 'bot' && (
                          <>
                            <span className="metadata-item" title="AI Confidence">
                              📊 Confidence: {message.metadata.confidence}%
                            </span>
                            <span className="metadata-item" title="Response Source">
                              🔮 {message.metadata.source}
                            </span>
                            {message.metadata.responseTime && (
                              <span className="metadata-item" title="Response Time">
                                ⚡ {message.metadata.responseTime}
                              </span>
                            )}
                          </>
                        )}
                        {message.type === 'user' && (
                          <>
                            <span className="metadata-item" title="Word Count">
                              📝 {message.metadata.wordCount} words
                            </span>
                            {message.metadata.containsEmergency && (
                              <span className="metadata-item urgent" title="Emergency Detected">
                                🚨 Priority Query
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div className="message-footer">
                      <div className="message-time">
                        {message.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {message.category && (
                        <span className={`message-category ${message.category}`}>
                          {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                        </span>
                      )}
                      {message.priority && message.priority !== 'normal' && (
                        <span className={`message-priority ${message.priority}`}>
                          {message.priority === 'high' ? '⚡ High' : message.priority === 'medium' ? '📌 Medium' : '🔔 Critical'}
                        </span>
                      )}
                    </div>
                  </div>
                  {message.suggestions && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-section">
            <div className="quick-actions">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                  title={action.text}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-text">{action.text}</span>
                </button>
              ))}
            </div>
            <div className="input-container">
              <textarea
                className="message-input"
                placeholder="Ask me anything about your health..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
              />
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <div className="panel-section">
            <h3>🎯 What I Can Do</h3>
            <ul className="capabilities-list">
              <li>
                <span className="capability-icon">🔬</span>
                <span>Analyze symptoms and suggest conditions</span>
              </li>
              <li>
                <span className="capability-icon">📅</span>
                <span>Help schedule appointments</span>
              </li>
              <li>
                <span className="capability-icon">💊</span>
                <span>Manage medication schedules</span>
              </li>
              <li>
                <span className="capability-icon">💪</span>
                <span>Provide wellness recommendations</span>
              </li>
              <li>
                <span className="capability-icon">📊</span>
                <span>Track health progress</span>
              </li>
            </ul>
          </div>

          <div className="panel-section">
            <h3>💡 Quick Tips</h3>
            <div className="tips-list">
              <div className="tip-card">
                <span className="tip-icon">💧</span>
                <p>Stay hydrated during missions</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">😴</span>
                <p>Get 7-9 hours of sleep</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🏃</span>
                <p>Balance training & recovery</p>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3>⚠️ Emergency</h3>
            <button 
              className="emergency-btn"
              onClick={() => navigate('/appointments')}
            >
              🚨 Get Immediate Help
            </button>
          </div>
        </div>
      </div>

      {/* Cockpit Frame */}
      <div className="cockpit-frame"></div>
    </div>
  );
}

export default RangerBot;
