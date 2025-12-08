---

# System Architecture — Ranger Med-Core

## 1. Overview

| Layer             | Technology / Details                                                |
| ----------------- | ------------------------------------------------------------------- |
| **Frontend**      | React.js + Bootstrap (User UI, dashboards, AI Assistant)            |
| **Backend**       | Node.js + Express.js (REST API, ML prediction engine)               |
| **Database**      | MongoDB (Users, Capsules, Doses, Symptoms, Logs)                    |
| **AI**            | OpenAI GPT-4.1 / GEMINI-3.0 (Chatbot, insights, health suggestions) |
| **ML**            | Logistic Regression / Decision Trees (Predict missed doses)         |
| **Notifications** | Firebase Cloud Messaging (dose reminders, alerts)                   |
| **Maps**          | Leaflet + OpenStreetMap (Ranger tracking, emergency mapping)        |

---

## 2. System Flow

1. **Authentication & Login**

   * User logs in → backend issues JWT access + refresh tokens
   * Tokens stored securely in frontend

2. **Data Fetch & Dashboard**

   * Frontend requests capsules, doses, symptoms
   * Dashboard displays schedules, adherence, and health logs

3. **ML Prediction Engine**

   * Predicts probability of missed doses using historical data
   * Triggers alerts or suggestions in real-time

4. **AI Assistant**

   * Processes user queries via OpenAI/GEMINI API
   * Provides insights, reminders, and health recommendations

5. **Logging & Persistence**

   * All user actions, doses, symptoms, and AI interactions logged in MongoDB
   * Enables weekly insights, analytics, and report generation

---

## 3. Notification Architecture (FCM)

* **Scheduler Types**:

  * **Daily Dose Check** → Verify user adherence
  * **Real-time Reminders** → Cron-based alerts for scheduled doses
  * **Missed Dose Alerts** → Push notifications when a dose is missed

* **Topics**:

  * `/topics/ranger-{id}` → Individual ranger notifications
  * `/topics/doctors` → Doctors receive updates or alerts
  * `/topics/admins` → Admin dashboards and critical alerts

* **Delivery**: Firebase Cloud Messaging ensures reliable push notifications to devices

---

## 4. Maps Integration (Leaflet + OpenStreetMap)

* **Features**:

  * **Nearest Hospital Detection** → Display closest hospitals in emergency
  * **Ranger Location Tracker** → Real-time GPS coordinates
  * **Emergency Route Mapping** → Directions for quickest response
  * **Optional**: Can integrate with AI for route suggestions based on health urgency

---

## 5. Optional Enhancements (Future Improvements)

* **Analytics Dashboard** → Visualize adherence trends, symptom patterns
* **Offline Support** → Cache doses/symptoms for areas without connectivity
* **Role-based Access** → Admin, Ranger, Doctor dashboards
* **Notifications Analytics** → Track which reminders were acknowledged

