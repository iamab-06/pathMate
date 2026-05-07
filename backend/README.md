# PathMate Backend ⚙️

This is the Django REST Framework backend for the PathMate platform.

## Setup Instructions

1. **Activate Virtual Environment:**
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

2. **Install Dependencies:**
   ```bash
   pip install django djangorestframework psycopg2-binary djangorestframework-simplejwt django-cors-headers
   ```

3. **Database Configuration (PostgreSQL):**
   - PostgreSQL must be installed with a database named `mentorbridge`.
   - Default credentials in `settings.py`: username `postgres`, password `postgres`.

4. **Run Migrations & Server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Register new user (email, password, role) |
| POST | `/api/auth/login/` | No | Login, returns JWT access + refresh tokens |
| POST | `/api/auth/token/refresh/` | No | Refresh expired access token |
| GET | `/api/auth/me/` | Yes | Get current user info |

### Profiles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET/PATCH | `/api/users/profile/mentee/` | Yes | Get/update mentee profile |
| GET/PATCH | `/api/users/profile/mentor/` | Yes | Get/update mentor profile |

### Mentor Discovery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/mentors/` | No | List mentors (supports Same Shoes filters) |
| GET | `/api/mentors/<id>/` | No | Single mentor detail |

**Same Shoes Filter Params:** `?previous_college_tier=3&internship_status=none&domain=Software&company=Google`

### Session Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sessions/request/` | Yes | Create session request (mentee → mentor) |
| GET | `/api/sessions/` | Yes | List my requests (sent for mentee, received for mentor) |
| PATCH | `/api/sessions/<id>/` | Yes | Update request status (mentor: accepted/rejected) |

## Models
- **User** — Custom AbstractUser with email auth and role (mentor/mentee)
- **MenteeProfile** — college_tier, target_role, current_skills
- **MentorProfile** — company, experience_years, domain, previous_college_tier, internship_status
- **SessionRequest** — mentee, mentor, message, status (pending/accepted/rejected), timestamps

## Completed
- [x] Custom User model with email authentication
- [x] JWT Authentication (SimpleJWT)
- [x] Mentor and Mentee Profile models & APIs
- [x] Mentor discovery API with Same Shoes filters
- [x] Single mentor detail API
- [x] Session Request system (create, list, update status)
- [x] CORS configured for frontend (localhost:5173)
