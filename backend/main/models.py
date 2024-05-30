from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.exceptions import ValidationError


class Profile(models.Model):
    telegram_id = models.IntegerField()
    telegram_name = models.CharField(max_length=255, default='')
    chat_id = models.IntegerField()
    payment_token = models.CharField(max_length=255, default='')

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return self.telegram_name


class Size(models.Model):
    name = models.CharField(max_length=15)

    class Meta:
        verbose_name = 'Размер'
        verbose_name_plural = 'Размеры'

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    in_stock = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Размер товара'
        verbose_name_plural = 'Размеры товара'

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"


@receiver(post_save, sender=ProductSize)
def track_stock_zero(sender, instance, **kwargs):
    if instance.quantity == 0 and instance.in_stock:
        ProductSize.objects.filter(pk=instance.pk).update(in_stock=False)


class Product(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    price = models.IntegerField()

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.name


class Image(models.Model):
    image = models.ImageField(upload_to='product_images')

    class Meta:
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'

    def __str__(self):
        return self.image.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'

    def __str__(self):
        return f"{self.product.name} - {self.image.image.name}"


class CartProduct(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('successful', 'Successful'),
        ('pending', 'Pending'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_size = models.ForeignKey(ProductSize, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')

    class Meta:
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Товары в корзине'

    def __str__(self):
        return f"{self.user.telegram_name} - {self.product.name} ({self.product_size.size.name}) ({self.quantity})"

    def update_quantity(self):
        stock = ProductSize.objects.get(id=self.product_size_id)
        stock.quantity -= self.quantity
        stock.save()

    def clean(self):
        if self.product_size and self.quantity > self.product_size.quantity:
            raise ValidationError("Выбранный размер недоступен в достаточном количестве.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Validate the instance before saving
        super().save(*args, **kwargs)


@receiver(post_save, sender=CartProduct)
def decrement_product_quantity(sender, instance, **kwargs):
    if instance.payment_status == 'successful' and instance.product_size.quantity >= instance.quantity:
        stock = ProductSize.objects.get(id=instance.product_size_id)
        stock.quantity -= instance.quantity
        stock.save()

