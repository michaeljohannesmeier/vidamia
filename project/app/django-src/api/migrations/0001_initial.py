# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-07-14 12:23
from __future__ import unicode_literals

import ckeditor.fields
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('active', models.BooleanField(default=True)),
                ('staff', models.BooleanField(default=False)),
                ('admin', models.BooleanField(default=False)),
                ('first_name', models.CharField(max_length=100, null=True)),
                ('last_name', models.CharField(max_length=100, null=True)),
                ('street', models.CharField(max_length=100, null=True)),
                ('zipcode', models.CharField(max_length=100, null=True)),
                ('city', models.CharField(max_length=100, null=True)),
                ('created', models.DateTimeField(auto_now=True)),
                ('modified', models.DateTimeField(auto_now_add=True, null=True)),
                ('email_confirmed', models.BooleanField(default=False)),
                ('country', models.CharField(choices=[('DE', 'DE'), ('AU', 'AU'), ('SE', 'SE')], max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MainPicture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='img')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0)])),
                ('email', models.CharField(max_length=100)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('street', models.CharField(max_length=100)),
                ('zipcode', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('payment_method', models.CharField(max_length=100)),
                ('payment_order_id', models.CharField(max_length=100)),
                ('created', models.DateTimeField(auto_now=True)),
                ('delivered', models.BooleanField(default=False)),
                ('order_id', models.PositiveIntegerField(null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderedProduct',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('category', models.CharField(choices=[('1BB', '1BB'), ('1RW', '1RW'), ('1YY', '1YY'), ('1GG', '1GG'), ('1PP', '1PP'), ('2WW', '2WW'), ('2MR', '2MR'), ('2BLBL', '2BLBL'), ('2BLM', '2BLM'), ('2PPY', '2PPY'), ('2PR', '2PR')], max_length=10)),
                ('size', models.CharField(max_length=100)),
                ('amount', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('price', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0)])),
                ('sub_total', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0)])),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Order')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', ckeditor.fields.RichTextField()),
                ('image_1', models.ImageField(upload_to='img')),
                ('image_2', models.ImageField(upload_to='img')),
                ('image_3', models.ImageField(upload_to='img')),
                ('price', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0)])),
                ('category', models.CharField(choices=[('1BB', '1BB'), ('1RW', '1RW'), ('1YY', '1YY'), ('1GG', '1GG'), ('1PP', '1PP'), ('2WW', '2WW'), ('2MR', '2MR'), ('2BLBL', '2BLBL'), ('2BLM', '2BLM'), ('2PPY', '2PPY'), ('2PR', '2PR')], max_length=10, unique=True)),
                ('size_37', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('size_38', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('size_39', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('size_40', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('size_41', models.PositiveIntegerField(default=0, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.AddField(
            model_name='orderedproduct',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Product'),
        ),
    ]
