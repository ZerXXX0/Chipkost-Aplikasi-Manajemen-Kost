from rest_framework import serializers
from .models import Invoice, Pembayaran, LaporanKeuangan
from accounts.models import User

class InvoiceSerializer(serializers.ModelSerializer):
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True, allow_null=True)
    penyewa_name = serializers.SerializerMethodField()
    # Alias fields for API compatibility
    billing_period_start = serializers.DateField(source='invoice_start_date', read_only=True, allow_null=True)
    billing_period_end = serializers.DateField(source='invoice_end_date', read_only=True, allow_null=True)
    due_date = serializers.DateField(source='tenggat', read_only=True, allow_null=True)
    
    # Kamar details
    kamar_detail = serializers.SerializerMethodField()
    
    def get_penyewa_name(self, obj):
        if obj.penyewa:
            return f"{obj.penyewa.first_name} {obj.penyewa.last_name}".strip()
        return None
    
    def get_kamar_detail(self, obj):
        if obj.rental and obj.rental.room:
            room = obj.rental.room
            return {
                'id': room.id,
                'room_number': room.room_number,
                'nomor_kamar': room.room_number,
                'kos_name': room.kos.name if room.kos else None,
                'kos_id': room.kos.id if room.kos else None
            }
        return None
    
    class Meta:
        model = Invoice
        fields = ('id', 'rental', 'penyewa', 'penyewa_username', 'penyewa_name', 'invoice_number', 'amount', 'invoice_start_date', 'invoice_end_date', 'tenggat', 'billing_period_start', 'billing_period_end', 'due_date', 'status', 'notes', 'created_at', 'updated_at', 'kamar_detail')
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
