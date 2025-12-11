from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RFIDCard, AccessLog
from .serializers import RFIDCardSerializer, RFIDCardCreateSerializer, AccessLogSerializer, TapCardSerializer
from rooms.models import Room, Rental
from billing.models import Invoice
from notifications.models import Notif


class IsAdmin(object):
    """Mixin to check if user is admin"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class RFIDCardViewSet(viewsets.ModelViewSet):
    queryset = RFIDCard.objects.all().order_by('-registered_at')
    serializer_class = RFIDCardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RFIDCardCreateSerializer
        return RFIDCardSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return RFIDCard.objects.all().order_by('-registered_at')
        # Penyewa hanya bisa lihat kartu mereka
        return RFIDCard.objects.filter(penyewa=user).order_by('-registered_at')
    
    def perform_create(self, serializer):
        serializer.save(registered_by=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='tap')
    def tap_card(self, request):
        """
        Simulate RFID card tap for room access.
        This endpoint checks if the card is valid and grants/denies access.
        """
        serializer = TapCardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        card_id = serializer.validated_data['card_id']
        room_id = serializer.validated_data['room_id']
        
        # Get room
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({
                'status': 'denied',
                'message': 'Kamar tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if card exists
        try:
            rfid_card = RFIDCard.objects.get(card_id=card_id)
        except RFIDCard.DoesNotExist:
            # Log denied access - unknown card
            AccessLog.objects.create(
                rfid_card=None,
                room=room,
                status='denied',
                denied_reason='Kartu RFID tidak terdaftar',
                attempted_card_id=card_id
            )
            return Response({
                'status': 'denied',
                'message': 'Kartu RFID tidak terdaftar',
                'card_id': card_id
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check card status
        if rfid_card.status != 'active':
            reason = f'Kartu RFID tidak aktif (status: {rfid_card.status})'
            AccessLog.objects.create(
                rfid_card=rfid_card,
                room=room,
                status='denied',
                denied_reason=reason
            )
            return Response({
                'status': 'denied',
                'message': reason,
                'card_id': card_id
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if card belongs to this room
        if rfid_card.room_id != room_id:
            reason = 'Kartu RFID tidak terdaftar untuk kamar ini'
            AccessLog.objects.create(
                rfid_card=rfid_card,
                room=room,
                status='denied',
                denied_reason=reason
            )
            return Response({
                'status': 'denied',
                'message': reason,
                'card_id': card_id,
                'registered_room': rfid_card.room.room_number
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if tenant has active rental
        active_rental = Rental.objects.filter(
            room=room,
            penyewa=rfid_card.penyewa,
            status='active'
        ).first()
        
        if not active_rental:
            reason = 'Tidak ada penyewaan aktif untuk penghuni ini'
            AccessLog.objects.create(
                rfid_card=rfid_card,
                room=room,
                status='denied',
                denied_reason=reason
            )
            return Response({
                'status': 'denied',
                'message': reason,
                'card_id': card_id
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check for overdue payments (optional: can block access if overdue)
        overdue_invoices = Invoice.objects.filter(
            penyewa=rfid_card.penyewa,
            status='overdue'
        ).count()
        
        # Grant access
        AccessLog.objects.create(
            rfid_card=rfid_card,
            room=room,
            status='granted'
        )
        
        # Update last used timestamp
        rfid_card.last_used = timezone.now()
        rfid_card.save()
        
        # Create welcome notification
        if rfid_card.penyewa:
            Notif.objects.create(
                user=rfid_card.penyewa,
                title='Akses Berhasil',
                message=f'Selamat datang di Kamar {room.room_number}!',
                is_read=False
            )
        
        response_data = {
            'status': 'granted',
            'message': f'Akses diberikan ke Kamar {room.room_number}',
            'card_id': card_id,
            'penyewa': rfid_card.penyewa.username if rfid_card.penyewa else None,
            'room_number': room.room_number,
            'access_time': timezone.now().isoformat()
        }
        
        if overdue_invoices > 0:
            response_data['warning'] = f'Perhatian: Ada {overdue_invoices} tagihan tertunggak'
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='toggle-status')
    def toggle_status(self, request, pk=None):
        """Toggle card status between active and inactive"""
        card = self.get_object()
        if card.status == 'active':
            card.status = 'inactive'
        else:
            card.status = 'active'
        card.save()
        return Response({
            'message': f'Status kartu berhasil diubah menjadi {card.status}',
            'status': card.status
        })
    
    @action(detail=True, methods=['post'], url_path='block')
    def block_card(self, request, pk=None):
        """Block a card"""
        card = self.get_object()
        card.status = 'blocked'
        card.save()
        return Response({
            'message': 'Kartu berhasil diblokir',
            'status': card.status
        })


class AccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing access logs (read-only)"""
    queryset = AccessLog.objects.all().order_by('-access_time')
    serializer_class = AccessLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = AccessLog.objects.all().order_by('-access_time')
        
        # Filter by query params
        room_id = self.request.query_params.get('room', None)
        status_filter = self.request.query_params.get('status', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if date_from:
            queryset = queryset.filter(access_time__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(access_time__date__lte=date_to)
        
        # Penyewa hanya bisa lihat log mereka sendiri
        if user.role == 'penyewa':
            queryset = queryset.filter(rfid_card__penyewa=user)
        
        return queryset
    
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Get access log statistics"""
        from django.db.models import Count
        from datetime import timedelta
        
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        queryset = self.get_queryset()
        
        stats = {
            'total_access': queryset.count(),
            'granted_today': queryset.filter(
                access_time__date=today,
                status='granted'
            ).count(),
            'denied_today': queryset.filter(
                access_time__date=today,
                status='denied'
            ).count(),
            'total_this_week': queryset.filter(
                access_time__date__gte=week_ago
            ).count(),
            'by_status': list(queryset.values('status').annotate(count=Count('id'))),
        }
        
        return Response(stats)
