import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../shared/Icon';
import './Capsules.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCapsulesThunk,
  addCapsuleThunk,
  markDoseTakenThunk,
  fetchRecommendationsThunk,
  fetchmedicationPatterns,
  fetchCapsuleHistoryThunk
} from '../../store/capsulesSlice';

const Capsules = ({ ranger = 'red' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { capsules, recommendations, pattern, history, loading, error } = useSelector((state) => state.capsules);

  const [activeTab, setActiveTab] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  // const [capsuleDoses, setCapsuleDoses] = useState({}); // Track which doses are taken
  const [snoozedCapsules, setSnoozedCapsules] = useState({}); // Track snoozed capsules
  const medications = [
    {
      id: 1,
      name: "Morphinium-12",
      dosage: "500mg",
      frequency: "Twice Daily",
      timesPerDay: 2,
      schedule: ["08:00", "20:00"],
      prescribedBy: "Dr. Hartley",
      condition: "Core Energy Stabilization",
      stock: 45,
      refillDate: "2025-02-15",
      lastTaken: "2025-01-25T08:00",
      status: "active", // active | low-stock | missed
      sideEffects: "May cause mild drowsiness",
      instructions: "Take with food",
      alert: { reminder: true, notifyBefore: 15 }, // minutes before
    },
    {
      id: 2,
      name: "Neural-Sync Plus",
      dosage: "250mg",
      frequency: "Thrice Daily",
      timesPerDay: 3,
      schedule: ["09:00", "15:00", "21:00"],
      prescribedBy: "Dr. Spencer",
      condition: "Enhanced Cognitive Function",
      stock: 12,
      refillDate: "2025-01-30",
      lastTaken: "2025-01-25T09:00",
      status: "low-stock",
      sideEffects: "None reported",
      instructions: "Take in the morning",
      alert: { reminder: true, notifyBefore: 10 },
    },
    {
      id: 3,
      name: "Ranger Vitamins Complex",
      dosage: "1 Tablet",
      frequency: "Once Daily",
      timesPerDay: 1,
      schedule: ["07:00"],
      prescribedBy: "Dr. Hartley",
      condition: "General Health Maintenance",
      stock: 60,
      refillDate: "2025-03-01",
      lastTaken: "2025-01-25T07:00",
      status: "active",
      sideEffects: "None",
      instructions: "Take before breakfast",
      alert: { reminder: true, notifyBefore: 5 },
    },
  ];



  // const [medicationHistory] = useState([
  //   {
  //     id: 101,
  //     name: 'Bio-Sync Capsules',
  //     dosage: '100mg',
  //     period: '2024-06 to 2024-12',
  //     reason: 'Completed treatment cycle',
  //     prescribedBy: 'Dr. Hartley'
  //   },
  //   {
  //     id: 102,
  //     name: 'Power Stabilizer-X',
  //     dosage: '300mg',
  //     period: '2024-03 to 2024-08',
  //     reason: 'Switched to newer formula',
  //     prescribedBy: 'Dr. Spencer'
  //   }
  // ]);

  // const [reminders] = useState([
  //   {
  //     id: 1,
  //     medication: 'Morphinium-12',
  //     time: '08:00',
  //     status: 'pending',
  //     date: '2025-01-26'
  //   },
  //   {
  //     id: 2,
  //     medication: 'Neural-Sync Plus',
  //     time: '09:00',
  //     status: 'pending',
  //     date: '2025-01-26'
  //   },
  //   {
  //     id: 3,
  //     medication: 'Ranger Vitamins Complex',
  //     time: '07:00',
  //     status: 'upcoming',
  //     date: '2025-01-26'
  //   }
  // ]);

  // Handler for taking capsule dose

  const handleTakeDose = async (doseId, medName, doseTime) => {
    try {
      // Call API
      await dispatch(markDoseTakenThunk(doseId)).unwrap();

      // If success → toast success
      toast.success(`Dose taken at ${doseTime} for ${medName}!`, {
        icon: '💊',
        duration: 2000,
      });

    } catch (error) {
      // If API fails → toast error
      toast.error(`Failed to mark dose as taken. Please try again.`, {
        icon: '⚠️',
        duration: 2500,
      });
    }
    // Check for low stock warning
    // const newStock = medication.stock - 1;
    // if (newStock <= 10 && newStock > 0) {
    //   setTimeout(() => {
    //     toast.warning(`⚠️ Low stock alert for ${medication.name}! Only ${newStock} left.`, {
    //       duration: 3000,
    //       icon: '📦',
    //     });
    //   }, 500);
    // }
  };

  // Handler for snoozing capsule
  const handleSnoozeCapsule = (medId) => {
    setSnoozedCapsules(prev => ({
      ...prev,
      [medId]: true
    }));

    const medication = medications?.find(med => med.id === medId);
    toast.success(`🔕 ${medication?.name} snoozed for 10 minutes`, {
      duration: 2000,
    });

    // Auto-unsnooze after 10 minutes (600000 milliseconds)
    setTimeout(() => {
      setSnoozedCapsules(prev => ({
        ...prev,
        [medId]: false
      }));
      toast.info(`🔔 ${medication?.name} reminder is back!`, {
        duration: 2000,
      });
    }, 600000); // 10 minutes
  };

  // Check if all doses are taken for a medication
  const allDosesTaken = (medId) => {
    const med = capsules?.find(c => c?._id === medId);
    if (!med) return false;

    // If todaysDoses missing → not taken
    if (!Array.isArray(med.todaysDoses)) return false;

    return med.todaysDoses.length > 0 &&
      med.todaysDoses.every(dose => dose?.status === "taken");
  };

  const mergedDoses = Array.isArray(capsules)
    ? capsules.flatMap(cap =>
      Array.isArray(cap?.todaysDoses)
        ? cap.todaysDoses.map(dose => ({
          ...dose,
          capsuleName: cap?.name || "",
          doseUnit: cap?.doseUnit || "",
          instructions: cap?.instructions || ""
        }))
        : []
    )
    : [];


  // Smart Reminders: Track dose history and patterns
  const [doseHistory] = useState([
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:05', date: '2025-01-24' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:12', date: '2025-01-23' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '07:58', date: '2025-01-22' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:20', date: '2025-01-21' },
    { medication: 'Neural-Sync Plus', scheduledTime: '09:00', actualTime: '09:15', date: '2025-01-24' },
    { medication: 'Neural-Sync Plus', scheduledTime: '09:00', actualTime: '09:10', date: '2025-01-23' },
    { medication: 'Ranger Vitamins Complex', scheduledTime: '07:00', actualTime: '07:05', date: '2025-01-24' },
    { medication: 'Ranger Vitamins Complex', scheduledTime: '07:00', actualTime: '07:02', date: '2025-01-23' }
  ]);

  // Calculate smart reminder timing based on user patterns
  const calculateSmartReminderTime = (medication) => {
    const medHistory = doseHistory.filter(d => d.medication === medication);

    if (medHistory.length < 3) {
      // Not enough data, use scheduled time
      const med = medications?.find(m => m.name === medication);
      return med?.schedule[0] || '08:00';
    }

    // Calculate average actual taking time
    const totalMinutes = medHistory.reduce((sum, dose) => {
      const [hours, mins] = dose.actualTime.split(':').map(Number);
      return sum + (hours * 60 + mins);
    }, 0);

    const avgMinutes = Math.round(totalMinutes / medHistory.length);
    // const avgHours = Math.floor(avgMinutes / 60);
    // const avgMins = avgMinutes % 60;

    // Suggest reminder 10 minutes before average time
    const reminderMinutes = avgMinutes - 10;
    const reminderHours = Math.floor(reminderMinutes / 60);
    const reminderMins = reminderMinutes % 60;

    return `${String(reminderHours).padStart(2, '0')}:${String(reminderMins).padStart(2, '0')}`;
  };

  // Analyze adherence patterns
  // const analyzeAdherencePattern = (medication) => {
  //   const medHistory = doseHistory.filter(d => d.medication === medication);

  //   if (medHistory.length < 3) {
  //     return { pattern: 'insufficient-data', avgDelay: 0, consistency: 'unknown' };
  //   }

  //   const delays = medHistory.map(dose => {
  //     const [schedHours, schedMins] = dose.scheduledTime.split(':').map(Number);
  //     const [actualHours, actualMins] = dose.actualTime.split(':').map(Number);
  //     const scheduledMinutes = schedHours * 60 + schedMins;
  //     const actualMinutes = actualHours * 60 + actualMins;
  //     return actualMinutes - scheduledMinutes;
  //   });

  //   const avgDelay = Math.round(delays.reduce((sum, d) => sum + d, 0) / delays.length);
  //   const variance = delays.reduce((sum, d) => sum + Math.pow(d - avgDelay, 2), 0) / delays.length;
  //   const stdDev = Math.sqrt(variance);

  //   let consistency = 'excellent';
  //   if (stdDev > 15) consistency = 'poor';
  //   else if (stdDev > 10) consistency = 'fair';
  //   else if (stdDev > 5) consistency = 'good';

  //   let pattern = 'on-time';
  //   if (avgDelay > 10) pattern = 'consistently-late';
  //   else if (avgDelay < -10) pattern = 'consistently-early';

  //   return { pattern, avgDelay, consistency, stdDev: Math.round(stdDev) };
  // };

  const analyzeAdherencePattern = (capsule) => {
    if (!capsule || !capsule.todaysDoses) {
      return { pattern: 'insufficient-data', avgDelay: 0, consistency: 'unknown' };
    }

    // Filter only taken doses
    const takenDoses = capsule.todaysDoses.filter(d => d.status === "taken");

    if (takenDoses.length < 2) {
      return { pattern: 'insufficient-data', avgDelay: 0, consistency: 'unknown' };
    }

    // Convert scheduled + actual time to minutes
    const delays = takenDoses.map(dose => {
      const [schedH, schedM] = dose.time.split(":").map(Number);

      // actualTime is ISO: "2025-12-07T08:03:14.693Z"
      const actual = new Date(dose.actualTime);
      const actualH = actual.getHours();
      const actualM = actual.getMinutes();

      const scheduledMinutes = schedH * 60 + schedM;
      const actualMinutes = actualH * 60 + actualM;

      return actualMinutes - scheduledMinutes; // delay
    });

    const avgDelay = Math.round(delays.reduce((a, b) => a + b, 0) / delays.length);

    // Standard deviation = consistency
    const variance = delays.reduce((sum, d) => sum + Math.pow(d - avgDelay, 2), 0) / delays.length;
    const stdDev = Math.sqrt(variance);

    let consistency = 'excellent';
    if (stdDev > 15) consistency = 'poor';
    else if (stdDev > 10) consistency = 'fair';
    else if (stdDev > 5) consistency = 'good';

    let pattern = 'on-time';
    if (avgDelay > 10) pattern = 'consistently-late';
    else if (avgDelay < -10) pattern = 'consistently-early';

    return {
      pattern,
      avgDelay,
      consistency,
      stdDev: Math.round(stdDev)
    };
  };


  // Generate smart recommendations
  const getSmartRecommendations = () => {
    const recommendations = [];

    medications?.forEach(med => {
      const analysis = analyzeAdherencePattern(med?.name);
      const smartTime = calculateSmartReminderTime(med?.name);
      const scheduledTime = med?.schedule;

      if (analysis?.pattern === 'consistently-late' && analysis?.avgDelay > 15) {
        recommendations.push({
          medication: med.name,
          type: 'timing-adjustment',
          priority: 'high',
          message: `You typically take ${med.name} ${analysis.avgDelay} minutes late. Consider setting reminder for ${smartTime} instead of ${scheduledTime}.`,
          suggestedTime: smartTime,
          confidence: 85
        });
      }

      if (analysis?.consistency === 'poor') {
        recommendations.push({
          medication: med.name,
          type: 'consistency-alert',
          priority: 'medium',
          message: `Your ${med.name} timing varies by ±${analysis.stdDev} minutes. Try setting multiple reminders to improve consistency.`,
          suggestedAction: 'Enable snooze reminders every 5 minutes',
          confidence: 78
        });
      }

      if (med?.status === 'low-stock') {
        const daysLeft = med?.frequency === 'Once Daily' ? med.stock : med.stock / 2;
        recommendations.push({
          medication: med.name,
          type: 'refill-alert',
          priority: 'high',
          message: `Only ${daysLeft} days of ${med.name} remaining. Order refill soon.`,
          suggestedAction: `Contact ${med.prescribedBy} before ${med.refillDate}`,
          confidence: 100
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const smartRecommendations = getSmartRecommendations();

  const [newMedication, setNewMedication] = useState({
    name: '',
    doseAmount: '',
    doseUnit: '',
    frequency: 'Once Daily',
    time: '',
    stock: '',
    prescribedBy: '',
    condition: '',
    instructions: '',
    sideEffects: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleAddMedication = async () => {
    // Validation
    if (!newMedication.name.trim()) {
      toast.error('Medication name is required!');
      return;
    }

    if (!newMedication.doseAmount.trim()) {
      toast.error('Dosage is required!');
      return;
    }

    if (!newMedication.time.trim()) {
      toast.error('Time schedule is required!');
      return;
    }

    if (!newMedication.stock || parseInt(newMedication.stock) <= 0) {
      toast.error('Stock quantity must be greater than 0!');
      return;
    }

    if (!newMedication.prescribedBy.trim()) {
      toast.error('Prescribing doctor is required!');
      return;
    }

    if (!newMedication.condition.trim()) {
      toast.error('Medical condition is required!');
      return;
    }

    if (!newMedication.startDate.trim()) {
      toast.error('Start Date is required!');
      return;
    }

    if (!newMedication.endDate.trim() || !(newMedication.endDate >= newMedication.startDate)) {
      if (!(newMedication.endDate >= newMedication.startDate)) {
        toast.error('End Date should be equal or greater than Start Date');
        return;
      }
      toast.error('End Date is required!');
      return;
    }

    try {
      await dispatch(addCapsuleThunk({
        ...newMedication,
        time: newMedication.time.split(',').map(t => t.trim()),
        stock: parseInt(newMedication.stock)
      })).unwrap();

      setShowAddForm(false);
      toast.success(`${newMedication.name} added successfully!`, {
        icon: '💊',
        style: {
          border: '2px solid #00ff00',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
        }
      });

      // Reset form
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'Once Daily',
        time: '',
        stock: '',
        prescribedBy: '',
        condition: '',
        instructions: '',
        sideEffects: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });

      dispatch(fetchCapsulesThunk);
      dispatch(fetchRecommendationsThunk());
      dispatch(fetchmedicationPatterns());
      dispatch(fetchCapsuleHistoryThunk());
    } catch (err) {
      toast.error('Failed to add medication');
    }
  };

  // const calculateRefillDate = (stock, frequency, startDate = new Date()) => {
  //   console.log();
  //   const pillsPerDay = frequencyMap[frequency];

  //   if (!pillsPerDay || pillsPerDay <= 0) return null; // cannot calculate

  //   const daysLeft = stock / pillsPerDay;

  //   const refillDate = new Date(startDate);
  //   refillDate.setDate(refillDate.getDate() + Math.floor(daysLeft));

  //   return refillDate.toISOString().split('T')[0];
  // };

  // const handleMarkTaken = (medId) => {
  //   const medication = medications.find(med => med.id === medId);
  //   if (!medication) return;

  //   if (medication.stock <= 0) {
  //     toast.error('⚠️ No stock available! Please refill medication.', {
  //       icon: '📦',
  //     });
  //     return;
  //   }

  //   setMedications(medications.map(med =>
  //     med.id === medId
  //       ? { ...med, lastTaken: new Date().toISOString().slice(0, 16).replace('T', ' '), stock: med.stock - 1 }
  //       : med
  //   ));

  //   toast.success(`✅ ${medication.name} marked as taken!`, {
  //     icon: '💊',
  //     duration: 2000,
  //   });

  //   // Check for low stock warning
  //   const newStock = medication.stock - 1;
  //   if (newStock <= 10 && newStock > 0) {
  //     setTimeout(() => {
  //       toast.warning(`⚠️ Low stock alert for ${medication.name}! Only ${newStock} left.`, {
  //         duration: 3000,
  //         icon: '📦',
  //       });
  //     }, 500);
  //   }
  // };


  const getStockStatus = (stock, frequency) => {
    const daysLeft = frequency === 'Once Daily' ? stock : frequency === 'Twice Daily' ? stock / 2 : stock / 3;
    if (daysLeft <= 7) return 'critical';
    if (daysLeft <= 14) return 'low';
    return 'good';
  };

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[ranger] || rangerColors.red;

  useEffect(() => {
    dispatch(fetchCapsulesThunk());
    dispatch(fetchRecommendationsThunk());
    dispatch(fetchmedicationPatterns());
    dispatch(fetchCapsuleHistoryThunk());

    console.log("CALLED");
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const frequencyMap = {
    "Once Daily": 1,
    "Twice Daily": 2,
    "Three Times Daily": 3,
    "Every 4 Hours": 6,   // 24 / 4 = 6 times/day
    "Every 6 Hours": 4,   // 24 / 6 = 4 times/day
    "Every 8 Hours": 3,   // 24 / 8 = 3 times/day
    "Once Weekly": 1 / 7,   // 1 pill per week → 0.142857 per day
    "Twice Weekly": 2 / 7,  // 2 pills per week → 0.2857 per day
    "Every Other Day": 0.5,
    "Once Monthly": 1 / 30,
    "Twice Monthly": 2 / 30,
    "As Needed (PRN)": 0,   // cannot calculate → return null or default
    "Before Meals": 3,       // assuming 3 meals/day
    "After Meals": 3,        // assuming 3 meals/day
    "Before Bed": 1
  };

  return (
    <div className="capsules-page">
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="capsules-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← DASHBOARD
        </button>
        <div className="header-content">
          <h1>CAPSULES MANAGEMENT</h1>
          <p>MEDICATION TRACKING SYSTEM</p>
        </div>
        <button
          className="add-med-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ borderColor: currentColor, color: currentColor }}
        >
          {showAddForm ? '✕ CANCEL' : '+ ADD MEDICATION'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-medication-modal">
          <div className="modal-content">
            <h2>Add New Medication</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  placeholder="e.g., Morphinium-12"
                />
              </div>
              <div className="form-group dosage-row">
                <label>Dosage per Intake *</label>

                <div className="dosage-flex">
                  <input
                    type="number"
                    placeholder="Amount (e.g. 200)"
                    value={newMedication.doseAmount}
                    onChange={(e) =>
                      setNewMedication({ ...newMedication, doseAmount: e.target.value })
                    }
                  />

                  <select
                    value={newMedication.doseUnit}
                    onChange={(e) =>
                      setNewMedication({ ...newMedication, doseUnit: e.target.value })
                    }
                  >
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="ml">mL</option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="drop">Drop</option>
                    <option value="spray">Spray</option>
                    <option value="injection">Injection</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={newMedication.frequency}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, frequency: e.target.value })
                  }
                >
                  <option value="">Select Frequency</option>
                  {Object.keys(frequencyMap).map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time(s) (comma-separated)</label>
                <input
                  type="text"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  placeholder="e.g., 08:00, 20:00"
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={newMedication.stock}
                  onChange={(e) => setNewMedication({ ...newMedication, stock: e.target.value })}
                  placeholder="Number of pills"
                />
              </div>
              <div className="form-group">
                <label>Prescribed By</label>
                <input
                  type="text"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                  placeholder="Doctor name"
                />
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  required
                />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Condition/Purpose</label>
                <input
                  type="text"
                  value={newMedication.condition}
                  onChange={(e) => setNewMedication({ ...newMedication, condition: e.target.value })}
                  placeholder="What is this medication for?"
                />
              </div>
              <div className="form-group full-width">
                <label>Instructions</label>
                <textarea
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                  placeholder="Special instructions..."
                  rows="2"
                />
              </div>
              <div className="form-group full-width">
                <label>Side Effects</label>
                <textarea
                  value={newMedication.sideEffects}
                  onChange={(e) => setNewMedication({ ...newMedication, sideEffects: e.target.value })}
                  placeholder="Known side effects..."
                  rows="2"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleAddMedication}
                style={{ background: currentColor }}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="capsules-container">
        <div className="main-content">
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
              style={activeTab === 'current' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              Current Medications
            </button>
            <button
              className={`tab ${activeTab === 'reminders' ? 'active' : ''}`}
              onClick={() => setActiveTab('reminders')}
              style={activeTab === 'reminders' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              Reminders
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              style={activeTab === 'history' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              History
            </button>
          </div>

          {activeTab === 'current' && (
            <div className="medications-grid">
              {capsules
                .filter(med => !allDosesTaken(med._id))   // <-- hide completed medications
                .map(med => {
                  const stockStatus = getStockStatus(med.stock, med.frequency);
                  return (
                    <div key={med.id} className="medication-card">
                      <div className="med-header">
                        <div className="pill-icon" style={{ background: currentColor }}>💊</div>
                        <div className="med-title">
                          <h3>{med.name}</h3>
                          <span className="dosage">{`${med.doseAmount} ${med.doseUnit}`}</span>
                        </div>
                        <div className={`stock-badge ${stockStatus}`}>
                          {med.stock} pills
                        </div>
                      </div>
                      <div className="med-details">
                        <div className="detail-row">
                          <span className="label">Frequency:</span>
                          <span className="value">{med.frequency}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Schedule:</span>
                          {/* <span className="value">{med.time.join(', ')}</span> */}
                          <span className="value">{med.timeSlots?.join(", ")}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Prescribed by:</span>
                          <span className="value">{med.prescribedBy}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Condition:</span>
                          <span className="value">{med.condition}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Refill by:</span>
                          <span className="value">{med.endDate?.split("T")[0]}</span>
                          {/* <span className="value">{"-"}</span> */}
                        </div>
                        <div className="detail-row">
                          <span className="label">Last taken:</span>
                          <span className="value">{med.lastTaken?.replace("T", " ").split(".")[0] || '-'}</span>
                        </div>
                      </div>
                      <div className="med-notes">
                        <p><strong>Instructions:</strong> {med.instructions}</p>
                        <p><strong>Side Effects:</strong> {med.sideEffects}</p>
                      </div>

                      {/* Dose tracking and snooze controls */}
                      <div className="capsule-controls">
                        {(() => {
                          const medId = med?._id;   // Always use _id
                          const doses = med?.todaysDoses || [];
                          const isSnoozed = snoozedCapsules?.[medId] || false;
                          const areAllTaken = allDosesTaken(medId);

                          // If med not loaded yet → show nothing
                          if (!med || !Array.isArray(doses)) return null;

                          return (
                            <>
                              {/* MULTIPLE DOSES (2 or more) */}
                              {doses.length >= 2 && !isSnoozed && !areAllTaken && (
                                <div className="dose-buttons">
                                  {doses.map((dose) => (
                                    <button
                                      key={dose._id}
                                      className={`dose-btn ${dose.status === "taken" ? "taken" : ""}`}
                                      onClick={() => handleTakeDose(dose._id, med.name, dose.time)}
                                      disabled={dose.status === "taken"}
                                      style={
                                        dose.status !== "taken"
                                          ? { borderColor: currentColor, color: currentColor }
                                          : {}
                                      }
                                    >
                                      <Icon
                                        name={dose.status === "taken" ? "check" : "pill"}
                                        size={14}
                                      />
                                      Dose: {dose.time}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* SINGLE DAILY DOSE */}
                              {doses.length === 1 && !isSnoozed && !areAllTaken && (
                                doses.map((dose) => (
                                  <button
                                    key={dose._id}
                                    className="mark-taken-btn"
                                    onClick={() => handleTakeDose(dose._id, med.name, dose.time)}
                                    style={{ background: currentColor }}
                                  >
                                    <Icon name="check" size={16} />
                                    Mark as Taken
                                  </button>
                                ))
                              )}

                              {/* SNOOZE BUTTON */}
                              {!areAllTaken && (
                                <button
                                  className="snooze-btn"
                                  onClick={() => handleSnoozeCapsule(medId)}
                                  disabled={isSnoozed}
                                  style={!isSnoozed ? { borderColor: "#ffaa00", color: "#ffaa00" } : {}}
                                >
                                  <Icon name="bell" size={14} color={isSnoozed ? "#999" : "#ffaa00"} />
                                  {isSnoozed ? "Snoozed (10min)" : "Snooze"}
                                </button>
                              )}

                              {/* ALL DOSES COMPLETE */}
                              {areAllTaken && (
                                <div className="all-doses-taken">
                                  <Icon name="check" size={20} color="#00d26a" />
                                  <span>All doses taken today!</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                    </div>
                  );
                })}
            </div>
          )}


          {activeTab === 'reminders' && (
            <div className="reminders-section">
              <div className="reminders-header">
                <h2>Today's Medication Schedule</h2>
                <p>Stay on track with your health routine</p>
              </div>
              <div className="reminders-list">
                {mergedDoses
                  .filter(med => med.status !== 'taken')
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(reminder => (
                    <div key={reminder._id} className={`reminder-card ${reminder.status === "scheduled" ? "upcoming" : reminder.status}`}>
                      <div className="time-badge" style={{ borderColor: currentColor }}>
                        {reminder.time}
                      </div>
                      <div className="reminder-content">
                        <h4>{reminder.capsuleName}</h4>
                        {/* <p>{capsules.find(m => m.name === reminder.capsuleName)?.doseAmount}</p> */}
                        {capsules.map(cap => (
                          reminder.capsuleId === cap._id && (
                            <p key={cap._id}>
                              {cap.doseAmount} {cap.doseUnit}
                            </p>
                          )
                        ))}
                      </div>
                      <div className={`status-indicator ${reminder.status === "scheduled" ? "upcoming" : reminder.status}`}>
                        {reminder.status === 'pending' ? '⏰ Pending' : '🕐 Upcoming'}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Smart Recommendations Section */}
              {smartRecommendations.length > 0 && (
                <div className="smart-recommendations">
                  <div className="recommendations-header">
                    <h3>🤖 AI-Powered Smart Insights</h3>
                    <p>Personalized recommendations based on your medication patterns</p>
                  </div>
                  <div className="recommendations-list">
                    {console.log("recommendation", recommendations)}
                    {recommendations?.map((rec, idx) => (
                      <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                        <div className="rec-header">
                          <div className="rec-type">
                            {rec.type === 'timing-adjustment' && '⏰'}
                            {rec.type === 'consistency-alert' && '📊'}
                            {rec.type === 'refill-alert' && '💊'}
                            <span className="rec-label">
                              {rec.type.replace(/-/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className={`rec-priority ${rec.priority}`} style={{ marginTop: "10px", width: "fit-content" }}>
                            {rec.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="rec-content">
                          <h4>{rec.medication}</h4>
                          <p className="rec-message">{rec.message}</p>
                          {rec.suggestedTime && (
                            <div className="rec-suggestion">
                              <strong>Suggested Time:</strong> {rec.suggestedTime}
                            </div>
                          )}
                          {rec.suggestedAction && (
                            <div className="rec-suggestion">
                              <strong>Suggested Action:</strong> {rec.suggestedAction}
                            </div>
                          )}
                        </div>
                        <div className="rec-footer">
                          <div className="confidence-indicator">
                            <span className="confidence-label">AI Confidence:</span>
                            <div className="confidence-bar">
                              <div
                                className="confidence-fill"
                                style={{
                                  width: `${rec.confidence}%`,
                                  background: currentColor
                                }}
                              ></div>
                            </div>
                            <span className="confidence-value">{rec.confidence}%</span>
                          </div>
                          <button
                            className="apply-recommendation-btn"
                            style={{ borderColor: currentColor, color: currentColor }}
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adherence Analytics */}
                  <div className="adherence-analytics">
                    <h3>📈 Your Medication Patterns</h3>
                    <div className="analytics-grid">
                      {console.log("PATTERN", pattern)}
                      {pattern.map(med => {
                        // const analysis = analyzeAdherencePattern(med);
                        return (
                          <div key={med.capsuleId} className="analytics-card">
                            <h4>{med.name}</h4>
                            <div className="analytics-stats">
                              <div className="stat">
                                <span className="stat-label">Pattern:</span>
                                <span className={`stat-value pattern-${med.adherence.pattern}`}>
                                  {med.adherence.pattern.replace(/-/g, ' ')}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Avg Delay:</span>
                                <span className="stat-value">
                                  {med.adherence.avgDelay > 0 ? '+' : ''}{med.adherence.avgDelay} min
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Consistency:</span>
                                <span className={`stat-value consistency-${med.adherence.consistency}`}>
                                  {med.adherence.consistency}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <h2>Medication History</h2>
              <div className="history-timeline">
                {console.log("History: ", history)}
                {history.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="timeline-dot" style={{ background: currentColor }}></div>
                    <div className="history-content">
                      <h3>{item.name}</h3>
                      <div className="history-details">
                        <p><strong>Dosage:</strong> {item.dosage}</p>
                        <p><strong>Period:</strong> {item.period}</p>
                        <p><strong>Prescribed by:</strong> {item.prescribedBy}</p>
                        {/* <p><strong>Total Doses:</strong> {item.totalDoses}</p>
                        <p><strong>Doses Taken:</strong> {item.takenDoses}</p>
                        <p><strong>Dose Missed:</strong> {item.missedDoses}</p> */}
                        <p><strong>Reason for discontinuation:</strong> {item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="alerts-panel">
          <div className="panel-section refill-alerts">
            <h3>⚠️ Refill Alerts</h3>
            <div className="alerts-list">
              {capsules
                .filter(med => getStockStatus(med.stock, med.frequency) !== 'good')
                .map(med => (
                  <div key={med.id} className={`alert-card ${getStockStatus(med.stock, med.frequency)}`}>
                    <div className="alert-icon">
                      {getStockStatus(med.stock, med.frequency) === 'critical' ? '🚨' : '⚠️'}
                    </div>
                    <div className="alert-content">
                      <h4>{med.name}</h4>
                      <p>{med.stock} pills left</p>
                      <p className="refill-date">Refill by: {new Date(med.endDate).toLocaleDateString() || "-"}</p>

                      {/* <p className="refill-date">Refill by: {"-"}</p> */}
                    </div>
                  </div>
                ))}
              {medications.filter(med => getStockStatus(med.stock, med.frequency) !== 'good').length === 0 && (
                <p className="no-alerts">All medications well-stocked</p>
              )}
            </div>
          </div>

          <div className="panel-section stats">
            <h3>📊 Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Active Medications</span>
              <span className="stat-value" style={{ color: currentColor }}>{capsules.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Daily Doses</span>
              <span className="stat-value" style={{ color: currentColor }}>
                {capsules?.reduce((sum, med) => sum + med.timeSlots.length, 0)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Low Stock Items</span>
              <span className="stat-value" style={{ color: currentColor }}>
                {capsules.filter(med => getStockStatus(med.stock, med.frequency) !== 'good').length}
              </span>
            </div>
          </div>

          <div className="panel-section tips">
            <h3>💡 Health Tips</h3>
            <div className="tip">
              <p>💊 Take medications at the same time each day</p>
            </div>
            <div className="tip">
              <p>💧 Stay hydrated when taking medications</p>
            </div>
            <div className="tip">
              <p>📝 Keep track of any side effects</p>
            </div>
            <div className="tip">
              <p>👨‍⚕️ Consult your doctor before stopping any medication</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cockpit-frame"></div>
    </div>
  );
};

export default Capsules;