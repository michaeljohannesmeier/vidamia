import base64
from decimal import Decimal

from django.contrib.auth.hashers import make_password, check_password
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from django.core.mail import EmailMessage

from rest_framework import serializers

from api.models import Product, Order, OrderedProduct
from .tokens import user_activation_token
from django.contrib.auth import get_user_model;
User = get_user_model();


import requests
import time


class UserSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, allow_blank=False, max_length=100)
    first_name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    last_name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    street = serializers.CharField(required=True, allow_blank=False, max_length=100)
    zipcode = serializers.CharField(required=True, allow_blank=False, max_length=100)
    city = serializers.CharField(required=True, allow_blank=False, max_length=100)
    email_confirmed = serializers.BooleanField(required=True)


class SignupSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, allow_blank=False, max_length=100)
    password = serializers.CharField(required=True, allow_blank=False, max_length=100)
    first_name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    last_name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    street = serializers.CharField(required=True, allow_blank=False, max_length=100)
    zipcode = serializers.CharField(required=True, allow_blank=False, max_length=100)
    city = serializers.CharField(required=True, allow_blank=False, max_length=100)
    country = serializers.CharField(required=True, allow_blank=False, max_length=100)

    def create(self, validated_data):
        try:
            email = validated_data['email'].strip().lower()
            password = validated_data['password']
            first_name = validated_data['first_name'].strip()
            last_name = validated_data['last_name'].strip()
            street = validated_data['street'].strip()
            zipcode = validated_data['zipcode'].strip()
            city = validated_data['city'].strip()
            country = validated_data['country'].strip()
        except:
            raise serializers.ValidationError({"server_error": ['Internal server error']})
        try:
            user = User.objects.create_user(email=email, password=password)
            user.first_name = first_name
            user.last_name=last_name
            user.street=street
            user.zipcode=zipcode
            user.city=city
            user.country = country
            user.save()
        except:
            raise serializers.ValidationError({"email_unique": ['This field must be unique']})
        try:
            message = 'There was a new user signing up'
            email = EmailMessage('New user!!', message, to=[settings.SERVICE_EMAIL])
            email.send()
        except:
            raise serializers.ValidationError({"server_error": ['Internal server error']})
        return user

        


class SaveSettingsSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, allow_blank=False, max_length=100)
    first_name = serializers.CharField(required=False, max_length=100)
    last_name = serializers.CharField(required=False, max_length=100)
    street = serializers.CharField(required=False, max_length=100)
    zipcode = serializers.CharField(required=False, max_length=100)
    city = serializers.CharField(required=False, max_length=100)

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'].strip().lower())
            user.first_name=validated_data['first_name'].strip()
            user.last_name=validated_data['last_name'].strip()
            user.street=validated_data['street'].strip()
            user.zipcode=validated_data['zipcode'].strip()
            user.city=validated_data['city'].strip()
            user.save()
            return validated_data
        except:
            raise serializers.ValidationError({"could_not_save_settings": ['Could not save settings']})

class ProductSerializer(serializers.ModelSerializer):
    image_1 = serializers.SerializerMethodField('get_image_url_1')
    image_2 = serializers.SerializerMethodField('get_image_url_2')
    image_3 = serializers.SerializerMethodField('get_image_url_3')

    def get_image_url_1(self, obj):
        return obj.image_1.url

    def get_image_url_2(self, obj):
        return obj.image_2.url

    def get_image_url_3(self, obj):
        if obj.image_3 == None:
            return ''
        else:
            return obj.image_3.url

    class Meta:
        model = Product
        fields = ('id', 'title', 'description',  'image_1', 'image_2', 'image_3', 'price', 'size_37', 'size_38', 'size_39', 'size_40', 'size_41', 'category', 'offer', 'offer_minus_percent')

class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, allow_blank=False, max_length=100)
    password_old = serializers.CharField(required=True, allow_blank=False, max_length=100)
    password_new = serializers.CharField(required=True, allow_blank=False, max_length=100)

    def validate(self, data):
        user = User.objects.get(email=data['email'].strip().lower())
        password_old = data['password_old'].strip()
        password_new = data['password_new'].strip()
        if not check_password(password_old, user.password):
            raise serializers.ValidationError({"wrong_pass": ['Could not chanage pasword. Old password is wrong.']})
        user.password = make_password(password_new)
        user.save()
        return {}


class PasswordResetActivateSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, allow_blank=False, max_length=100)
    uidb64 = serializers.CharField(required=True, allow_blank=False, max_length=100)
    token = serializers.CharField(required=True, allow_blank=False, max_length=255)

    def validate(self, data):
        uidb64 = data['uidb64']
        token = data['token']
        password = data['password']
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        if user is not None and user_activation_token.check_token(user, token):
            user.password = make_password(password)
            user.save()
            return data

class ChangeEmailSerializer(serializers.Serializer):
    oldemail = serializers.CharField(required=True, allow_blank=False, max_length=100)
    newemail = serializers.CharField(required=True, allow_blank=False, max_length=100)

