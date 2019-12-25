from django.contrib import admin
from api.models import Product, Order, OrderedProduct, MainPicture
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserAdminChangeForm, UserAdminCreationForm
from django.contrib.auth.models import Group


class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    list_display = ('email', 'admin')
    list_filter = ('admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'street', 'zipcode', 'city', 'country', 'active', 'email_confirmed', 'created', 'modified', 'admin')}),
    )
    readonly_fields = ('created', 'modified')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()



class OrderedProductInline(admin.TabularInline):
    model = OrderedProduct
    fields = ('product_id', 'title', 'category', 'size', 'amount', 'price', 'sub_total')
    extra = 0
    readonly_fields = ('product_id', 'title')
    show_change_link = True
    # def has_add_permission(self, request, obj=None):
    #     return False


class OrderAdmin(admin.ModelAdmin):
    fields = ('total', 'order_id', 'email', 'first_name', 'last_name', 'street', 'zipcode', 'city', 'payment_method', 'payment_order_id', 'created', 'delivered')
    readonly_fields = ('created', 'order_id', )
    list_display = ('id', 'total', 'delivered')
    inlines = [
        OrderedProductInline,
    ]

# class OrderedProductAdmin(admin.ModelAdmin):
#     model = OrderedProduct
#     fields = ('order', 'title', 'category', 'size', 'amount', 'price', 'sub_total')
#     list_display = ('order_id', 'title', 'sub_total')


class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'active', 'offer')
    


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(MainPicture)
# admin.site.register(OrderedProduct, OrderedProductAdmin)


