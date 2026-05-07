from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='mentee')

    class Meta:
        model = User
        fields = ('email', 'password', 'role', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], # we use email as username behind the scenes
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'mentee'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

from .models import MenteeProfile, MentorProfile, SessionRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'first_name', 'last_name')

class MenteeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenteeProfile
        # We don't include 'user' because we will automatically link it to the logged-in user in the view
        fields = ('id', 'college_tier', 'target_role', 'current_skills')

class MentorProfileSerializer(serializers.ModelSerializer):
    # We embed the User details (like name) so the frontend can display them on the mentor cards
    user = UserSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = MentorProfile
        fields = (
            'id', 'user', 'company', 'experience_years', 'domain',
            'previous_college_tier', 'internship_status',
            'average_rating', 'total_reviews'
        )

    def get_average_rating(self, obj):
        reviews = obj.user.received_reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return 0.0

    def get_total_reviews(self, obj):
        return obj.user.received_reviews.count()

class SessionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionRequest
        fields = ('id', 'mentor', 'message')

    def validate_mentor(self, value):
        if value.role != 'mentor':
            raise serializers.ValidationError("The selected user is not a mentor.")
        return value

class SessionRequestSerializer(serializers.ModelSerializer):
    mentee = UserSerializer(read_only=True)
    mentor = UserSerializer(read_only=True)
    mentor_profile_id = serializers.SerializerMethodField()

    class Meta:
        model = SessionRequest
        fields = ('id', 'mentee', 'mentor', 'mentor_profile_id', 'message', 'meeting_link', 'status', 'created_at', 'updated_at')

    def get_mentor_profile_id(self, obj):
        if hasattr(obj.mentor, 'mentor_profile'):
            return obj.mentor.mentor_profile.id
        return None

from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    mentee_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ('id', 'session_request', 'mentee', 'mentor', 'rating', 'comment', 'created_at', 'mentee_name')
        read_only_fields = ('mentee', 'mentor')

    def get_mentee_name(self, obj):
        return f"{obj.mentee.first_name} {obj.mentee.last_name}".strip() or "Anonymous"

    def validate(self, data):
        session_request = data['session_request']
        user = self.context['request'].user

        if session_request.mentee != user:
            raise serializers.ValidationError("You can only review your own sessions.")
        if session_request.status != 'completed':
            raise serializers.ValidationError("You can only review completed sessions.")
        if hasattr(session_request, 'review'):
            raise serializers.ValidationError("You have already reviewed this session.")
        
        return data
