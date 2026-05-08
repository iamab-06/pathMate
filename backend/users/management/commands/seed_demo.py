import sys
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with realistic demo data for MentorBridge'

    def handle(self, *args, **options):
        # self.stdout.write('NUCLEAR RESET: Wiping old user data...')
        # User.objects.all().delete()
        # self.stdout.write('Database cleared.')
        self.stdout.write('Seeding demo data...')
        
        # 0. Create Superuser for Admin Access
        admin, created = User.objects.get_or_create(
            email='admin@pathmate.com',
            username='admin@pathmate.com',
            defaults={
                'password': make_password('admin1234'),
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': 'mentor',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created Admin: admin@pathmate.com / admin1234'))

        # 1. Create Demo Mentee
        mentee, created = User.objects.get_or_create(
            email='demo@example.com',
            username='demo@example.com',
            defaults={
                'password': make_password('demo1234'),
                'first_name': 'Demo',
                'last_name': 'User',
                'role': 'mentee'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created Mentee: demo@example.com / demo1234'))

        # 2. Create Mentors
        mentors_data = [
            {
                'email': 'rahul@example.com',
                'username': 'rahul@example.com',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': 'mentor',
                'profile': {
                    'company': 'Google',
                    'experience_years': 5,
                    'domain': 'Backend Engineering',
                    'previous_college_tier': '3',
                    'internship_status': 'none',
                }
            },
            {
                'email': 'priya@example.com',
                'username': 'priya@example.com',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'role': 'mentor',
                'profile': {
                    'company': 'Microsoft',
                    'experience_years': 4,
                    'domain': 'Product Management',
                    'previous_college_tier': '2',
                    'internship_status': 'startup',
                }
            },
            {
                'email': 'amit@example.com',
                'username': 'amit@example.com',
                'first_name': 'Amit',
                'last_name': 'Kumar',
                'role': 'mentor',
                'profile': {
                    'company': 'Stripe',
                    'experience_years': 7,
                    'domain': 'Systems Engineering',
                    'previous_college_tier': '1',
                    'internship_status': 'mass',
                }
            }
        ]

        from users.models import MentorProfile

        for data in mentors_data:
            profile_data = data.pop('profile')
            user, created = User.objects.get_or_create(
                email=data['email'],
                username=data['username'],
                defaults={
                    'password': make_password('demo1234'),
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': data['role']
                }
            )
            if created:
                MentorProfile.objects.create(user=user, **profile_data)
                self.stdout.write(self.style.SUCCESS(f'Created Mentor: {data["email"]} / demo1234'))

        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
