from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
import uuid
import random
import string
import midtransclient
import requests
import base64
from dateutil.relativedelta import relativedelta
from .models import Invoice, Pembayaran, LaporanKeuangan
from .serializers import InvoiceSerializer, PembayaranSerializer, LaporanKeuanganSerializer
from rooms.models import Room, Rental
from notifications.models import Notif


def generate_order_id():
    """Generate a unique order ID for Midtrans"""
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"CHIPKOST-{timestamp}-{random_str}"


# Initialize Midtrans Snap client
def get_snap_client():
    snap = midtransclient.Snap(
        is_production=settings.MIDTRANS_IS_PRODUCTION,
        server_key=settings.MIDTRANS_SERVER_KEY
    )
    return snap


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
    
    @action(detail=True, methods=['get'], url_path='export')
    def export_invoice(self, request, pk=None):
        """Export invoice as HTML/PDF for printing"""
        invoice = self.get_object()
        
        # Check if user owns this invoice (for penyewa)
        if request.user.role == 'penyewa' and invoice.penyewa != request.user:
            return Response({
                'error': 'Tidak diizinkan mengakses invoice ini'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get related rental and room info
        rental = invoice.rental
        room = rental.room
        kos = room.kos
        
        # Prepare invoice data
        context = {
            'invoice': invoice,
            'rental': rental,
            'room': room,
            'kos': kos,
            'penyewa': invoice.penyewa,
            'created_date': timezone.now(),
        }
        
        # Generate HTML
        html_content = f"""
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {invoice.invoice_number}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }}
        .invoice-container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: start;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .company-info h1 {{
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 5px;
        }}
        .company-info p {{
            color: #666;
            font-size: 14px;
        }}
        .invoice-title {{
            text-align: right;
        }}
        .invoice-title h2 {{
            color: #1f2937;
            font-size: 32px;
            margin-bottom: 5px;
        }}
        .invoice-number {{
            color: #666;
            font-size: 14px;
        }}
        .details-section {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }}
        .detail-box {{
            flex: 1;
        }}
        .detail-box h3 {{
            color: #1f2937;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-weight: 600;
        }}
        .detail-box p {{
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }}
        .detail-box strong {{
            color: #1f2937;
        }}
        .invoice-table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }}
        .invoice-table thead {{
            background: #f9fafb;
        }}
        .invoice-table th {{
            padding: 12px;
            text-align: left;
            font-size: 12px;
            color: #1f2937;
            text-transform: uppercase;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
        }}
        .invoice-table td {{
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #666;
        }}
        .text-right {{
            text-align: right;
        }}
        .summary {{
            margin-left: auto;
            width: 300px;
        }}
        .summary-row {{
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }}
        .summary-row.total {{
            border-top: 2px solid #e5e7eb;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        }}
        .status-badge {{
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }}
        .status-paid {{
            background: #dcfce7;
            color: #16a34a;
        }}
        .status-unpaid {{
            background: #fee2e2;
            color: #dc2626;
        }}
        .status-overdue {{
            background: #fef3c7;
            color: #ca8a04;
        }}
        .footer {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 12px;
        }}
        .notes {{
            background: #f9fafb;
            padding: 15px;
            border-left: 3px solid #2563eb;
            margin-top: 20px;
        }}
        .notes h4 {{
            color: #1f2937;
            font-size: 14px;
            margin-bottom: 8px;
        }}
        .notes p {{
            color: #666;
            font-size: 13px;
            line-height: 1.6;
        }}
        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            .invoice-container {{
                box-shadow: none;
                padding: 20px;
            }}
            .no-print {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>ChipKost</h1>
                <p>{kos.name}</p>
                <p>{kos.address if kos.address else 'Alamat Kos'}</p>
            </div>
            <div class="invoice-title">
                <h2>INVOICE</h2>
                <p class="invoice-number">{invoice.invoice_number}</p>
                <p class="invoice-number">{invoice.created_at.strftime('%d %B %Y')}</p>
            </div>
        </div>
        
        <div class="details-section">
            <div class="detail-box">
                <h3>Tagihan Untuk:</h3>
                <p><strong>{invoice.penyewa.get_full_name() if invoice.penyewa.get_full_name() else invoice.penyewa.username}</strong></p>
                <p>{invoice.penyewa.email}</p>
                <p>{invoice.penyewa.phone if hasattr(invoice.penyewa, 'phone') and invoice.penyewa.phone else '-'}</p>
            </div>
            <div class="detail-box">
                <h3>Detail Sewa:</h3>
                <p><strong>Kamar:</strong> {room.room_number}</p>
                <p><strong>Kos:</strong> {kos.name}</p>
                <p><strong>Periode:</strong> {invoice.invoice_start_date.strftime('%d %b %Y') if invoice.invoice_start_date else '-'} - {invoice.invoice_end_date.strftime('%d %b %Y') if invoice.invoice_end_date else '-'}</p>
                <p><strong>Jatuh Tempo:</strong> {invoice.tenggat.strftime('%d %B %Y') if invoice.tenggat else '-'}</p>
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th>Periode</th>
                    <th class="text-right">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Sewa Kamar {room.room_number}</strong><br>
                        <span style="font-size: 12px; color: #999;">Tagihan bulanan kos</span>
                    </td>
                    <td>
                        {invoice.invoice_start_date.strftime('%d %b %Y') if invoice.invoice_start_date else '-'} - {invoice.invoice_end_date.strftime('%d %b %Y') if invoice.invoice_end_date else '-'}
                    </td>
                    <td class="text-right"><strong>Rp {invoice.amount:,.0f}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>Rp {invoice.amount:,.0f}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>Rp {invoice.amount:,.0f}</span>
            </div>
            <div class="summary-row" style="margin-top: 15px;">
                <span>Status:</span>
                <span class="status-badge status-{invoice.status}">
                    {invoice.get_status_display()}
                </span>
            </div>
        </div>
        
        {f'''
        <div class="notes">
            <h4>Catatan:</h4>
            <p>{invoice.notes}</p>
        </div>
        ''' if invoice.notes else ''}
        
        <div class="footer">
            <p>Invoice ini digenerate secara otomatis oleh sistem ChipKost</p>
            <p>Terima kasih atas kepercayaan Anda</p>
        </div>
    </div>
    
    <script>
        // Auto print dialog for user convenience
        window.onload = function() {{
            // You can uncomment this to auto-open print dialog
            // window.print();
        }}
    </script>
</body>
</html>
        """
        
        return HttpResponse(html_content, content_type='text/html')


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
    
    @action(detail=False, methods=['post'], url_path='create-snap-transaction')
    def create_snap_transaction(self, request):
        """
        Create a Midtrans Snap transaction for multi-month payment.
        Supports payment periods: 1, 6, or 12 months.
        """
        rental_id = request.data.get('rental_id')
        payment_months = int(request.data.get('payment_months', 1))
        
        # Validate payment months
        if payment_months not in [1, 6, 12]:
            return Response({
                'error': 'payment_months harus 1, 6, atau 12'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not rental_id:
            return Response({
                'error': 'rental_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the rental
        try:
            rental = Rental.objects.get(id=rental_id)
        except Rental.DoesNotExist:
            return Response({
                'error': 'Rental tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user owns this rental (for penyewa)
        if request.user.role == 'penyewa' and rental.penyewa != request.user:
            return Response({
                'error': 'Tidak diizinkan melakukan pembayaran ini'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check for existing pending payment for same rental/user within last 5 minutes
        # to prevent duplicate transactions from double-clicks
        five_minutes_ago = timezone.now() - timezone.timedelta(minutes=5)
        existing_pending = Pembayaran.objects.filter(
            penyewa=request.user,
            kamar=rental.room,
            status='pending',
            tgl_bayar__gte=five_minutes_ago
        ).first()
        
        if existing_pending:
            # Try to get a new snap token for the existing order
            try:
                snap = get_snap_client()
                # Get status first to check if order still valid
                status_response = snap.transactions.status(existing_pending.transaction_id)
                
                if status_response.get('transaction_status') in ['pending', 'authorize']:
                    # Order still valid, return redirect URL
                    redirect_url = f"https://app.sandbox.midtrans.com/snap/v2/vtweb/{existing_pending.transaction_id}"
                    existing_invoice = Invoice.objects.filter(
                        invoice_number=existing_pending.transaction_id
                    ).first()
                    return Response({
                        'success': True,
                        'snap_token': None,
                        'redirect_url': redirect_url,
                        'order_id': existing_pending.transaction_id,
                        'pembayaran_id': existing_pending.pembayaran_id,
                        'invoice_id': existing_invoice.id if existing_invoice else None,
                        'amount': float(existing_pending.jumlah),
                        'payment_months': payment_months,
                        'message': 'Transaksi pending sudah ada. Melanjutkan transaksi sebelumnya...',
                        'existing': True
                    })
                else:
                    # Order expired or failed, cancel it and create new
                    existing_pending.status = 'cancelled'
                    existing_pending.save()
            except Exception as e:
                print(f"[DEBUG] Error checking existing order: {e}")
                # Order might not exist in Midtrans anymore, cancel and create new
                existing_pending.status = 'cancelled'
                existing_pending.save()
        
        # Calculate total amount based on payment months
        monthly_price = float(rental.harga_bulanan)
        total_amount = int(monthly_price * payment_months)
        
        # Generate order ID
        order_id = generate_order_id()
        
        # Calculate period dates
        # Start from current end_date if exists and not expired, otherwise start today
        today = timezone.now().date()
        if rental.end_date and rental.end_date >= today:
            # Extend from current end_date
            start_date = rental.end_date
            end_date = start_date + relativedelta(months=payment_months)
        else:
            # Start fresh from today
            start_date = today
            end_date = start_date + relativedelta(months=payment_months)
        
        # Prepare Midtrans transaction data
        transaction_params = {
            'transaction_details': {
                'order_id': order_id,
                'gross_amount': total_amount
            },
            'customer_details': {
                'first_name': request.user.first_name or request.user.username,
                'last_name': request.user.last_name or '',
                'email': request.user.email or f'{request.user.username}@chipkost.com',
                'phone': getattr(request.user, 'phone_number', '') or '08123456789'
            },
            'item_details': [{
                'id': f'SEWA-{rental.room.room_number}',
                'price': int(monthly_price),
                'quantity': payment_months,
                'name': f'Sewa Kamar {rental.room.room_number} ({payment_months} bulan)'
            }],
            'callbacks': {
                'finish': f'{settings.CORS_ALLOWED_ORIGINS[0]}/penyewa/pembayaran'
            }
        }
        
        try:
            # Create Snap transaction
            snap = get_snap_client()
            print(f"[DEBUG] Midtrans Server Key: {settings.MIDTRANS_SERVER_KEY[:20]}...")
            print(f"[DEBUG] Is Production: {settings.MIDTRANS_IS_PRODUCTION}")
            print(f"[DEBUG] Transaction params: {transaction_params}")
            snap_response = snap.create_transaction(transaction_params)
            
            # Create pending payment record
            pembayaran = Pembayaran.objects.create(
                penyewa=request.user,
                kamar=rental.room,
                jumlah=total_amount,
                tenggat=end_date,
                metode='midtrans',
                status='pending',
                transaction_id=order_id,
                notes=f'Pembayaran Sewa {payment_months} bulan - Kamar {rental.room.room_number} (Periode: {start_date.strftime("%d/%m/%Y")} - {end_date.strftime("%d/%m/%Y")})'
            )
            
            # Create invoice for this payment
            invoice = Invoice.objects.create(
                rental=rental,
                penyewa=request.user,
                invoice_number=order_id,
                amount=total_amount,
                invoice_start_date=start_date,
                invoice_end_date=end_date,
                tenggat=start_date + relativedelta(days=1),  # Due tomorrow
                status='unpaid',
                notes=f'Invoice untuk pembayaran {payment_months} bulan'
            )
            
            return Response({
                'success': True,
                'snap_token': snap_response['token'],
                'redirect_url': snap_response['redirect_url'],
                'order_id': order_id,
                'pembayaran_id': pembayaran.pembayaran_id,
                'invoice_id': invoice.id,
                'amount': total_amount,
                'payment_months': payment_months,
                'period_start': start_date.isoformat(),
                'period_end': end_date.isoformat(),
                'room_number': rental.room.room_number,
                'client_key': settings.MIDTRANS_CLIENT_KEY
            })
            
        except Exception as e:
            return Response({
                'error': f'Gagal membuat transaksi Midtrans: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='midtrans-notification')
    def midtrans_notification(self, request):
        """
        Handle Midtrans payment notification webhook.
        This is called by Midtrans when payment status changes.
        """
        order_id = request.data.get('order_id')
        transaction_status = request.data.get('transaction_status')
        fraud_status = request.data.get('fraud_status')
        
        if not order_id:
            return Response({'error': 'order_id required'}, status=400)
        
        # Find payment by order_id
        try:
            pembayaran = Pembayaran.objects.get(transaction_id=order_id)
        except Pembayaran.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)
        
        # Find invoice
        invoice = Invoice.objects.filter(invoice_number=order_id).first()
        
        # Update status based on Midtrans notification
        with transaction.atomic():
            if transaction_status in ['capture', 'settlement']:
                if fraud_status == 'accept' or fraud_status is None:
                    pembayaran.status = 'completed'
                    pembayaran.verified_at = timezone.now()
                    
                    # Mark the main invoice as paid
                    if invoice:
                        invoice.status = 'paid'
                        invoice.save()
                        
                        # Update rental end_date if exists
                        if invoice.rental and invoice.invoice_end_date:
                            invoice.rental.end_date = invoice.invoice_end_date
                            invoice.rental.save()
                            
                            # Cancel/supersede all other invoices that are covered by this payment
                            # This includes:
                            # 1. Unpaid invoices with periods within the new paid period
                            # 2. Paid extension invoices with periods within the new paid period
                            other_invoices = Invoice.objects.filter(
                                rental=invoice.rental,
                                penyewa=pembayaran.penyewa,
                            ).exclude(id=invoice.id).exclude(status='cancelled')
                            
                            print(f'[DEBUG] Found {other_invoices.count()} other invoices to check for rental {invoice.rental_id}')
                            
                            for other_inv in other_invoices:
                                print(f'[DEBUG] Checking invoice {other_inv.invoice_number} (status: {other_inv.status})')
                                # Check if the other invoice's period is within the new invoice's period
                                if (other_inv.invoice_start_date and other_inv.invoice_end_date and 
                                    invoice.invoice_start_date and invoice.invoice_end_date):
                                    # If other invoice period is within the new paid period, cancel it
                                    if (other_inv.invoice_start_date >= invoice.invoice_start_date and
                                        other_inv.invoice_end_date <= invoice.invoice_end_date):
                                        print(f'[INFO] Invoice {other_inv.invoice_number} period ({other_inv.invoice_start_date} to {other_inv.invoice_end_date}) is covered by {invoice.invoice_number} ({invoice.invoice_start_date} to {invoice.invoice_end_date})')
                                        other_inv.status = 'cancelled'
                                        other_inv.notes = f"{other_inv.notes or ''}\n[Superseded] Digantikan oleh invoice {invoice.invoice_number} pada {timezone.now().date()}".strip()
                                        other_inv.save()
                                        print(f'[INFO] ✓ Cancelled superseded invoice {other_inv.invoice_number}')
                                    else:
                                        print(f'[DEBUG] Invoice {other_inv.invoice_number} period NOT fully covered')
                                elif other_inv.status == 'unpaid':
                                    # Mark unpaid invoices as paid if no period check
                                    other_inv.status = 'paid'
                                    other_inv.save()
                                    print(f'[INFO] Marked unpaid invoice {other_inv.invoice_number} as paid')
                    
                    # Update financial report
                    try:
                        bulan_date = timezone.now().date().replace(day=1)
                        LaporanKeuangan.generateLaporan(bulan_date)
                    except Exception as e:
                        print(f'[WARNING] Failed to update financial report: {str(e)}')
                    
                    # Notify user
                    if pembayaran.penyewa:
                        Notif.objects.create(
                            user=pembayaran.penyewa,
                            pesan=f'Pembayaran Berhasil. Pembayaran sebesar Rp {int(pembayaran.jumlah):,} telah berhasil. Periode sewa Anda sampai {invoice.invoice_end_date.strftime("%d %B %Y") if invoice else "diperpanjang"}.'.replace(',', '.'),
                            status='unread'
                        )
                        
            elif transaction_status in ['deny', 'cancel', 'expire']:
                pembayaran.status = 'failed' if transaction_status == 'deny' else 'cancelled'
                if invoice:
                    invoice.status = 'cancelled'
                    invoice.save()
                    
            elif transaction_status == 'pending':
                pembayaran.status = 'pending'
            
            pembayaran.save()
        
        return Response({'success': True, 'message': 'Notification processed'})
    
    @action(detail=False, methods=['post'], url_path='check-transaction')
    def check_transaction(self, request):
        """
        Check transaction status from Midtrans.
        Called by frontend after Snap popup closed.
        """
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response({'error': 'order_id required'}, status=400)
        
        try:
            # Check status via Midtrans direct API call (more reliable than library)
            server_key = settings.MIDTRANS_SERVER_KEY
            auth_string = base64.b64encode(f'{server_key}:'.encode()).decode()
            
            api_base = 'https://api.midtrans.com' if settings.MIDTRANS_IS_PRODUCTION else 'https://api.sandbox.midtrans.com'
            url = f'{api_base}/v2/{order_id}/status'
            
            headers = {
                'Authorization': f'Basic {auth_string}',
                'Content-Type': 'application/json'
            }
            
            api_response = requests.get(url, headers=headers, timeout=15)
            status_response = api_response.json()
            
            print(f"[DEBUG] Midtrans status response: {status_response}")
            
            transaction_status = status_response.get('transaction_status')
            fraud_status = status_response.get('fraud_status')
            
            # Update local records
            pembayaran = Pembayaran.objects.filter(transaction_id=order_id).first()
            invoice = Invoice.objects.filter(invoice_number=order_id).first()
            
            if pembayaran:
                with transaction.atomic():
                    if transaction_status in ['capture', 'settlement']:
                        if fraud_status == 'accept' or fraud_status is None:
                            pembayaran.status = 'completed'
                            pembayaran.verified_at = timezone.now()
                            pembayaran.save()
                            
                            if invoice:
                                invoice.status = 'paid'
                                invoice.save()
                                
                                # Update rental end_date
                                if invoice.rental and invoice.invoice_end_date:
                                    invoice.rental.end_date = invoice.invoice_end_date
                                    invoice.rental.save()
                                    
                                    # Mark all other unpaid invoices for this rental as paid
                                    Invoice.objects.filter(
                                        rental=invoice.rental,
                                        penyewa=pembayaran.penyewa,
                                        status='unpaid'
                                    ).update(status='paid')
                            
                            # Update financial report
                            try:
                                bulan_date = timezone.now().date().replace(day=1)
                                LaporanKeuangan.generateLaporan(bulan_date)
                            except Exception as e:
                                print(f'[WARNING] Failed to update financial report: {str(e)}')
                            
                            # Notify user
                            if pembayaran.penyewa:
                                Notif.objects.create(
                                    user=pembayaran.penyewa,
                                    pesan=f'Pembayaran Berhasil. Pembayaran sebesar Rp {int(pembayaran.jumlah):,} telah berhasil'.replace(',', '.'),
                                    status='unread'
                                )
                    
                    elif transaction_status in ['deny', 'cancel', 'expire']:
                        pembayaran.status = 'failed' if transaction_status == 'deny' else 'cancelled'
                        pembayaran.save()
                        if invoice:
                            invoice.status = 'cancelled'
                            invoice.save()
            
            return Response({
                'success': True,
                'order_id': order_id,
                'transaction_status': transaction_status,
                'fraud_status': fraud_status,
                'payment_status': pembayaran.status if pembayaran else None,
                'invoice_status': invoice.status if invoice else None,
                'period_end': invoice.invoice_end_date.isoformat() if invoice and invoice.invoice_end_date else None
            })
            
        except Exception as e:
            return Response({
                'error': f'Gagal cek status transaksi: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='rental-info')
    def rental_info(self, request):
        """
        Get rental info for current user with payment period options.
        Includes extension billing logic:
        - If rental ends in less than 6 months, show extension invoice
        - Extension invoice only valid for current month and next month (month 2)
        - If not paid by month 2, can't extend until rental expires
        """
        if request.user.role != 'penyewa':
            return Response({'error': 'Only penyewa can access this'}, status=403)
        
        # Get active rental for user
        rental = Rental.objects.filter(penyewa=request.user, status='active').first()

        # If the user has a room assignment but no active rental record, bootstrap one
        if not rental:
            room = Room.objects.filter(penyewa=request.user).first()
            if room:
                rental = Rental.objects.create(
                    room=room,
                    penyewa=request.user,
                    start_date=timezone.now().date(),
                    end_date=None,
                    harga_bulanan=room.price,
                    status='active',
                    notes='Auto-generated rental from room assignment'
                )
            else:
                return Response({'error': 'Tidak ada penyewaan aktif'}, status=404)
        
        monthly_price = float(rental.harga_bulanan)
        today = timezone.now().date()
        
        # Calculate extension billing status
        extension_billing = None
        can_extend = True
        extension_blocked_reason = None
        
        if rental.end_date:
            # Calculate remaining months
            remaining_days = (rental.end_date - today).days
            remaining_months = remaining_days / 30.0
            
            # If less than 6 months remaining, show extension billing
            if remaining_months <= 6 and remaining_months > 0:
                # Calculate billing urgency level
                # Green zone: 3-6 months remaining (can pay comfortably)
                # Yellow zone: 1-3 months remaining (should pay soon)
                # Red zone: 0-1 month remaining (urgent, last chance)
                
                if remaining_days <= 30:
                    # Red zone - last chance to extend
                    can_extend = True
                    urgency_level = 'critical'
                elif remaining_days <= 90:
                    # Yellow zone
                    urgency_level = 'warning'
                else:
                    # Green zone (3-6 months)
                    urgency_level = 'normal'
                
                # Check if there's already an unpaid extension invoice
                existing_extension_invoice = Invoice.objects.filter(
                    rental=rental,
                    penyewa=request.user,
                    status='unpaid',
                    notes__icontains='Perpanjangan'
                ).first()
                
                if existing_extension_invoice:
                    extension_billing = {
                        'invoice_id': existing_extension_invoice.id,
                        'invoice_number': existing_extension_invoice.invoice_number,
                        'amount': float(existing_extension_invoice.amount),
                        'due_date': existing_extension_invoice.tenggat.isoformat() if existing_extension_invoice.tenggat else None,
                        'period_start': existing_extension_invoice.invoice_start_date.isoformat() if existing_extension_invoice.invoice_start_date else None,
                        'period_end': existing_extension_invoice.invoice_end_date.isoformat() if existing_extension_invoice.invoice_end_date else None,
                        'is_new': False,
                        'remaining_days': remaining_days,
                        'remaining_months': round(remaining_months, 1),
                        'urgency_level': urgency_level,
                        'is_last_chance': remaining_days <= 30
                    }
                else:
                    # Auto-create invoice for extension if not exists
                    import uuid
                    invoice_number = f"INV-EXT-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
                    
                    # Create invoice for 1 month extension
                    new_invoice = Invoice.objects.create(
                        rental=rental,
                        penyewa=request.user,
                        invoice_number=invoice_number,
                        amount=monthly_price,
                        invoice_start_date=rental.end_date,
                        invoice_end_date=rental.end_date + relativedelta(months=1),
                        tenggat=rental.end_date,  # Due at rental end date
                        status='unpaid',
                        notes=f'Tagihan Perpanjangan Sewa - 1 Bulan (Otomatis)'
                    )
                    
                    extension_billing = {
                        'invoice_id': new_invoice.id,
                        'invoice_number': new_invoice.invoice_number,
                        'amount': monthly_price,
                        'due_date': new_invoice.tenggat.isoformat() if new_invoice.tenggat else None,
                        'period_start': rental.end_date.isoformat(),
                        'period_end': (rental.end_date + relativedelta(months=1)).isoformat(),
                        'is_new': True,
                        'remaining_days': remaining_days,
                        'remaining_months': round(remaining_months, 1),
                        'urgency_level': urgency_level,
                        'is_last_chance': remaining_days <= 30
                    }
            elif remaining_months <= 0:
                # Rental expired
                extension_billing = None
                can_extend = True  # Can extend after expiry
        
        return Response({
            'rental_id': rental.id,
            'room_number': rental.room.room_number,
            'kos_name': rental.room.kos.name,
            'monthly_price': monthly_price,
            'current_end_date': rental.end_date.isoformat() if rental.end_date else None,
            'can_extend': can_extend,
            'extension_blocked_reason': extension_blocked_reason,
            'extension_billing': extension_billing,
            'payment_options': [
                {
                    'months': 1,
                    'label': '1 Bulan',
                    'total': int(monthly_price),
                    'discount': 0
                },
                {
                    'months': 6,
                    'label': '6 Bulan',
                    'total': int(monthly_price * 6),
                    'discount': 0
                },
                {
                    'months': 12,
                    'label': '12 Bulan (1 Tahun)',
                    'total': int(monthly_price * 12),
                    'discount': 0
                }
            ]
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
                    pesan=f'Pembayaran Diverifikasi. Pembayaran Anda sebesar Rp {int(pembayaran.jumlah):,} telah diverifikasi oleh admin.'.replace(',', '.'),
                    status='unread'
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
    
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_payment(self, request, pk=None):
        """
        Cancel a pending payment.
        Penyewa can cancel their own pending payments.
        """
        pembayaran = self.get_object()
        
        # Check if user owns this payment (for penyewa) or is admin
        if request.user.role == 'penyewa' and pembayaran.penyewa != request.user:
            return Response({
                'error': 'Tidak diizinkan membatalkan pembayaran ini'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Only pending payments can be cancelled
        if pembayaran.status != 'pending':
            return Response({
                'error': f'Pembayaran dengan status "{pembayaran.get_status_display()}" tidak dapat dibatalkan'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Update payment status
            pembayaran.status = 'cancelled'
            pembayaran.notes = f"{pembayaran.notes or ''}\n[Dibatalkan oleh {request.user.username} pada {timezone.now().strftime('%d/%m/%Y %H:%M')}]".strip()
            pembayaran.save()
            
            # Update related invoice
            invoice = Invoice.objects.filter(invoice_number=pembayaran.transaction_id).first()
            if invoice:
                invoice.status = 'cancelled'
                invoice.save()
            
            # Cancel Midtrans transaction if exists
            if pembayaran.transaction_id:
                try:
                    # Call Midtrans Cancel API
                    server_key = settings.MIDTRANS_SERVER_KEY
                    encoded_key = base64.b64encode(f'{server_key}:'.encode()).decode()
                    
                    headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': f'Basic {encoded_key}'
                    }
                    
                    api_url = 'https://api.sandbox.midtrans.com' if not settings.MIDTRANS_IS_PRODUCTION else 'https://api.midtrans.com'
                    response = requests.post(
                        f'{api_url}/v2/{pembayaran.transaction_id}/cancel',
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        print(f"Midtrans transaction {pembayaran.transaction_id} cancelled successfully")
                    else:
                        print(f"Failed to cancel Midtrans transaction: {response.text}")
                except Exception as e:
                    print(f"Error cancelling Midtrans transaction: {str(e)}")
                    # Continue even if Midtrans cancel fails
            
            # Notify user
            if pembayaran.penyewa:
                Notif.objects.create(
                    user=pembayaran.penyewa,
                    pesan=f'Pembayaran Dibatalkan. Pembayaran sebesar Rp {int(pembayaran.jumlah):,} telah dibatalkan.'.replace(',', '.'),
                    status='unread'
                )
        
        return Response({
            'success': True,
            'message': 'Pembayaran berhasil dibatalkan',
            'pembayaran_id': pembayaran.pembayaran_id,
            'status': pembayaran.status
        })


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
