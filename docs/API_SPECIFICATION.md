# **Ranger Med-Core -- API Specification**

## Base URL
```sh
http://localhost:5000
```


All endpoints start with:

```
/api
```

Authentication uses:

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

#  **1. AUTHENTICATION**

---

## **POST /auth/register**

Creates a new user. *Does NOT auto-login.*

### **Request**

```json
{
  "name": "Jason Lee Scott",
  "email": "jason.red@rangers.com",
  "password": "dragonzord123",
  "role": "ranger"
}
```

### **Response**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {...}
}
```

---

## **POST /auth/login**

Returns both tokens after verifying credentials.

### **Request**

```json
{
  "email": "jason.red@rangers.com",
  "password": "dragonzord123"
}
```

### **Response**

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "JWT_ACCESS_TOKEN_HERE",
  "refreshToken": "REFRESH_TOKEN_HERE",
  "user": {...}
}
```

---

## **POST /auth/refresh**

Used when the **access token expires**.

### **Request**

```json
{
  "refreshToken": "REFRESH_TOKEN_HERE"
}
```

### **Response**

```json
{
  "success": true,
  "accessToken": "NEW_JWT_ACCESS_TOKEN",
  "refreshToken": "NEW_REFRESH_TOKEN"
}
```

---

# **2. CAPSULE MANAGEMENT**

---

## **POST /capsules/add**

*JWT required*

### **Request**

```json
{
  "name": "Power Capsule A",
  "dosage": "50mg",
  "frequency": 2
}
```

### **Response**

```json
{
  "success": true,
  "capsule": {
    "id": "67a45be2391ae45011e4e01b",
    "name": "Power Capsule A",
    "dosage": "50mg",
    "frequency": 2,
    "schedule": [
      "2025-02-14T08:00:00.000Z",
      "2025-02-14T20:00:00.000Z"
    ]
  }
}
```

---

## **GET /capsules/all**

### **Response**

```json
{
  "success": true,
  "capsules": [
    {
      "id": "67a45be2391ae45011e4e01b",
      "name": "Power Capsule A",
      "dosage": "50mg",
      "frequency": 2,
      "nextDose": "2025-02-14T20:00:00.000Z",
      "adherence": 86
    }
  ]
}
```

---

## **PATCH /capsules/:id**

### **Request**

```json
{
  "name": "Power Capsule A – Modified",
  "frequency": 3
}
```

### **Response**

```json
{
  "success": true,
  "updated": {
    "id": "67a45be2391ae45011e4e01b",
    "name": "Power Capsule A – Modified",
    "frequency": 3
  }
}
```

---

## **POST /capsules/:id/take**

### **Response**

```json
{
  "success": true,
  "message": "Dose recorded",
  "log": {
    "id": "67a45c12ab67df789002ad11",
    "taken": true,
    "timestamp": "2025-02-14T08:00:00.000Z"
  }
}
```

---

## **POST /capsules/:id/miss**

### **Response**

```json
{
  "success": true,
  "message": "Dose marked as missed",
  "log": {
    "id": "67a45c12ab67df789002ad12",
    "taken": false,
    "timestamp": "2025-02-14T08:00:00.000Z"
  }
}
```

---

# **3. SYMPTOMS**

---

## **POST /symptoms/add**

### **Request**

```json
{
  "name": "Fatigue",
  "severity": 3,
  "notes": "Feeling low after late-night morphing."
}
```

### **Response**

```json
{
  "success": true,
  "symptom": {
    "id": "67a45d099821cf00919ff456",
    "name": "Fatigue",
    "severity": 3,
    "notes": "Feeling low after late-night morphing.",
    "timestamp": "2025-02-14T14:30:00.000Z"
  }
}
```

---

## **GET /symptoms/list**

### **Response**

```json
{
  "success": true,
  "symptoms": [
    {
      "id": "67a45d099821cf00919ff456",
      "name": "Fatigue",
      "severity": 3,
      "notes": "Feeling low after late-night morphing.",
      "timestamp": "2025-02-14T14:30:00.000Z"
    }
  ]
}
```

---

# **4. AI ASSISTANT**

---

## **POST /ai/ask**

### **Request**

```json
{
  "message": "Why do I feel tired after missing my morning capsule?"
}
```

### **Response**

```json
{
  "success": true,
  "reply": "Missing your morning capsule decreases energy regulation, which commonly leads to fatigue. Try keeping your morning routine consistent."
}
```

---

## **GET /ai/weekly-insights**

### **Response**

```json
{
  "success": true,
  "week": "Feb 8 – Feb 14",
  "insights": {
    "adherenceScore": 82,
    "mostMissedCapsule": "Power Capsule A",
    "symptomTrends": [
      { "symptom": "Fatigue", "increase": "10%" }
    ],
    "recommendation": "Try taking morning capsules with breakfast."
  }
}
```

---

# **5. TIMELINE**

---

## **GET /timeline/all**

### **Response**

```json
{
  "success": true,
  "timeline": [
    {
      "type": "dose",
      "capsule": "Power Capsule A",
      "taken": true,
      "timestamp": "2025-02-14T08:00:00.000Z"
    },
    {
      "type": "symptom",
      "symptom": "Fatigue",
      "severity": 3,
      "timestamp": "2025-02-14T14:30:00.000Z"
    },
    {
      "type": "appointment",
      "title": "Doctor Zordon Checkup",
      "timestamp": "2025-02-15T09:00:00.000Z"
    }
  ]
}
```

---

# **6. PREDICTION ENGINE**

---

## **GET /predict/missed-dose**

### **Response**

```json
{
  "success": true,
  "prediction": {
    "probability": 0.42,
    "riskLevel": "medium",
    "message": "You have a moderate chance of missing your next capsule. Enable snooze reminders."
  }
}
```

---