class ChangeEmailActivateSerializer(serializers.Serializer):
    newemail = serializers.CharField(required=True, allow_blank=False, max_length=100)
    uidb64 = serializers.CharField(required=True, allow_blank=False, max_length=100)
    token = serializers.CharField(required=True, allow_blank=False, max_length=255)

    def validate(self, data):
        uidb64 = data['uidb64']
        token = data['token']
        newemail = data['newemail']
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        if user is not None and user_activation_token.check_token(user, token):
            try:
                user.email = newemail
                user.save()
            except:
                raise serializers.ValidationError({"account_already_exists": ['An account with that email already exists']})
            return data



class OrderedProductsSerializer(serializers.Serializer):
    product_id = serializers.CharField(required=True, allow_blank=False, max_length=100)
    title = serializers.CharField(required=True, allow_blank=False, max_length=100)
    category = serializers.CharField(required=True, allow_blank=False, max_length=100)
    size = serializers.CharField(required=True, allow_blank=False, max_length=100)
    amount = serializers.CharField(required=True, allow_blank=False, max_length=100)
    price = serializers.CharField(required=True, allow_blank=False, max_length=100)
    sub_total = serializers.CharField(required=True, allow_blank=False, max_length=100)


class PaymentPaypalSerializer(serializers.Serializer):
    order_id = serializers.CharField(required=True, allow_blank=False, max_length=255)
    total = serializers.CharField(required=True, allow_blank=False, max_length=100)
    ordered_products = OrderedProductsSerializer(many=True)

    def validate(self, data):
        try:
            paypal_order_id = data['order_id']
            total = data['total']
            user = self.context['user']
            ordered_products = data['ordered_products']
            credentials = "%s:%s" % (settings.PAYPAL_CLIENT, settings.PAYPAL_SECRET)
            encode_credential = base64.b64encode(credentials.encode('utf-8')).decode('utf-8').replace("\n", "")
            
            headers = {
                'Accept': 'application/json',
                'Authorization': 'Basic %s' % encode_credential
            }
            data = 'grant_type=client_credentials'
            auth = requests.post(settings.PAYPAL_OAUTH_API, data=data, headers=headers)

            headers = {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth.json()['access_token']
            }
            r = requests.get(settings.PAYPAL_ORDER_API + paypal_order_id, headers=headers)
            order_details = r.json()
            order_id = int(time.time())
            if paypal_order_id == order_details['id'] and total == order_details['purchase_units'][0]['amount']['value'] and order_details['status'] == 'COMPLETED':
                order = Order.objects.create(user=user, email=user.email, order_id=order_id, total=Decimal(total), first_name=user.first_name, last_name=user.last_name, street=user.street, zipcode=user.zipcode, city=user.city, payment_method='paypal', payment_order_id=paypal_order_id)
                for ordered_product in ordered_products:
                    product = Product.objects.get(id=ordered_product['product_id'])
                    old_amount = getattr(product, 'size_%s' % ordered_product['size'])
                    new_amount = old_amount - int(ordered_product['amount'])
                    setattr(product, 'size_%s' % ordered_product['size'], new_amount)
                    product.save()
                    OrderedProduct.objects.create(order=order, product=product, title=ordered_product['title'], category=ordered_product['category'], size=ordered_product['size'], amount=ordered_product['amount'], price=ordered_product['price'], sub_total=ordered_product['sub_total'])
                message = 'There is a new order'
                email = EmailMessage('New order!!', message, to=[settings.SERVICE_EMAIL])
                email.send()
                return data
        except:
            message = 'Something went wrong with a paypal payment.\nOrder_id_paypal %s\nUser email %s\nTotal %s\nPaypal order details %s' %(order_id, email, total, r.text)
            email = EmailMessage('Error with payment', message, to=[settings.SERVICE_EMAIL])
            email.send()
            raise serializers.ValidationError({"payment_error": ['Somethning went wrong with the paypal transaction']})


class PaymentTransferSerializer(serializers.Serializer):
    total = serializers.CharField(required=True, allow_blank=False, max_length=100)
    ordered_products = OrderedProductsSerializer(many=True)


    def validate(self, data):
        print('inside serializer')
        total = data['total']
        print('user')
        user = self.context['user']
        ordered_products = data['ordered_products']
        order_id = int(time.time())
        print('user')
        order = Order.objects.create(user=user, email=user.email, order_id=order_id, total=Decimal(total), first_name=user.first_name, last_name=user.last_name, street=user.street, zipcode=user.zipcode, city=user.city, payment_method='transfer', payment_order_id=order_id)
        print('user')
        for ordered_product in ordered_products:
            product = Product.objects.get(id=ordered_product['product_id'])
            old_amount = getattr(product, 'size_%s' % ordered_product['size'])
            new_amount = old_amount - int(ordered_product['amount'])
            setattr(product, 'size_%s' % ordered_product['size'], new_amount)
            product.save()
            OrderedProduct.objects.create(order=order, product=product, title=ordered_product['title'], category=ordered_product['category'], size=ordered_product['size'], amount=ordered_product['amount'], price=ordered_product['price'], sub_total=ordered_product['sub_total'])
        print('user')
        message = 'There is a new order'
        email = EmailMessage('New order!!', message, to=[settings.SERVICE_EMAIL])
        email.send()
        return data





