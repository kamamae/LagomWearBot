from rest_framework import serializers
from .models import Product, Size, Image, ProductImage


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image.image')
    class Meta:
        model = ProductImage
        fields = ['image']


class ProductSerializer(serializers.ModelSerializer):
    size = serializers.StringRelatedField()
    images = ProductImageSerializer(many=True, source='productimage_set')

    class Meta:
        model = Product
        fields = '__all__'

