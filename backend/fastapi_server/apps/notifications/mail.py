import os

from mailersend import emails
from structlog import get_logger

from .templates.templates import get_html_from_template
from .settings import SETTINGS

mail_from = {
    "name": "Compose Stack",
    "email": "noreply@compose-stack.com",
}
default_vars = [{"var": "support_email", "value": "noreply@compose-stack.com"}]

logger = get_logger("notifications")


def send_mail(subject, recipients, user_ids, **kwargs):
    template_path = kwargs.get("template_path")  # local template path

    if not template_path and not os.getenv("ENVIRONMENT") == "test":
        raise Exception("Cannot send email: template_path is missing")

    sender = kwargs.get("sender", mail_from)

    variables = kwargs.get("variables", {})
    html = get_html_from_template(template_path, variables)

    if SETTINGS["API_TOKEN"]:
        mail_body = {}
        mailer = emails.NewEmail(SETTINGS["API_TOKEN"])
        mailer.set_mail_from(sender, mail_body)
        mailer.set_mail_to(recipients, mail_body)
        mailer.set_subject(subject, mail_body)
        mailer.set_html_content(html, mail_body)
        mailer.send(mail_body)

    if os.getenv("ENVIRONMENT") == "dev":
        logger.info(
            "Send email",
            code="notifications-send_email",
            subject=subject,
            recipients=user_ids,
            sender=sender["email"],
            variables=variables,
            html=html,
        )
