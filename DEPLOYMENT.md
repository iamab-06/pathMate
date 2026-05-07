# MentorBridge (PathMate) Deployment Guide

This guide covers deploying the backend to Render (or Railway) and the frontend to Vercel natively, without the complexity of Docker.

## Prerequisites

1. **GitHub Repository:** You must have your project pushed to a GitHub repository. Both Render and Vercel will connect directly to this repository for continuous deployment.
2. Ensure you have committed all recent changes, but **never commit `.env` files.**

---

## 1. Backend (Render)

We recommend Render for hosting the Django API and PostgreSQL database due to its native Python support.

### Step 1: PostgreSQL Database
1. Go to your Render Dashboard.
2. Create a new **PostgreSQL** instance. Name it `mentorbridge-db`.
3. Once created, copy the **Internal Database URL** (to connect your Web Service to it) and save it.

### Step 2: Django Web Service
1. Create a new **Web Service** on Render connected to your GitHub repository.
2. Configure the service:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `sh build.sh`
   - **Start Command:** `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
3. Add Environment Variables:
   - `PYTHON_VERSION`: `3.11.4` (or your local python version)
   - `SECRET_KEY`: *Set a long, random, secure string. Do not use the default one.*
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-backend-url.onrender.com`
   - `DATABASE_URL`: *Paste the Internal Database URL from Step 1.*
   - `CORS_ALLOWED_ORIGINS`: *Your frontend URL (e.g., `https://your-frontend.vercel.app` — **NO trailing slash**)*
4. Click **Deploy**.

---

## 2. Frontend (Vercel)

Vercel provides native, ultra-fast deployments for Vite/React applications.

### Step 1: Vercel Project
1. Go to Vercel and click **Add New Project**.
2. Import your GitHub repository.

### Step 2: Configuration
1. **Root Directory:** Edit to be `frontend`.
2. **Framework Preset:** `Vite` (Vercel will usually detect this automatically).
3. **Build Command:** `npm run build`
4. **Install Command:** `npm install`
5. Add Environment Variables:
   - `VITE_API_URL`: *The URL of your deployed backend (e.g., `https://your-backend-url.onrender.com/api`)*

### Step 3: Deploy
1. Click **Deploy**.
2. Vercel will automatically build the static assets and host your application.

---

## 3. Post-Deployment Verification & Demo Data

Once both frontend and backend are deployed:

1. **Verify Backend Admin:** Visit `https://your-backend-url.onrender.com/admin/`. It should load the styled Django admin interface.
2. **Verify Frontend:** Visit `https://your-frontend.vercel.app`. The landing page should load and the animations should play.
3. **Seed Demo Data:** To populate your production database with realistic mentors for presentation:
   - Go to your Render Dashboard -> Web Service -> **Shell** (or connect via SSH).
   - Run: `python manage.py seed_demo`
   - This will create several realistic mentor profiles and a `demo@example.com` / `demo1234` mentee account.

---

## Common Deployment Errors & Troubleshooting

1. **CORS Errors on Login/Requests:**
   - *Cause:* The frontend is trying to talk to the backend, but the backend doesn't recognize the frontend's origin.
   - *Fix:* Ensure `CORS_ALLOWED_ORIGINS` in your backend environment variables exactly matches the Vercel URL (e.g., `https://my-app.vercel.app` — **NO trailing slash**). Check the browser network tab for preflight request failures.

2. **Database Connection Failed (500 Server Error):**
   - *Cause:* Invalid `DATABASE_URL` or missing `psycopg2-binary`.
   - *Fix:* Ensure you are using the *Internal* connection string on Render. If using an external client (like pgAdmin or DataGrip), you must append `?sslmode=require` to the external connection string.

3. **Static Files (Admin Panel) Unstyled:**
   - *Cause:* `collectstatic` did not run.
   - *Fix:* Ensure `whitenoise` is in `requirements.txt` and `sh build.sh` is your Build Command in Render.

4. **"Not enough segments" JWT Error or Silent Login Failures:**
   - *Cause:* `SECRET_KEY` mismatch between sessions or environments. Or your `.env` does not have a `SECRET_KEY`.
   - *Fix:* Make sure you set a secure, persistent `SECRET_KEY` in the Render environment variables. Do not change it after deployment unless you intend to log all users out.

5. **Internal Server Error 500 when starting the app:**
   - *Cause:* Most likely `SECRET_KEY` is not set in the environment variables, causing Django to crash immediately.
   - *Fix:* Set `SECRET_KEY` in Render dashboard.
