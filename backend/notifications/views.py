from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Notif
from .serializers import NotifSerializer

class NotifViewSet(viewsets.ModelViewSet):
    queryset = Notif.objects.all()
    serializer_class = NotifSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # User hanya bisa lihat notifikasi mereka sendiri
        return Notif.objects.filter(user=user)
