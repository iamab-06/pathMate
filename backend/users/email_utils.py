import logging
import threading
import json
import urllib.request
import urllib.error
import os
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

def _send_email_async(subject, message, recipient_list, html_message):
    try:
        logger.info(f"Attempting to send email via Brevo HTTP API to {recipient_list}")
        
        url = "https://api.brevo.com/v3/smtp/email"
        
        # We rely on the environment variable BREVO_API_KEY being set in Render
        api_key = os.getenv("BREVO_API_KEY")
        if not api_key:
            logger.error("BREVO_API_KEY environment variable is not set!")
            return
        
        payload = {
            "sender": {"email": "savagesport123@gmail.com", "name": "PathMate"},
            "to": [{"email": email} for email in recipient_list],
            "subject": subject,
            "htmlContent": html_message,
            "textContent": message
        }
        
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(
            url, 
            data=data, 
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            },
            method="POST"
        )
        
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode('utf-8')
            logger.info(f"Brevo HTTP API Email sent successfully to {recipient_list}. Response: {response_data}")
            
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        logger.error(f"Brevo HTTP API Email FAILED to {recipient_list}. Status: {e.code}, Error: {error_msg}")
    except Exception as e:
        logger.error(f"Brevo HTTP API Email FAILED to {recipient_list}: {type(e).__name__}: {e}", exc_info=True)

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
    logger.info(f"Brevo Email thread started for mentor {mentor.email}")
