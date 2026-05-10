# 🔑 API Key Setup Guide

This project relies on several third-party services to function correctly. This guide explains where to get each required API key and how to add it to your `.env` file.

## 1. MongoDB Atlas (Database)
We use MongoDB to store users, products, orders, and reviews.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a new Cluster (the free tier is perfect).
3. Go to **Database Access** and create a new database user (remember the username and password).
4. Go to **Network Access** and click "Add IP Address". Select "Allow Access from Anywhere" (0.0.0.0/0) for development.
5. Go to **Databases**, click **Connect**, then click **Connect your application**.
6. Copy the connection string.
7. In your `.env` file, set `MONGODB_URI` to this string. Replace `<password>` with the password you created in step 3.

## 2. Firebase (Google Login & Auth)
We use Firebase to allow users to securely log in with their Google accounts.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the left sidebar, click **Build > Authentication**. Enable the **Google** sign-in provider.
3. Go to **Project Settings** (the gear icon next to "Project Overview").
4. Click on the **Service Accounts** tab.
5. Click **Generate new private key**. This will download a JSON file to your computer.
6. Open the JSON file. You need three specific pieces of information for your `.env` file:
   - `FIREBASE_PROJECT_ID`: The `project_id` from the JSON.
   - `FIREBASE_CLIENT_EMAIL`: The `client_email` from the JSON.
   - `FIREBASE_PRIVATE_KEY`: The `private_key` from the JSON (copy the exact string including all the `\n` characters).

## 3. Razorpay (Payments)
We use Razorpay to process mock payments in the checkout flow.

1. Go to [Razorpay](https://razorpay.com/) and sign up / log in.
2. Make sure you are in **Test Mode** (toggle at the top or side menu).
3. Go to **Settings > API Keys**.
4. Click **Generate Test Key**.
5. Copy the Key ID and Key Secret to your `.env` file:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

## 4. OpenAI (AI Chatbot & Seller Tools)
We use OpenAI to power the customer support chatbot and generate SEO/Product descriptions for sellers.

1. Go to the [OpenAI Platform](https://platform.openai.com/).
2. Log in and navigate to **API Keys** (usually under your profile menu or left sidebar).
3. Click **Create new secret key**.
4. Copy the key (it usually starts with `sk-`) and paste it into your `.env` file under `OPENAI_API_KEY`.
*(Note: You must have a funded OpenAI account for the API to work, otherwise you will receive a 429 quota error).*

## 5. JWT (JSON Web Tokens)
JWT is used for secure session handling and role-based access.

1. You do not need a website for this. You just need a long, random string.
2. You can generate one using a tool like [Generate-Random](https://generate-random.org/encryption-key-generator) or by running this command in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. Paste the output into your `.env` file under `JWT_SECRET`.
4. Set `JWT_EXPIRES_IN=30d` (or whatever duration you prefer).
