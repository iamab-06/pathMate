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
        mentee = User.objects.create(
            email='demo@example.com',
            first_name='Demo',
            last_name='User',
            role='mentee',
            password=make_password('demo1234')
        )
        self.stdout.write(self.style.SUCCESS('Created Mentee: demo@example.com / demo1234'))

        # 2. Create Mentors
        mentors_data = [
            {
                'email': 'rahul@example.com',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': 'mentor',
                'company': 'Google',
                'job_title': 'Senior SWE',
                'bio': 'Started at a Tier 3 college, hustled to get into FAANG. Happy to share my playbook.',
                'years_of_experience': 5,
                'is_profile_completed': True,
            },
            {
                'email': 'priya@example.com',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'role': 'mentor',
                'company': 'Microsoft',
                'job_title': 'Product Manager',
                'bio': 'Transitioned from a service-based IT company to product management. Let me help you break out.',
                'years_of_experience': 4,
                'is_profile_completed': True,
            },
            {
                'email': 'amit@example.com',
                'first_name': 'Amit',
                'last_name': 'Kumar',
                'role': 'mentor',
                'company': 'Stripe',
                'job_title': 'Backend Engineer',
                'bio': 'Specialist in distributed systems. If you want to crack hard engineering interviews, I can help.',
                'years_of_experience': 7,
                'is_profile_completed': True,
            }
        ]

        for data in mentors_data:
            data['password'] = make_password('demo1234')
            User.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f"Created Mentor: {data['email']} / demo1234"))

        self.stdout.write(self.style.SUCCESS('Demo data seeding complete!'))
