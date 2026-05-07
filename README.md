# PathMate 🚀

PathMate (formerly MentorBridge) is a mentorship platform designed for tier-2/3 college students in India. It connects ambitious students with mentors who share similar starting points using the unique "Same Shoes" filtering system.

## Project Structure
- `/backend`: Django REST Framework (APIs, Database, Auth)
- `/frontend`: React + Vite (User Interface)

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios
- **Backend**: Django, Django REST Framework, PostgreSQL, JWT Auth (SimpleJWT)
- **Database**: PostgreSQL

## Features
- [x] JWT Authentication (Register, Login, Token Refresh)
- [x] Custom User model with role (mentor/mentee)
- [x] Mentee & Mentor profile management
- [x] Mentor discovery with "Same Shoes" filter (college tier, internship status, domain, company)
- [x] Mentor Detail / Journey Card page
- [x] Session Request system (mentee → mentor)
- [x] Ratings & reviews

## How to Run
1. Start PostgreSQL and ensure `mentorbridge` database exists
2. Backend: `cd backend && .\venv\Scripts\activate && python manage.py runserver`
3. Frontend: `cd frontend && npm run dev`
4. Open http://localhost:5173
