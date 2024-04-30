from django.contrib import admin
from .models import Product,Profile,Image,Size,ProductImage,ProductSize,CartProduct

admin.site.register(Product)
admin.site.register(Profile)
admin.site.register(Image)
admin.site.register(Size)
admin.site.register(ProductImage)
admin.site.register(ProductSize)
admin.site.register(CartProduct)