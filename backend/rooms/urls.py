from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KosViewSet, RoomViewSet, RentalViewSet

router = DefaultRouter()
router.register(r'kos', KosViewSet, basename='kos')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'rentals', RentalViewSet, basename='rental')

urlpatterns = [
    path('', include(router.urls)),
]
