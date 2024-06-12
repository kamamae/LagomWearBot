from rest_framework import generics
from .models import Product, CartProduct, Profile, Size
from .serializers import (ProductSerializer, CartProductSerializer,UserSerializer,AddCartProductSerializer,
                          SizeSerializer,ProfileSerializer,EditCartSerializer, TotalPrice)
from rest_framework.response import Response
class ProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class DetailProductAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class AddToCart(generics.CreateAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = AddCartProductSerializer

class CartAPIView(generics.ListAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = CartProductSerializer
    def get_queryset(self):
        telegram_id = self.kwargs['telegram_id']
        return CartProduct.objects.filter(user__telegram_id=telegram_id)

    def create(self, request, *args, **kwargs):
        user = request.user
        product = request.data.get('product')
        product_size = request.data.get('product_size')
        try:
            cart_product = CartProduct.objects.get(user=user, product=product, product_size=product_size)
            cart_product.quantity += 1
            cart_product.save()
            serializer = self.get_serializer(cart_product)
            return Response(serializer.data)
        except CartProduct.DoesNotExist:
            # Если объекта нет, то создаем новый
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, headers=headers)

class UserAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer

class User(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer

class SizeAPIView(generics.ListAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class ProfileRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'telegram_id'

class EditQuantityAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = EditCartSerializer

class CreateProfileAPIView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserSerializer

class PriceCartAPIView(generics.ListAPIView):
    queryset = CartProduct.objects.all()
    serializer_class = TotalPrice
    def get_queryset(self):
        telegram_id = self.kwargs['telegram_id']
        return CartProduct.objects.filter(user__telegram_id=telegram_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_price = sum(item['product']['price'] * item['quantity'] for item in serializer.data)
        return Response({'total_price': total_price, 'items': serializer.data})