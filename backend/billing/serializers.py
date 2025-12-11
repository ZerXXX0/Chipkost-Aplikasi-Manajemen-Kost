from rest_framework import serializers
from .models import Invoice, Pembayaran, LaporanKeuangan
from accounts.models import User

class InvoiceSerializer(serializers.ModelSerializer):
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Invoice
        fields = ('id', 'rental', 'penyewa', 'penyewa_username', 'invoice_number', 'amount', 'billing_period_start', 'billing_period_end', 'due_date', 'status', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class PembayaranSerializer(serializers.ModelSerializer):
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True)
    kamar_number = serializers.CharField(source='kamar.room_number', read_only=True)
    verified_by_username = serializers.CharField(source='verified_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Pembayaran
        fields = ('pembayaran_id', 'penyewa', 'penyewa_username', 'kamar', 'kamar_number', 'tgl_bayar', 'jumlah', 'tenggat', 'metode', 'status', 'transaction_id', 'payment_proof', 'notes', 'verified_by', 'verified_by_username', 'verified_at')
        read_only_fields = ('pembayaran_id', 'tgl_bayar')

class LaporanKeuanganSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanKeuangan
        fields = ('laporan_id', 'bulan', 'total_pemasukan', 'total_pengeluaran', 'saldo', 'created_at', 'updated_at')
        read_only_fields = ('laporan_id', 'saldo', 'created_at', 'updated_at')
