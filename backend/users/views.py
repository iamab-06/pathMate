from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

from rest_framework.permissions import IsAuthenticated
from .models import MenteeProfile, MentorProfile
from .serializers import UserSerializer, MenteeProfileSerializer, MentorProfileSerializer

# 1. Current user API
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        # Always return the currently logged-in user
        return self.request.user

# 2. Mentee profile API (Get, Create, Update)
class MenteeProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MenteeProfileSerializer

    def get_object(self):
        # Get or create the profile for the logged-in user
        profile, created = MenteeProfile.objects.get_or_create(user=self.request.user)
        return profile

# 3. Mentor profile API (Get, Create, Update)
class MentorProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MentorProfileSerializer

    def get_object(self):
        profile, created = MentorProfile.objects.get_or_create(user=self.request.user)
        return profile

# 4. Public mentor listing API with "Same Shoes" Filter
class MentorListView(generics.ListAPIView):
    permission_classes = (AllowAny,) # Publicly viewable
    serializer_class = MentorProfileSerializer

    def get_queryset(self):
        # Start with all mentors
        queryset = MentorProfile.objects.all()

        # Read the "Same Shoes" query parameters from the URL
        college_tier = self.request.query_params.get('previous_college_tier')
        internship_status = self.request.query_params.get('internship_status')
        domain = self.request.query_params.get('domain')
        company = self.request.query_params.get('company')

        # Filter the queryset if parameters exist
        if college_tier:
            queryset = queryset.filter(previous_college_tier=college_tier)
        if internship_status:
            queryset = queryset.filter(internship_status=internship_status)
        if domain:
            queryset = queryset.filter(domain__icontains=domain)
        if company:
            queryset = queryset.filter(company__icontains=company)

        return queryset

# 5. Single mentor detail API
class MentorDetailView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = MentorProfileSerializer
    queryset = MentorProfile.objects.all()

from rest_framework import status
from rest_framework.response import Response
from .models import SessionRequest
from .serializers import SessionRequestCreateSerializer, SessionRequestSerializer

# 6. Create a session request (mentee → mentor)
class SessionRequestCreateView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionRequestCreateSerializer

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)

# 7. List session requests for the current user
class SessionRequestListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'mentee':
            return SessionRequest.objects.filter(mentee=user)
        else:
            return SessionRequest.objects.filter(mentor=user)

# 8. Update session request status (mentor accepts/rejects)
class SessionRequestUpdateView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SessionRequestSerializer

    def get_queryset(self):
        # Only the mentor who received the request can update it
        return SessionRequest.objects.filter(mentor=self.request.user)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        
        new_status = request.data.get('status')
        if new_status:
            if new_status not in ['accepted', 'rejected', 'completed']:
                return Response({'error': 'Status must be accepted, rejected, or completed'}, status=status.HTTP_400_BAD_REQUEST)
            instance.status = new_status
            
        meeting_link = request.data.get('meeting_link')
        if meeting_link is not None:
            instance.meeting_link = meeting_link
            
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

from .models import Review
from .serializers import ReviewSerializer

# 9. Create a review for a session
class ReviewCreateView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        session_request = serializer.validated_data['session_request']
        serializer.save(mentee=self.request.user, mentor=session_request.mentor)

# 10. List reviews for a specific mentor
class MentorReviewListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ReviewSerializer

    def get_queryset(self):
        mentor_profile_id = self.kwargs['mentor_id']
        # The URL parameter is the MentorProfile ID, but Review.mentor is a User FK.
        return Review.objects.filter(mentor__mentor_profile__id=mentor_profile_id)
