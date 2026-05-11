from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Send a test email to diagnose SMTP issues'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            default='',
            help='Recipient email address (defaults to EMAIL_HOST_USER)',
        )

    def handle(self, *args, **options):
        recipient = options['to'] or settings.EMAIL_HOST_USER

        self.stdout.write("=" * 60)
        self.stdout.write("PATHMATE EMAIL DIAGNOSTICS")
        self.stdout.write("=" * 60)
        self.stdout.write(f"EMAIL_BACKEND:       {settings.EMAIL_BACKEND}")
        self.stdout.write(f"EMAIL_HOST:          {settings.EMAIL_HOST}")
        self.stdout.write(f"EMAIL_PORT:          {settings.EMAIL_PORT}")
        self.stdout.write(f"EMAIL_USE_TLS:       {settings.EMAIL_USE_TLS}")
        self.stdout.write(f"EMAIL_USE_SSL:       {settings.EMAIL_USE_SSL}")
        self.stdout.write(f"EMAIL_HOST_USER:     {settings.EMAIL_HOST_USER or '(EMPTY!)'}")
        self.stdout.write(f"EMAIL_HOST_PASSWORD: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else '(EMPTY!)'}")
        self.stdout.write(f"DEFAULT_FROM_EMAIL:  {settings.DEFAULT_FROM_EMAIL or '(EMPTY!)'}")
        self.stdout.write(f"EMAIL_TIMEOUT:       {getattr(settings, 'EMAIL_TIMEOUT', 'not set')}")
        self.stdout.write(f"Sending to:          {recipient}")
        self.stdout.write("=" * 60)

        if not settings.EMAIL_HOST_USER:
            self.stderr.write(self.style.ERROR("FATAL: EMAIL_HOST_USER is empty!"))
            return

        if not settings.EMAIL_HOST_PASSWORD:
            self.stderr.write(self.style.ERROR("FATAL: EMAIL_HOST_PASSWORD is empty!"))
            return

        if settings.EMAIL_USE_TLS and settings.EMAIL_USE_SSL:
            self.stderr.write(self.style.WARNING(
                "WARNING: Both EMAIL_USE_TLS and EMAIL_USE_SSL are True! "
                "Only one should be True. For Gmail port 465, use SSL=True, TLS=False."
            ))

        self.stdout.write("\nAttempting to send test email (synchronous)...")

        try:
            result = send_mail(
                subject='PathMate Test Email',
                message='If you received this, your email configuration is working correctly!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"\nSUCCESS! Email sent. Result: {result}"))
            self.stdout.write(f"Check {recipient}'s inbox (and spam folder).")
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"\nFAILED! {type(e).__name__}: {e}"))
            self.stderr.write("\nCommon fixes:")
            self.stderr.write("  1. Wrong port/SSL combo: Use PORT=465 + SSL=True + TLS=False")
            self.stderr.write("  2. App password expired: Generate a new one at https://myaccount.google.com/apppasswords")
            self.stderr.write("  3. 2FA not enabled: Gmail App Passwords require 2-Step Verification")
