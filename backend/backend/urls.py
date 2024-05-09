"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main.views import ProductAPIView,DetailProductAPIView, CartAPIView, AddToCart, UserAPIView, User
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/products', ProductAPIView.as_view()),
    path('api/v1/products/<int:pk>', DetailProductAPIView.as_view()),
    path('api/v1/cart/<int:id>', CartAPIView().as_view()),
    path('api/v1/cart/add', AddToCart().as_view()),
    path('api/v1/profiles', UserAPIView().as_view()),
    path('api/v1/profile/<int:pk>', User.as_view()),]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)