# Ranger Med-Core -- (Fullstack (MERN) + ML/AI)
Ranger Med-Core: Command Center for Health &amp; Power. Full-stack healthcare &amp; AI app for Rangers, including capsule management, AI health assistant, dose prediction, and wellness dashboard.

---

## **Functionalities**

### **Basic Functionalities**

* **Ranger Power Capsule Management**

  * Add capsules, set dosage and frequency, schedule doses
  * Mark doses as taken/missed and maintain full capsule history

* **Dose Reminder Engine**

  * Send alerts for upcoming and missed doses via Ranger Communicator
  * Snooze support for reminders

* **Health Dashboard (Health Morpher Panel)**

  * View today’s capsules, adherence score, missed streaks, and symptom trends
  * Overall wellness score display

* **AI Chatbot Health Assistant**

  * Provide medicine explanations and routine suggestions
  * Symptom guidance and quick health query answers

* **Symptom Checker**

  * Record symptoms and predict possible conditions
  * Assign urgency levels and log all entries

* **Multi-Role Access**

  * Support Ranger, Doctor, and optional Health Admin roles

* **Calendar Integration**

  * Sync doses and appointments with calendars
  * Allow editing or cancellation

---

### **Advanced Functionalities**

* **Missed Dose Prediction Model**

  * Analyze habits to forecast skipped doses
  * Issue early alerts for likely missed capsules

* **Health Timeline**

  * Chronological display of capsules, symptoms, and appointments

* **AI-Generated Health Insights**

  * Weekly summaries of health trends
  * Symptom-based risk insights and personalized wellness tips

---

### **Brownie Points**

* **AI Enhancements**

  * Generate capsule explanations automatically
  * Estimate symptom severity
  * Deliver personalized lifestyle and wellness recommendations

---


## Repository Structure
- `backend/` -> Node.js + Express + MongoDB + ML + OpenAI + FCM  
- `frontend/` -> React.js + TailwindCSS + OpenStreetMap with Leaflet
- `docs/`  -> Project documentation including architecture, API reference, DB schema, setup instructions, PR guide, and System Architecture.

---
# Setup Guide

### 1. Clone the repository

```sh
git clone https://github.com/<your-org>/ranger-med-core.git
cd ranger-med-core
```

---

##  Backend Setup (`/backend`)

```sh
cd backend
npm install
cp .env.example .env     # fill required environment variables
npm run dev
```

Backend runs on: **[http://localhost:5000](http://localhost:5000)**

Ensure **MongoDB** is running

Backend includes its own documentation inside **[/backend/README.md](./backend/README.md)**.

---

## Frontend Setup (`/frontend`)

```sh
cd frontend
npm install
cp .env.example .env     # fill required environment variables
npm run dev
```

Frontend runs on: **[http://localhost:3000](http://localhost:3000)**

Frontend includes its own documentation inside **[/frontend/README.md](./frontend/README.md)**.

---


# Tech Stack

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* OpenAI / LLM integration

### **Frontend**

* React.js
* TailwindCSS
* Axios
* Redux
---

## **Team Report**

| Name          | Role           | Contributions                                  |
| ------------- | -------------- | ---------------------------------------------- |
| Himanshu Thakur | Full Stack + AI/ML Lead  | Designed and developed full-stack architecture, integrated AI health assistant, implemented dose prediction and wellness dashboard, and created project documentation and README, and reviews/approves both frontend and backend work.  |
| Yashwardhan Singh     | Backend Lead   | Built Node.js APIs, MongoDB schemas, implemented capsule management and symptom tracking.          |
| Yusra Mirza     | Frontend Lead | Developed React UI for dashboard and capsule management, integrated AI responses, and implemented calendar and health visualization componentsl         |

---
