from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

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
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentor.email],
            html_message=html_message,
            fail_silently=True,
        )
    except Exception as e:
        print(f"Failed to send email to {mentor.email}: {e}")
