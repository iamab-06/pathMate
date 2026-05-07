from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('mentee', 'Mentee'),
        ('mentor', 'Mentor'),
    )
    
    # We want users to log in with email, not a username
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='mentee')

    # Tell Django to use 'email' for authentication instead of 'username'
    USERNAME_FIELD = 'email'
    # 'username' is required by AbstractUser by default, so we keep it in REQUIRED_FIELDS for createsuperuser command
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"

COLLEGE_TIER_CHOICES = (
    ('1', 'Tier 1 (IIT, NIT, BITS, etc.)'),
    ('2', 'Tier 2 (Good State Colleges)'),
    ('3', 'Tier 3 (Local/Private Colleges)'),
)

INTERNSHIP_STATUS_CHOICES = (
    ('none', 'No initial internship'),
    ('startup', 'Startup internship'),
    ('mass', 'Mass recruiter internship'),
)

class MenteeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentee_profile')
    college_tier = models.CharField(max_length=1, choices=COLLEGE_TIER_CHOICES)
    target_role = models.CharField(max_length=100) # e.g. Frontend Developer, Product Manager
    current_skills = models.TextField(blank=True) # e.g. React, Python

    def __str__(self):
        return f"Mentee: {self.user.email}"

class MentorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    # Core fields
    company = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField(default=0)
    domain = models.CharField(max_length=100) # e.g. Software Engineering, Product Management
    
    # "Same Shoes" Filter Fields
    previous_college_tier = models.CharField(max_length=1, choices=COLLEGE_TIER_CHOICES)
    internship_status = models.CharField(max_length=20, choices=INTERNSHIP_STATUS_CHOICES, default='none')

    def __str__(self):
        return f"Mentor: {self.user.email} at {self.company}"

class SessionRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    )

    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    message = models.TextField(blank=True) # Why the mentee wants to connect
    meeting_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.mentee.email} → {self.mentor.email} ({self.status})"

from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    session_request = models.OneToOneField(SessionRequest, on_delete=models.CASCADE, related_name='review')
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}/5 by {self.mentee.first_name} for {self.mentor.first_name}"
