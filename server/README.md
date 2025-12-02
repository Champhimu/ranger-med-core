---

# Ranger Med-Core — Backend

This is the **Node.js/Express backend** for the Ranger Med-Core Health Management & Monitoring System.
It handles user authentication, capsule scheduling, symptom tracking, AI assistant integration, predictions, and timeline management.

---

## Quick Setup

1. **Install dependencies**

```sh
npm install
```

2. **Configure environment variables**

Copy `.env.example` → `.env` and fill all required keys.
Example:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ranger-med-core
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
OPENAI_API_KEY=your_openai_api_key
FCM_SERVER_KEY=your_fcm_server_key
```

3. **Run the backend**

```sh
npm run dev
```

* Backend will run on **[http://localhost:5000](http://localhost:5000)**

---

## Notes

* Full Setup Guide: [docs/setup_guide.md](../docs/setup_guide.md)
* API Specification: [docs/api_specification.md](../docs/api_specification.md)
* Make sure MongoDB is running locally or point `MONGO_URI` to a cloud database (Atlas, etc.)

---

##  Project Structure

```
backend/
 ├─ controllers/   # Route logic (auth, capsules, symptoms, AI, etc.)
 ├─ models/        # Mongoose models (User, Capsule, Symptom, etc.)
 ├─ routes/        # Express route definitions
 ├─ middleware/    # Auth, error handling, request validation
 ├─ ml/            # Machine learning models & prediction logic
 ├─ ai/            # AI assistant logic (OpenAI integration, prompts)
 ├─ utils/         # Utility functions (JWT helpers, date utils, etc.)
 ├─ config/        # DB connections, environment configs
 ├─ server.js      # Entry point
 └─ package.json   # Dependencies and scripts
```

---

## Environment Variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `PORT`                 | Port for backend server (default: 5000) |
| `MONGO_URI`            | MongoDB connection string               |
| `JWT_SECRET`           | Secret key for JWT authentication       |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh tokens           |
| `OPENAI_API_KEY`       | OpenAI API key for AI assistant         |
| `FCM_SERVER_KEY`       | FCM server key for push notifications   |

---

## Scripts

| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Start server in development with nodemon |
| `npm start`   | Start server in production mode          |
| `npm test`    | Run unit tests                           |

---

## Tech Stack

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **JWT** for authentication
* **OpenAI API** for AI assistant
* **Leaflet / OpenStreetMap** for location-based features
* **Firebase / FCM** for push notifications

---



