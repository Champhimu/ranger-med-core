# Batch Emoji Replacement Script

## Instructions
Use your code editor's Find & Replace (Ctrl/Cmd + Shift + F) to do these replacements across all files in `client/src/components/`

**IMPORTANT:** Make sure to enable "Regex" mode and search in the components folder only!

## Replacements for DoctorDashboard.jsx

```
Find: <h2>👥 Patient Management</h2>
Replace: <h2><Icon name="users" size={20} /> Patient Management</h2>

Find: <h2>📅 Appointment Management</h2>
Replace: <h2><Icon name="calendar" size={20} /> Appointment Management</h2>

Find: <h2>📊 Reports & Analytics</h2>
Replace: <h2><Icon name="chart" size={20} /> Reports & Analytics</h2>

Find: <h2>✓ Tasks & Reminders</h2>
Replace: <h2><Icon name="check" size={20} /> Tasks & Reminders</h2>

Find: <h2>💬 Communication Center</h2>
Replace: <h2><Icon name="message" size={20} /> Communication Center</h2>

Find: <h2>💊 Prescription History</h2>
Replace: <h2><Icon name="pill" size={20} /> Prescription History</h2>

Find: <h3>💊 E-Prescription</h3>
Replace: <h3><Icon name="pill" size={18} /> E-Prescription</h3>

Find: ✓ Approve
Replace: <Icon name="check" size={14} /> Approve

Find: ✕ Close Consultation
Replace: <Icon name="x" size={14} /> Close Consultation

Find: 🔔 Notifications
Replace: <Icon name="bell" size={18} /> Notifications

Find: <span className="nav-icon">📊</span>
Replace: <span className="nav-icon"><Icon name="chart" size={20} /></span>

Find: <span className="nav-icon">👥</span>
Replace: <span className="nav-icon"><Icon name="users" size={20} /></span>

Find: <span className="nav-icon">📅</span>
Replace: <span className="nav-icon"><Icon name="calendar" size={20} /></span>

Find: <span className="nav-icon">💊</span>
Replace: <span className="nav-icon"><Icon name="pill" size={20} /></span>

Find: <span className="nav-icon">💬</span>
Replace: <span className="nav-icon"><Icon name="message" size={20} /></span>

Find: <span className="nav-icon">✓</span>
Replace: <span className="nav-icon"><Icon name="check" size={20} /></span>
```

## Replacements for RangerDashboard.jsx

First, add import at top:
```javascript
import Icon from './Icon';
```

Then replace:
```
Find: View All Symptoms →
Replace: View All Symptoms <Icon name="arrowRight" size={14} />

Find: <span className="header-icon">💊</span>
Replace: <span className="header-icon"><Icon name="pill" size={20} /></span>

Find: <div className="capsule-icon">⚡</div>
Replace: <div className="capsule-icon"><Icon name="zap" size={20} /></div>

Find: '✓ ACTIVE'
Replace: <><Icon name="check" size={12} /> ACTIVE</>

Find: Manage Capsules →
Replace: Manage Capsules <Icon name="arrowRight" size={14} />

Find: <span className="header-icon">📅</span>
Replace: <span className="header-icon"><Icon name="calendar" size={20} /></span>

Find: <span className="header-icon">💡</span>
Replace: <span className="header-icon"><Icon name="lightbulb" size={20} /></span>

Find: View All Appointments →
Replace: View All Appointments <Icon name="arrowRight" size={14} />

Find: <span>✕</span>
Replace: <span><Icon name="x" size={18} /></span>

Find: <div className="side-btn-arrow">→</div>
Replace: <div className="side-btn-arrow"><Icon name="arrowRight" size={16} /></div>

Find: <div className="side-btn-icon">📅</div>
Replace: <div className="side-btn-icon"><Icon name="calendar" size={24} /></div>

Find: <div className="side-btn-icon">💊</div>
Replace: <div className="side-btn-icon"><Icon name="pill" size={24} /></div>

Find: <div className="side-btn-icon">📊</div>
Replace: <div className="side-btn-icon"><Icon name="chart" size={24} /></div>

Find: <div className="side-btn-icon">💡</div>
Replace: <div className="side-btn-icon"><Icon name="lightbulb" size={24} /></div>
```

## Replacements for Register.jsx & Login.jsx

```
Find: '⚠️ Full Name is required!'
Replace: 'Full Name is required!'

Find: '⚠️ Full Name must be at least 3 characters!'
Replace: 'Full Name must be at least 3 characters!'

Find: '⚠️ Operator ID is required!'
Replace: 'Operator ID is required!'

Find: '⚠️ Operator ID must be at least 3 characters!'
Replace: 'Operator ID must be at least 3 characters!'

Find: '⚠️ Email is required!'
Replace: 'Email is required!'

Find: '⚠️ Please enter a valid email address!'
Replace: 'Please enter a valid email address!'

Find: '⚠️ Access Code is required!'
Replace: 'Access Code is required!'

Find: '⚠️ Access Code must be at least 6 characters!'
Replace: 'Access Code must be at least 6 characters!'

Find: '⚠️ Please confirm your Access Code!'
Replace: 'Please confirm your Access Code!'

Find: '⚠️ Access Codes do not match!'
Replace: 'Access Codes do not match!'

Find: '📅 Please select a date!'
Replace: 'Please select a date!'
```

## Replacements for WeeklyInsights.jsx

First add import:
```javascript
import Icon from './Icon';
```

Then:
```
Find: icon: '⚠️',
Replace: icon: <Icon name="alert" size={20} />,

Find: icon: '📅',
Replace: icon: <Icon name="calendar" size={20} />,

Find: icon: '💊',
Replace: icon: <Icon name="pill" size={20} />,

Find: icon: '🏥',
Replace: icon: <Icon name="hospital" size={20} />,

Find: if \(trend === 'improving'\) return '📈';
Replace: if (trend === 'improving') return <Icon name="trendingUp" size={16} />;

Find: <h3>📊 Key Metrics</h3>
Replace: <h3><Icon name="chart" size={18} /> Key Metrics</h3>

Find: \{metric\.change > 0 \? '↑' : metric\.change < 0 \? '↓' : '→'\}
Replace: {metric.change > 0 ? <Icon name="arrowUp" size={14} /> : metric.change < 0 ? <Icon name="arrowDown" size={14} /> : <Icon name="arrowRight" size={14} />}

Find: 💡 \{pred\.recommendation\}
Replace: <Icon name="lightbulb" size={14} /> {pred.recommendation}

Find: <h3>💡 AI Recommendations</h3>
Replace: <h3><Icon name="lightbulb" size={18} /> AI Recommendations</h3>
```

## Quick One-Liner Replacements (Use Carefully!)

For toast messages, just remove the emoji:
```
Find: ⚠️\s+
Replace: (empty)

Find: 📅\s+
Replace: (empty)
```

## After Replacing

1. Save all files
2. Check for any syntax errors
3. Test the app
4. Verify icons display correctly

## Files Still Need Import Statement

Add this line after other imports in each file:
```javascript
import Icon from './Icon';
```

Files needing import:
- RangerDashboard.jsx
- WeeklyInsights.jsx
- Appointments.jsx  
- Calendar.jsx
- SymptomChecker.jsx
- HealthTimeline.jsx
- Symptoms.jsx
- ZordonPage.jsx
- DoctorLogin.jsx
