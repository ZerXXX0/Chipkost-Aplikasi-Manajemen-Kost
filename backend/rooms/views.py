from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Kos, Room, Rental
from .serializers import KosSerializer, RoomSerializer, RentalSerializer

class KosViewSet(viewsets.ModelViewSet):
    queryset = Kos.objects.all()
    serializer_class = KosSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Room.objects.all()
        kos_id = self.request.query_params.get('kos', None)
        if kos_id is not None:
            queryset = queryset.filter(kos_id=kos_id)
        return queryset

    @action(detail=False, methods=['get'], url_path='my-room')
    def my_room(self, request):
        """Get the current user's assigned room"""
        user = request.user
        try:
            room = Room.objects.filter(penyewa=user).first()
            if room:
                serializer = self.get_serializer(room)
                return Response(serializer.data)
            return Response({'detail': 'No room assigned'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Rental.objects.all()
        
        # Penyewa hanya bisa lihat rental mereka sendiri
        if user.role == 'penyewa':
            queryset = queryset.filter(penyewa=user)
        
        return queryset
