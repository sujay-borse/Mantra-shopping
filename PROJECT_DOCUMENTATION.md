# 📚 Complete Project Documentation

This document explains the architecture, folder structure, monitoring, and deployment guidelines for the Mantra E-Commerce platform.

## 📁 Project Structure

The project is structured as a full-stack monolith where the frontend static files live at the root, and the Node.js backend lives in the `/backend` folder.

```text
Mantra clone/
│
├── backend/                  # The Node.js Express server
│   ├── config/               # Configurations (DB, Firebase)
│   ├── middleware/           # Custom Express middlewares (Auth, Roles)
│   ├── models/               # Mongoose Database schemas
│   ├── routes/               # API endpoint definitions
│   ├── server.js             # Main entry point for the backend
│   └── .env                  # Environment variables (DO NOT SHARE)
│
├── css/                      # Frontend stylesheets
│   ├── dark-theme.css        # Core Dark Mode and Neon UI logic
│   └── style.css             # Base structure and legacy styles
│
├── js/                       # Frontend JavaScript logic
│   ├── ai-assistant.js       # Handles chatbot UI and OpenAI API calls
│   ├── components.js         # Reusable UI components (header, footer)
│   ├── spin-wheel.js         # Gamification logic
│   └── main.js               # Core app initialization
│
├── *.html                    # All frontend views (home, cart, checkout, admin, etc.)
└── package.json              # Project metadata
```

## 🏗️ Architecture Overview

- **Frontend:** Built with vanilla HTML/CSS/JS for maximum performance and explicit DOM control. It uses `fetch` to communicate with the backend REST API. Dark mode is implemented via CSS custom variables (`var(--primary)`, etc.) activated by a `data-theme="dark"` attribute on the `<html>` element.
- **Backend:** A RESTful Express server. It handles authentication (JWT + Firebase), talks to MongoDB via Mongoose, processes payments via Razorpay, and acts as a proxy to OpenAI.
- **Authentication Flow:**
  - **Standard:** User signs up -> Password hashed via `bcryptjs` -> Saved to MongoDB -> JWT returned.
  - **Google:** User logs in via Firebase UI -> Firebase ID Token sent to backend -> Backend verifies token using `firebase-admin` -> User found/created in MongoDB -> JWT returned.

## 🛡️ Security Notes

1. **`.env` File:** NEVER commit the `.env` file to GitHub. It contains highly sensitive keys. Use `.env.example` to show what keys are required without revealing the actual secrets.
2. **JWT Security:** Tokens are currently stored in `localStorage` on the frontend. Ensure your site uses HTTPS in production to prevent Man-in-the-Middle attacks.
3. **Backend Hardening:** We have implemented `helmet` for secure HTTP headers, `cors` to restrict API access strictly to your frontend domain, and `express-rate-limit` to prevent brute-force attacks on API endpoints.

## 📊 Performance & Monitoring Guide

- **MongoDB Atlas:** Monitor your database cluster via the Atlas Dashboard. Check the "Metrics" tab for operations per second, connection count, and logical size.
- **Backend Logs:** We use `morgan` in `server.js` to log all incoming HTTP requests. If an API call fails, check your terminal running `npm run dev` for the exact error stack trace.
- **Razorpay Dashboard:** Use the Razorpay test dashboard to monitor created orders, successful payments, and webhooks.
- **Frontend Debugging:** Use the Chrome Developer Tools (F12). The **Console** tab will show JavaScript errors. The **Network** tab will show failed API requests (look for red text).

## 🚀 Deployment Guide

### Deploying the Backend (Render / Heroku)
1. Push your code to GitHub.
2. Create an account on [Render.com](https://render.com/).
3. Create a new "Web Service" and connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set the Build Command to `npm install`.
6. Set the Start Command to `npm start` (or `node server.js`).
7. **Crucial:** Go to the "Environment" tab and add EVERY key from your `.env` file manually.
8. Deploy! Note the URL Render gives you (e.g., `https://mantra-api.onrender.com`).

### Deploying the Frontend (Vercel / Netlify)
1. Before deploying, you must update the frontend JavaScript files to point to your new backend URL instead of `http://localhost:5000`.
2. Create an account on [Vercel](https://vercel.com/).
3. Create a new Project and link your GitHub repository.
4. Leave the Root Directory empty (so it serves the HTML files at the root).
5. Vercel will automatically detect static files and deploy them.
6. Make sure to update your backend's CORS settings (in `server.js` or via the Render environment variable `CLIENT_URL`) to allow requests from your new Vercel domain.

---
*Follow these guides to maintain a robust, secure, and production-ready application.*
