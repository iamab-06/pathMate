from django.core.management.base import BaseCommand
from users.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Seeds the database with realistic demo data for MentorBridge'

    def handle(self, *args, **options):
        if User.objects.filter(email='demo@example.com').exists():
            self.stdout.write(self.style.WARNING('Database is already seeded with demo data.'))
            return

        self.stdout.write('Seeding demo data...')

        # 1. Create Demo Mentee
        mentee, created = User.objects.get_or_create(
            email='demo@example.com',
            defaults={
                'username': 'demo@example.com',
                'first_name': 'Demo',
                'last_name': 'User',
                'role': 'mentee',
                'password': make_password('demo1234')
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
                defaults={
                    'username': data['username'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': data['role'],
                    'password': make_password('demo1234')
                }
            )
            if created:
                MentorProfile.objects.create(user=user, **profile_data)
                self.stdout.write(self.style.SUCCESS(f"Created Mentor: {data['email']} / demo1234"))

        self.stdout.write(self.style.SUCCESS('Demo data seeding complete!'))
