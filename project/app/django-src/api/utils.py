from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string

from .tokens import user_activation_token

def send_email(user, request, mail_subject, template_name, to_email):
    current_site = get_current_site(request)
    mail_subject = mail_subject
    if current_site.domain == 'localhost':
        port = ':1337'
        protocol ='http'
    else:
        port = ''
        protocol = 'https'
    message = render_to_string(template_name, {
        'user': '%s %s' %(user.first_name, user.last_name),
        'domain': current_site.domain,
        'port': '%s' % port,
        'protocol': protocol,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': user_activation_token.make_token(user),
        'new_email': to_email
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()