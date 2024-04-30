from django.shortcuts import render
from rest_framework import generics
from .models import Product,ProductSize
from .serializers import ProductSerializer

class ProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class DetailProductAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer