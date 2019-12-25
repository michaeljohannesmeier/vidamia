from django.shortcuts import render

from api.models import Product, product_sizes, MainPicture, Order
from api.serializers import SignupSerializer, ProductSerializer, SaveSettingsSerializer, ChangePasswordSerializer, PasswordResetActivateSerializer, ChangeEmailSerializer, ChangeEmailActivateSerializer, PaymentPaypalSerializer, UserSerializer, PaymentTransferSerializer
from django.http import Http404
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import mixins, generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions


from .tokens import user_activation_token
from .utils import send_email

from django.contrib.auth import get_user_model;
User = get_user_model();





from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import ObtainJSONWebToken, JSONWebTokenAPIView
from rest_framework_jwt.serializers import RefreshJSONWebTokenSerializer
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


class SignupView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_email(
                user,
                request, 'Activate your vidamia account.',
                'signup_activate.html',
                user.email)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignupActivateView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        uidb64 = request.data['uidb64']
        token = request.data['token']
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(id=uid)
        if user is not None and user_activation_token.check_token(user, token):
            user.email_confirmed = True
            user.save()
            return Response({'email': user.email}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetUserView(APIView):
    
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# class SigninView(APIView):

#     authentication_classes = ()
#     permission_classes = ()
    
#     def post(self, request, format=None):
#         serializer = SigninSerializer(data=request.data)
#         if serializer.is_valid():
#             user_data = serializer.data
#             del user_data['password']
#             return Response(user_data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductsView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, format=None):
        available_products = []
        products = Product.objects.filter(active=True)
        for product in products:
            sum_available = 0
            for size in product_sizes:
                sum_available += getattr(product, size)
            if sum_available > 0:
                available_products.append(product)
        serializer = ProductSerializer(available_products, many=True)
        main_pictures = MainPicture.objects.all()
        main_picture_urls = []
        for main_picture in main_pictures:
            main_picture_urls.append(main_picture.image.url)
        return Response({'products': serializer.data, 'main_pictures': main_picture_urls}, status=status.HTTP_200_OK)

class ProductDetailView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except:
            raise Http404

    def get(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

class SaveSettingsView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = SaveSettingsSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(user, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            return Response({}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        try:
            send_email(
                request.user,
                request,
                'Reset your password',
                'reset_password.html',
                user.email)
            return Response({}, status=status.HTTP_200_OK)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetActivateView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = PasswordResetActivateSerializer(data=request.data)
        if serializer.is_valid():
            return Response({}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeEmailView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = ChangeEmailSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['oldemail'].strip())
            send_email(
                user,
                request,
                'Change email',
                'change_email.html',
                serializer.validated_data['newemail'].strip())
            return Response({}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeEmailActivateView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        serializer = ChangeEmailActivateSerializer(data=request.data)
        if serializer.is_valid():
            return Response({'email': serializer.validated_data['newemail']}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentPaypalView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = PaymentPaypalSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            return Response({}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentTransferView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def post(self, request, format=None):
        serializer = PaymentTransferSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            return Response({}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LastOrdersView(APIView):

    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = ()

    def get(self, request, format=None):
        print('hkere wer are')
        try:
            email = request.user.email
            orders = Order.objects.filter(email=email).order_by('-created')
            last_orders = []
            for order in orders:
                last_order = {}
                last_order['order_id'] = order.order_id
                last_order['total'] = order.total
                last_order['first_name'] = order.first_name
                last_order['last_name'] = order.last_name
                last_order['street'] = order.street
                last_order['zipcode'] = order.zipcode
                last_order['city'] = order.city
                last_order['created'] = order.created
                last_order['payment_method'] = order.payment_method
                last_order['ordered_products'] = []
                ordered_products = order.orderedproduct_set.all()
                for ordered_product in ordered_products:
                    last_ordered_product = {}
                    last_ordered_product['title'] = ordered_product.title
                    last_ordered_product['size'] = ordered_product.size
                    last_ordered_product['amount'] = ordered_product.amount
                    last_ordered_product['price'] = ordered_product.price
                    last_ordered_product['sub_total'] = ordered_product.sub_total
                    last_order['ordered_products'].append(last_ordered_product)
                last_orders.append(last_order)
            return Response(last_orders, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


