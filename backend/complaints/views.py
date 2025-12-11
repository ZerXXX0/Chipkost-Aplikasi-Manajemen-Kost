from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Kerusakan
from .serializers import KerusakanSerializer

class KerusakanViewSet(viewsets.ModelViewSet):
    queryset = Kerusakan.objects.all()
    serializer_class = KerusakanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Kerusakan.objects.all()
        
        # Penyewa hanya bisa lihat laporan kerusakan mereka sendiri
        if user.role == 'penyewa':
            queryset = queryset.filter(penyewa=user)
        
        return queryset
    
    def perform_create(self, serializer):
        # Auto-set penyewa from current user
        serializer.save(penyewa=self.request.user)
