from django.contrib.auth.hashers import make_password

from django.contrib import admin
from django.conf.urls import url, include

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token


from .views import SignupView, SignupActivateView, GetUserView, ProductsView, ProductDetailView, SaveSettingsView, ChangePasswordView, PasswordResetView, PasswordResetActivateView, ChangeEmailView, ChangeEmailActivateView, PaymentPaypalView, LastOrdersView, PaymentTransferView



urlpatterns = [
    url(r'^signin/$', obtain_jwt_token),
    url(r'^getuser/$', GetUserView.as_view()),
    url(r'^signup/$', SignupView.as_view()),
    url(r'^refreshtoken/$', refresh_jwt_token),
    # url(r'^signin/$', SigninView.as_view()),
    url(r'^signup/activate/$', SignupActivateView.as_view()),
    url(r'^savesettings/$', SaveSettingsView.as_view()),
    url(r'^changepassword/$', ChangePasswordView.as_view()),
    url(r'^passwordreset/$', PasswordResetView.as_view()),
    url(r'^passwordreset/activate/$', PasswordResetActivateView.as_view()),
    url(r'^changeemail/$', ChangeEmailView.as_view()),
    url(r'^changeemail/activate/$', ChangeEmailActivateView.as_view()),
    url(r'^products/$', ProductsView.as_view()),
    url(r'^product/(?P<pk>\d+)/$', ProductDetailView.as_view()),
    url(r'^paymentpaypal/$', PaymentPaypalView.as_view()),
    url(r'^paymenttransfer/$', PaymentTransferView.as_view()),
    url(r'^lastorders/$', LastOrdersView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
