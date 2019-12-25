
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator
from ckeditor.fields import RichTextField

product_sizes = ['size_37', 'size_38', 'size_39', 'size_40', 'size_41']
CATEGORIES = (
        ('1BB', '1BB'),
        ('1RW', '1RW'),
        ('1YY', '1YY'),
        ('1GG', '1GG'),
        ('1PP', '1PP'),
        ('2WW', '2WW'),
        ('2MR', '2MR'),
        ('2BLBL', '2BLBL'),
        ('2BLM', '2BLM'),
        ('2PPY', '2PPY'),
        ('2PR', '2PR'),
        ('2BLP', '2BLP')
    )

COUNTRIES = (
    ('DE', 'DE'),
    ('AU', 'AU'),
    ('SE', 'SE')
)

from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(
        max_length=255,
        unique=True,
    )
    active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False) # a admin user; non super-user
    admin = models.BooleanField(default=False) # a superuser
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    street = models.CharField(max_length=100, null=True)
    zipcode = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=100, null=True)
    created = models.DateTimeField(auto_now=True, auto_now_add=False)
    modified = models.DateTimeField(auto_now_add=True, null=True, blank=False)
    email_confirmed = models.BooleanField(default=False)
    country = models.CharField(max_length=10, choices=COUNTRIES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Email & Password are required by default.

    objects = UserManager()

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):              # __unicode__ on Python 2
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.staff

    @property
    def is_admin(self):
        "Is the user a admin member?"
        return self.admin

    @property
    def is_active(self):
        "Is the user active?"
        return self.active


class Product(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    description = RichTextField(blank=False, null=False)
    image_1 = models.ImageField(upload_to = 'img')
    image_2 = models.ImageField(upload_to = 'img')
    image_3 = models.ImageField(upload_to = 'img')
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=10, choices=CATEGORIES, unique=True)
    size_37 = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    size_38 = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    size_39 = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    size_40 = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    size_41 = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    active = models.BooleanField(default=True)
    offer = models.BooleanField(default=False)
    offer_minus_percent = models.PositiveIntegerField(default=10, validators=[MinValueValidator(0)], null=True, blank=False)

    def __repr__ (self):
        return self.title

    def __str__ (self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    total = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    email = models.CharField(max_length=100, blank=False, null=False)
    first_name = models.CharField(max_length=100, blank=False, null=False)
    last_name = models.CharField(max_length=100, blank=False, null=False)
    street = models.CharField(max_length=100, blank=False, null=False)
    zipcode = models.CharField(max_length=100, blank=False, null=False)
    city = models.CharField(max_length=100, blank=False, null=False)
    payment_method = models.CharField(max_length=100, blank=False, null=False)
    payment_order_id = models.CharField(max_length=100, blank=False, null=False)
    created = models.DateTimeField(auto_now=True, auto_now_add=False)
    delivered = models.BooleanField(default=False)
    order_id = models.PositiveIntegerField(null=True, blank=False)

    def __repr__ (self):
        return '%s' % self.id

    def __str__ (self):
        return '%s' % self.id


class OrderedProduct(models.Model):
    order = models.ForeignKey(Order, null=True, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=100, blank=False, null=False)
    category = models.CharField(max_length=10, choices=CATEGORIES)
    size = models.CharField(max_length=100, blank=False, null=False)
    amount = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], null=True, blank=False)
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    sub_total = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])

    def __repr__ (self):
        return self.title

    def __str__ (self):
        return self.title

class MainPicture(models.Model):
    image = models.ImageField(upload_to = 'img')

    def __repr__ (self):
        return '%s' % self.id

    def __str__ (self):
        return '%s' % self.id
