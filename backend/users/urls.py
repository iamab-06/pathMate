from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, CurrentUserView, MenteeProfileView, MentorProfileView,
    MentorListView, MentorDetailView,
    SessionRequestCreateView, SessionRequestListView, SessionRequestUpdateView,
    ReviewCreateView, MentorReviewListView
)

urlpatterns = [
    # Auth APIs
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    
    # Profile APIs
    path('users/profile/mentee/', MenteeProfileView.as_view(), name='mentee_profile'),
    path('users/profile/mentor/', MentorProfileView.as_view(), name='mentor_profile'),
    
    # Mentor Discovery
    path('mentors/', MentorListView.as_view(), name='mentor_list'),
    path('mentors/<int:pk>/', MentorDetailView.as_view(), name='mentor_detail'),
    
    # Session Requests
    path('sessions/request/', SessionRequestCreateView.as_view(), name='session_request_create'),
    path('sessions/', SessionRequestListView.as_view(), name='session_request_list'),
    path('sessions/<int:pk>/', SessionRequestUpdateView.as_view(), name='session_request_update'),
    path('sessions/reviews/', ReviewCreateView.as_view(), name='review_create'),
    path('mentors/<int:mentor_id>/reviews/', MentorReviewListView.as_view(), name='mentor_reviews'),
]
