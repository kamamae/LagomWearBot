from rest_framework import generics
from .models import Product, CartProduct, Profile
from .serializers import ProductSerializer, CartProductSerializer,UserSerializer

class ProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class DetailProductAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class AddToCart(generics.CreateAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = CartProductSerializer

class CartAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = CartProductSerializer
    def get_queryset(self):
        user = self.request.user
        return CartProduct.objects.filter(user=user)

class UserAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer

class User(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer

