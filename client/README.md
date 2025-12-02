
---

# Ranger Med-Core — Frontend

This is the **React.js frontend** for the Ranger Med-Core Health Management & Monitoring System.
It handles user interactions, capsule schedules, symptoms, AI assistant responses, and maps, with **Bootstrap for styling**.

---

## Quick Setup

1. **Install dependencies**

```sh
npm install
```

2. **Configure environment variables**

Copy `.env.example` → `.env` and fill the keys.
Example:

```
REACT_APP_API_URL=http://localhost:5000/
REACT_APP_MAP_KEY=YOUR_MAP_KEY
REACT_APP_OPENAI_KEY=YOUR_OPENAI_KEY
```

3. **Run the frontend**

```sh
npm start
```

* App will run on **[http://localhost:3000](http://localhost:3000)**

---

## Notes

* Backend runs on: **[http://localhost:5000](http://localhost:5000)**
* **Full Setup Guide**: [docs/setup_guide.md](../docs/setup_guide.md)
* **API Specification**: [docs/api_specification.md](../docs/api_specification.md)

---

## Project Structure

```
src/
 ├─ components/   # Reusable UI components (Buttons, Cards, Modals)
 ├─ pages/        # Route pages (Login, Dashboard, Capsules, etc.)
 ├─ hooks/        # Custom React hooks
 ├─ context/      # React context providers (AuthContext, CapsuleContext, etc.)
 ├─ api/          # API call definitions and Axios instances
 ├─ utils/        # Utility functions
 ├─ styles/       # Custom CSS files
 ├─ assets/       # Images, icons, and static files
 ├─ App.js        # Main app component
 ├─ App.css       # Global app CSS
 ├─ index.js      # Entry point
 └─ index.css     # Global index CSS
```

---

## Environment Variables

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `REACT_APP_API_URL`    | Base URL for backend API                     |
| `REACT_APP_MAP_KEY`    | Map API key                                  |
| `REACT_APP_OPENAI_KEY` | OpenAI API key for AI assistant              |

---

## Running Production Build

1. Build for production:

```sh
npm run build
```

2. Deploy using **Netlify**
   Make sure `REACT_APP_API_URL` points to your deployed backend.

---

## Tech Stack

* **React.js**
* **Tailwind CSS** for styling
* **React Router** for navigation
* **Axios** for API requests
* **Leaflet / OpenStreetMap** for maps
* **Firebase / FCM** for push notifications
* **OpenAI API** for AI assistant

---
