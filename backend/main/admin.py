from django.contrib import admin
from .models import Product,Profile,Cart,Image,Size,ProductImage

admin.site.register(Product)
admin.site.register(Profile)
admin.site.register(Cart)
admin.site.register(Image)
admin.site.register(Size)
admin.site.register(ProductImage)