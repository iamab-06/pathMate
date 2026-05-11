import logging
import threading
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

logger = logging.getLogger(__name__)

def _send_email_async(subject, message, recipient_list, html_message):
    try:
        # Log the email config being used (mask password)
        logger.info(
            f"Attempting email send — HOST={settings.EMAIL_HOST}, "
            f"PORT={settings.EMAIL_PORT}, SSL={settings.EMAIL_USE_SSL}, "
            f"TLS={settings.EMAIL_USE_TLS}, "
            f"USER={'(set)' if settings.EMAIL_HOST_USER else '(EMPTY!)'}, "
            f"PASS={'(set)' if settings.EMAIL_HOST_PASSWORD else '(EMPTY!)'}, "
            f"TO={recipient_list}"
        )

        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.error(
                "EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is empty! "
                "Set these environment variables on your hosting platform (Render)."
            )
            return

        result = send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Email sent successfully to {recipient_list}. Result: {result}")
    except Exception as e:
        logger.error(f"Email sending FAILED to {recipient_list}: {type(e).__name__}: {e}", exc_info=True)

def send_session_request_email(mentor, mentee, message_snippet, frontend_url="https://path-mate-three.vercel.app"):
    """
    Sends an email notification to the mentor when a new session request is created.
    """
    subject = f"New Session Request from {mentee.first_name} | PathMate"
    
    context = {
        'mentor_name': mentor.first_name,
        'mentee_name': mentee.first_name,
        'message_snippet': message_snippet,
        'dashboard_url': f"{frontend_url}/requests"
    }
    
    html_message = render_to_string('emails/session_request.html', context)
    plain_message = strip_tags(html_message)
    
    # Start the email sending in a background thread
    thread = threading.Thread(
        target=_send_email_async,
        args=(subject, plain_message, [mentor.email], html_message),
        daemon=True,
    )
    thread.start()
    logger.info(f"Email thread started for mentor {mentor.email}")
