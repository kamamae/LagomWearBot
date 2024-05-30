from rest_framework import serializers
from .models import Product, Size, Profile, ProductImage,ProductSize,CartProduct


class ProductSizeSerializer(serializers.ModelSerializer):
    size_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductSize
        fields = ['size_name']

    def get_size_name(self, obj):
        return obj.size.name


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image.image')
    class Meta:
        model = ProductImage
        fields = ['image']


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['name']


class ProductSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, source='productimage_set')

    class Meta:
        model = Product
        fields = '__all__'

    def get_size(self, obj):
        return [{'name': ps.size.name, 'in_stock': ps.in_stock} for ps in obj.productsize_set.all()]

class CartProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    product_size = ProductSizeSerializer()
    class Meta:
        model = CartProduct
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

