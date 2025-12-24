from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from decimal import Decimal
from .models import Kos, Room, Rental, CctvCamera
from .serializers import KosSerializer, RoomSerializer, RentalSerializer, CctvCameraSerializer

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

    def update(self, request, *args, **kwargs):
        """
        Override update to handle rental creation/termination when penyewa changes
        """
        instance = self.get_object()
        old_penyewa_id = instance.penyewa_id
        new_penyewa_id = request.data.get('penyewa')
        
        # Convert to int or None for comparison
        if new_penyewa_id == '' or new_penyewa_id is None:
            new_penyewa_id = None
        else:
            new_penyewa_id = int(new_penyewa_id)
        
        # Check if penyewa is changing
        penyewa_changed = old_penyewa_id != new_penyewa_id
        
        # Validate: User cannot be assigned to multiple rooms
        if penyewa_changed and new_penyewa_id:
            existing_rental = Rental.objects.filter(
                penyewa_id=new_penyewa_id, 
                status='active'
            ).exclude(room=instance).first()
            
            if existing_rental:
                return Response({
                    'error': f'User sudah memiliki rental aktif di kamar {existing_rental.room.room_number}. Hapus rental tersebut terlebih dahulu sebelum assign ke kamar lain.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # If penyewa is changing, terminate ALL active rentals for this room BEFORE the update
        if penyewa_changed:
            from dateutil.relativedelta import relativedelta
            
            # Terminate ALL active rentals for this room (regardless of penyewa)
            active_rentals = Rental.objects.filter(room=instance, status='active')
            for old_rental in active_rentals:
                old_rental.status = 'terminated'
                old_rental.end_date = timezone.now().date()
                old_rental.notes = f"{old_rental.notes or ''}\n[Dihentikan] Penyewa diganti pada {timezone.now().date()}".strip()
                old_rental.save()
                print(f'[INFO] Terminated rental ID {old_rental.id} for room {instance.room_number}')
        
        # Perform the standard update
        response = super().update(request, *args, **kwargs)
        
        if penyewa_changed:
            # Create new rental if new penyewa is assigned
            if new_penyewa_id:
                from accounts.models import User
                from billing.models import Pembayaran, LaporanKeuangan
                
                new_penyewa = User.objects.get(id=new_penyewa_id)
                start_date = timezone.now().date()
                end_date = start_date + relativedelta(days=1)  # Default 1 day trial - force payment via web
                
                new_rental = Rental.objects.create(
                    room=instance,
                    penyewa=new_penyewa,
                    start_date=start_date,
                    end_date=end_date,
                    harga_bulanan=instance.price,
                    status='active',
                    notes=f'Rental baru - Assign dari admin pada {start_date}. Masa sewa 1 hari, pembayaran melalui web.'
                )
                
                # No initial payment - user must pay via web
                # Create urgent invoice for immediate payment
                from billing.models import Invoice
                import uuid
                invoice_number = f"INV-ASSIGN-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
                
                Invoice.objects.create(
                    rental=new_rental,
                    penyewa=new_penyewa,
                    invoice_number=invoice_number,
                    amount=instance.price,
                    invoice_start_date=start_date,
                    invoice_end_date=start_date + relativedelta(months=1),  # Bill for 1 month
                    tenggat=end_date,  # Due tomorrow (1 day)
                    status='unpaid',
                    notes=f'Tagihan awal sewa - Segera lakukan pembayaran melalui sistem'
                )
        
        return response

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

    @action(detail=True, methods=['post'], url_path='extend')
    def extend_rental(self, request, pk=None):
        """
        Extend rental and automatically create payment record
        Admin only
        """
        if request.user.role != 'admin':
            return Response(
                {'error': 'Hanya admin yang dapat memperpanjang sewa'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        rental = self.get_object()
        new_end_date = request.data.get('new_end_date')
        notes = request.data.get('notes', '')
        
        if not new_end_date:
            return Response(
                {'error': 'new_end_date diperlukan'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update rental
        old_end_date = rental.end_date
        rental.end_date = new_end_date
        if notes:
            rental.notes = f"{rental.notes or ''}\n[Perpanjangan] {notes}".strip()
        rental.save()
        
        # Create payment record
        from billing.models import Pembayaran, LaporanKeuangan
        from datetime import datetime
        
        try:
            # Calculate duration in months
            old_date_obj = datetime.strptime(str(old_end_date), '%Y-%m-%d')
            new_date_obj = datetime.strptime(str(new_end_date), '%Y-%m-%d')
            
            # Calculate months difference
            months_diff = (new_date_obj.year - old_date_obj.year) * 12 + (new_date_obj.month - old_date_obj.month)
            
            # If there are remaining days, round up to next month
            if new_date_obj.day > old_date_obj.day:
                months_diff += 1
            
            # Ensure minimum 1 month
            if months_diff <= 0:
                months_diff = 1
            
            # Calculate total payment amount
            jumlah_bayar = rental.harga_bulanan * months_diff
            
            # Create payment record
            pembayaran = Pembayaran.objects.create(
                penyewa=rental.penyewa,
                kamar=rental.room,
                jumlah=jumlah_bayar,
                tenggat=new_end_date,
                metode='cash',
                status='completed',
                notes=f'Perpanjangan sewa {months_diff} bulan dari {old_end_date} ke {new_end_date}. Bayar langsung ke bapa kos.',
                verified_by=request.user,
                verified_at=timezone.now()
            )
            
            # Mark related unpaid invoices as paid
            from billing.models import Invoice
            unpaid_invoices = Invoice.objects.filter(
                rental=rental,
                penyewa=rental.penyewa,
                status='unpaid'
            )
            for invoice in unpaid_invoices:
                invoice.status = 'paid'
                invoice.save()
            
            # Update financial report for current month
            try:
                bulan_date = timezone.now().date().replace(day=1)
                laporan = LaporanKeuangan.generateLaporan(bulan_date)
                print(f"[DEBUG] Laporan keuangan updated: {laporan.laporan_id}, Total pemasukan: {laporan.total_pemasukan}")
            except Exception as laporan_error:
                print(f"[WARNING] Gagal update laporan keuangan: {str(laporan_error)}")
                # Don't fail the whole transaction just because report generation failed
            
            return Response({
                'message': 'Sewa berhasil diperpanjang, pembayaran tercatat, dan laporan keuangan diperbarui',
                'rental': RentalSerializer(rental).data,
                'pembayaran_id': pembayaran.pembayaran_id,
                'jumlah_bayar': str(jumlah_bayar),
                'durasi_bulan': months_diff
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Rollback rental if payment creation fails
            rental.end_date = old_end_date
            rental.save()
            return Response(
                {'error': f'Gagal membuat record pembayaran: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CctvCameraViewSet(viewsets.ModelViewSet):
    queryset = CctvCamera.objects.all()
    serializer_class = CctvCameraSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CctvCamera.objects.all()
        kos_id = self.request.query_params.get('kos')
        if kos_id:
            queryset = queryset.filter(kos_id=kos_id)
        return queryset
