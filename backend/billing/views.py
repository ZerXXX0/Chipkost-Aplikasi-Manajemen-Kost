from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
import uuid
import random
import string
from .models import Invoice, Pembayaran, LaporanKeuangan
from .serializers import InvoiceSerializer, PembayaranSerializer, LaporanKeuanganSerializer
from rooms.models import Room
from notifications.models import Notif


def generate_transaction_id():
    """Generate a unique transaction ID like Midtrans"""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TXN-{timestamp}-{random_str}"


def generate_virtual_account():
    """Generate a simulated virtual account number"""
    return ''.join(random.choices(string.digits, k=16))


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Invoice.objects.all()
        
        # Penyewa hanya bisa lihat invoice mereka sendiri
        if user.role == 'penyewa':
            queryset = queryset.filter(penyewa=user)
        
        return queryset


class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all()
    serializer_class = PembayaranSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Pembayaran.objects.all()
        
        # Penyewa hanya bisa lihat pembayaran mereka sendiri
        if user.role == 'penyewa':
            queryset = queryset.filter(penyewa=user)
        
        return queryset
    
    @action(detail=False, methods=['post'], url_path='create-transaction')
    def create_transaction(self, request):
        """
        Create a payment transaction (simulating Midtrans Snap API).
        This creates a pending payment record and returns payment details.
        """
        invoice_id = request.data.get('invoice_id')
        metode = request.data.get('metode', 'bank_transfer')
        
        if not invoice_id:
            return Response({
                'error': 'invoice_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the invoice
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return Response({
                'error': 'Invoice tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if invoice is already paid
        if invoice.status == 'paid':
            return Response({
                'error': 'Invoice sudah dibayar'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user owns this invoice (for penyewa)
        if request.user.role == 'penyewa' and invoice.penyewa != request.user:
            return Response({
                'error': 'Tidak diizinkan membayar invoice ini'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate transaction details
        transaction_id = generate_transaction_id()
        virtual_account = generate_virtual_account()
        
        # Get room from invoice's rental
        room = invoice.rental.room if invoice.rental else None
        
        # Create payment record with pending status
        pembayaran = Pembayaran.objects.create(
            penyewa=invoice.penyewa,
            kamar=room,
            jumlah=invoice.amount,
            tenggat=invoice.tenggat,
            metode=metode,
            status='pending',
            transaction_id=transaction_id,
            notes=f'Pembayaran untuk Invoice #{invoice.invoice_number}'
        )
        
        # Generate payment instructions based on method
        payment_instructions = {}
        if metode == 'bank_transfer':
            payment_instructions = {
                'type': 'bank_transfer',
                'bank': 'BCA',
                'virtual_account': virtual_account,
                'bank_name': 'Bank Central Asia',
                'instructions': [
                    '1. Login ke m-BCA atau klik BCA',
                    '2. Pilih menu Transfer > Virtual Account',
                    f'3. Masukkan nomor VA: {virtual_account}',
                    f'4. Konfirmasi jumlah: Rp {int(invoice.amount):,}'.replace(',', '.'),
                    '5. Masukkan PIN dan selesaikan pembayaran'
                ]
            }
        elif metode == 'qris':
            payment_instructions = {
                'type': 'qris',
                'qr_code': f'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAYMENT-{transaction_id}',
                'instructions': [
                    '1. Buka aplikasi e-wallet atau mobile banking',
                    '2. Pilih menu Scan QR / QRIS',
                    '3. Scan kode QR yang ditampilkan',
                    f'4. Konfirmasi pembayaran Rp {int(invoice.amount):,}'.replace(',', '.'),
                    '5. Masukkan PIN dan selesaikan'
                ]
            }
        elif metode == 'e_wallet':
            payment_instructions = {
                'type': 'e_wallet',
                'wallet': 'GoPay',
                'phone_number': '081234567890',
                'instructions': [
                    '1. Buka aplikasi Gojek',
                    '2. Pilih menu GoPay > Bayar',
                    f'3. Masukkan kode bayar: {transaction_id}',
                    f'4. Konfirmasi pembayaran Rp {int(invoice.amount):,}'.replace(',', '.'),
                    '5. Masukkan PIN dan selesaikan'
                ]
            }
        else:  # cash
            payment_instructions = {
                'type': 'cash',
                'instructions': [
                    '1. Datang ke kantor pengelola kos',
                    '2. Sebutkan nomor kamar dan nama Anda',
                    f'3. Bayar tunai sebesar Rp {int(invoice.amount):,}'.replace(',', '.'),
                    '4. Minta bukti pembayaran',
                    '5. Simpan bukti pembayaran dengan baik'
                ]
            }
        
        # Calculate expiry time (24 hours from now)
        expiry_time = timezone.now() + timezone.timedelta(hours=24)
        
        return Response({
            'success': True,
            'transaction_id': transaction_id,
            'pembayaran_id': pembayaran.pembayaran_id,
            'invoice_id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'amount': float(invoice.amount),
            'metode': metode,
            'status': 'pending',
            'expiry_time': expiry_time.isoformat(),
            'payment_instructions': payment_instructions,
            'created_at': pembayaran.tgl_bayar.isoformat()
        })
    
    @action(detail=False, methods=['post'], url_path='confirm-payment')
    def confirm_payment(self, request):
        """
        Confirm a payment (simulating Midtrans webhook/callback).
        This marks the payment as completed and updates the invoice status.
        """
        transaction_id = request.data.get('transaction_id')
        
        if not transaction_id:
            return Response({
                'error': 'transaction_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the payment
        try:
            pembayaran = Pembayaran.objects.get(transaction_id=transaction_id)
        except Pembayaran.DoesNotExist:
            return Response({
                'error': 'Transaksi tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already completed
        if pembayaran.status == 'completed':
            return Response({
                'error': 'Transaksi sudah selesai'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Update payment status
            pembayaran.status = 'completed'
            pembayaran.verified_at = timezone.now()
            pembayaran.save()
            
            # Find and update the related invoice
            # Get invoice from the payment notes or find by penyewa and amount
            invoice = Invoice.objects.filter(
                penyewa=pembayaran.penyewa,
                amount=pembayaran.jumlah,
                status__in=['unpaid', 'pending', 'overdue']
            ).first()
            
            if invoice:
                invoice.status = 'paid'
                invoice.save()
            
            # Create success notification
            if pembayaran.penyewa:
                Notif.objects.create(
                    user=pembayaran.penyewa,
                    title='Pembayaran Berhasil',
                    message=f'Pembayaran sebesar Rp {int(pembayaran.jumlah):,} telah dikonfirmasi. Terima kasih!'.replace(',', '.'),
                    is_read=False
                )
        
        return Response({
            'success': True,
            'message': 'Pembayaran berhasil dikonfirmasi',
            'transaction_id': transaction_id,
            'pembayaran_id': pembayaran.pembayaran_id,
            'status': 'completed',
            'verified_at': pembayaran.verified_at.isoformat(),
            'invoice_status': invoice.status if invoice else None
        })
    
    @action(detail=True, methods=['post'], url_path='verify')
    def verify_payment(self, request, pk=None):
        """
        Admin verifies a payment manually.
        """
        if request.user.role != 'admin':
            return Response({
                'error': 'Hanya admin yang dapat memverifikasi pembayaran'
            }, status=status.HTTP_403_FORBIDDEN)
        
        pembayaran = self.get_object()
        
        if pembayaran.status == 'completed':
            return Response({
                'error': 'Pembayaran sudah diverifikasi'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            pembayaran.status = 'completed'
            pembayaran.verified_by = request.user
            pembayaran.verified_at = timezone.now()
            pembayaran.save()
            
            # Update related invoice
            invoice = Invoice.objects.filter(
                penyewa=pembayaran.penyewa,
                amount=pembayaran.jumlah,
                status__in=['unpaid', 'pending', 'overdue']
            ).first()
            
            if invoice:
                invoice.status = 'paid'
                invoice.save()
            
            # Notify penyewa
            if pembayaran.penyewa:
                Notif.objects.create(
                    user=pembayaran.penyewa,
                    title='Pembayaran Diverifikasi',
                    message=f'Pembayaran Anda sebesar Rp {int(pembayaran.jumlah):,} telah diverifikasi oleh admin.'.replace(',', '.'),
                    is_read=False
                )
        
        return Response({
            'success': True,
            'message': 'Pembayaran berhasil diverifikasi',
            'pembayaran_id': pembayaran.pembayaran_id,
            'verified_by': request.user.username,
            'verified_at': pembayaran.verified_at.isoformat()
        })
    
    @action(detail=False, methods=['get'], url_path='pending')
    def pending_payments(self, request):
        """Get all pending payments for admin verification"""
        if request.user.role != 'admin':
            return Response({
                'error': 'Hanya admin yang dapat melihat pembayaran pending'
            }, status=status.HTTP_403_FORBIDDEN)
        
        pending = Pembayaran.objects.filter(status='pending').order_by('-tgl_bayar')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)


class LaporanKeuanganViewSet(viewsets.ModelViewSet):
    queryset = LaporanKeuangan.objects.all()
    serializer_class = LaporanKeuanganSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = LaporanKeuangan.objects.all()
        
        # Hanya admin yang bisa lihat laporan keuangan
        if user.role != 'admin':
            queryset = queryset.none()
        
        return queryset
