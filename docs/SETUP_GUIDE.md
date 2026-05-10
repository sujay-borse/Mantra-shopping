# ⚙️ Complete Setup Guide

Welcome! This guide will walk you through exactly how to set up and run the Mantra E-Commerce project on your local machine. It is designed to be completely beginner-friendly.

## Step 1: Install Node.js
Node.js is the environment that runs our backend server.
1. Go to the [Node.js official website](https://nodejs.org/).
2. Download and install the **LTS (Long Term Support)** version for your operating system.
3. Open your terminal (Command Prompt or PowerShell on Windows) and type:
   ```bash
   node -v
   npm -v
   ```
   If you see version numbers, Node.js is installed correctly!

## Step 2: Open the Project
1. Download or clone this project folder (`Mantra clone`).
2. Open the folder in a code editor like **Visual Studio Code (VS Code)**.

## Step 3: Install Dependencies
This project has a backend that requires specific packages to run.
1. Open a terminal inside VS Code (`Ctrl + ~` or `Terminal -> New Terminal`).
2. Navigate to the backend folder by typing:
   ```bash
   cd backend
   ```
3. Install all the necessary backend packages by running:
   ```bash
   npm install
   ```

## Step 4: Configure Environment Variables
The backend needs secret keys (like database passwords and payment keys) to work. These are stored in a `.env` file.
1. In the `backend` folder, you will see a file named `.env.example`.
2. Rename this file to `.env`.
3. Open `.env` and fill in the required API keys. *(See `API_SETUP.md` for detailed instructions on where to get these keys).*

## Step 5: Start the Backend Server
1. Make sure your terminal is still inside the `backend` folder.
2. Start the server by running:
   ```bash
   npm run dev
   ```
3. You should see messages like:
   ```
   🚀 Mantra backend running on http://localhost:5000
   ✅ MongoDB connected
   ✅ Firebase Admin SDK initialized
   ```
*If you see any errors, check that your `.env` file is set up correctly and your MongoDB URL is accurate.*

## Step 6: Run the Frontend
Because the frontend uses plain HTML, CSS, and JS, you don't need a complex build step.
1. Install the **Live Server** extension in VS Code.
2. Right-click on `index.html` or `index.html` in the root folder (`Mantra clone`).
3. Click **"Open with Live Server"**.
4. The website will automatically open in your browser (usually at `http://127.0.0.1:5500`).

## 🐛 Common Errors and Fixes

- **Error: `Cannot find module 'express'`**
  - **Fix:** You forgot to run `npm install` inside the `backend` folder.
- **Error: `MongoDB connection error`**
  - **Fix:** Check your `MONGODB_URI` in the `.env` file. Make sure your IP address is whitelisted in MongoDB Atlas.
- **Frontend API calls failing (CORS error or 404)**
  - **Fix:** Make sure the backend is running on `http://localhost:5000`. Ensure the frontend JavaScript files are pointing to this exact URL.
- **AI Chatbot replies "Add OPENAI_API_KEY to .env"**
  - **Fix:** You need to add a valid OpenAI API key in your `.env` file.

Enjoy exploring Mantra!
