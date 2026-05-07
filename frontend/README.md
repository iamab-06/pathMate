# PathMate Frontend 💻

This is the React frontend for the PathMate platform, built with Vite.

## Tech Stack
- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first CSS framework
- **React Router v7** — Client-side routing (SPA)
- **Axios** — HTTP client for API calls

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

3. **Backend Required:** The Django backend must be running at `http://127.0.0.1:8000` for login/register/profile/session features to work.

## Project Structure
```
src/
├── assets/           # Static images, icons
├── components/       # Reusable components
│   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   └── MentorCard.jsx      # Clickable mentor card with badges
├── context/          # React Context providers
│   └── AuthContext.jsx     # Global auth state (login, logout, user)
├── pages/            # Page components (one per route)
│   ├── Home.jsx            # Landing page (/)
│   ├── Login.jsx           # Login form (/login)
│   ├── Register.jsx        # Register form (/register)
│   ├── Dashboard.jsx       # User dashboard (/dashboard) — protected
│   ├── ProfileSetup.jsx    # Profile onboarding (/profile) — protected
│   ├── MentorListing.jsx   # Mentor listing + Same Shoes filter (/mentors)
│   ├── MentorDetail.jsx    # Mentor journey card + session CTA (/mentors/:id)
│   ├── MyRequests.jsx      # Session request tracking (/requests) — protected
│   └── NotFound.jsx        # 404 catch-all page
├── services/         # API configuration
│   └── api.js              # Axios instance with JWT interceptors
├── App.jsx           # Route definitions
├── main.jsx          # Entry point (BrowserRouter + AuthProvider)
└── index.css         # Tailwind CSS entry point
```

## Routes
| Path | Page | Auth | Description |
|------|------|------|-------------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Public | Login form (connected to backend) |
| `/register` | Register | Public | Register form with role selection |
| `/mentors` | MentorListing | Public | Mentor discovery with Same Shoes filter |
| `/mentors/:id` | MentorDetail | Public | Mentor journey card + session request CTA |
| `/dashboard` | Dashboard | Protected | User dashboard with nav cards |
| `/profile` | ProfileSetup | Protected | Mentee/Mentor profile form |
| `/requests` | MyRequests | Protected | Session request tracking |
| `*` | NotFound | Public | 404 page |

## What's Been Set Up
- [x] Vite + React boilerplate initialized
- [x] Tailwind CSS v4 installed and configured
- [x] React Router with public and protected routes
- [x] Axios API service with JWT token interceptors
- [x] AuthContext for global auth state management
- [x] Login page connected to backend JWT auth
- [x] Register page connected with role selection
- [x] Dashboard page with user info and nav cards
- [x] Profile onboarding page (mentee + mentor forms)
- [x] ProtectedRoute component for auth guards
- [x] Mentor Listing page with Same Shoes filter (sidebar + cards + badges)
- [x] Loading skeleton, empty state, and error state for mentor listing
- [x] Clickable mentor cards linking to detail page
- [x] Mentor Detail page with journey timeline, match reasons, and session CTA
- [x] Session request modal on mentor detail page
- [x] My Requests page with status badges and accept/decline buttons
- [x] Dashboard link to My Requests

## Testing Steps
1. Register as a **mentee** at `/register`
2. Login at `/login`
3. Browse mentors at `/mentors`
4. Click a mentor card → view their journey
5. Click **"Request a Session"** → fill in a message → submit
6. Go to **Dashboard** → click **"My Requests"** → see your sent request
7. Register as a **mentor** in a new browser/incognito
8. Login as the mentor → go to **"Incoming Requests"** → Accept or Decline

## Next Steps
- [ ] Ratings/reviews basic structure
- [ ] Notification system
