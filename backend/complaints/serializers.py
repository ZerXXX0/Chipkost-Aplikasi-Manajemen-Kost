from rest_framework import serializers
from .models import Kerusakan

class KerusakanSerializer(serializers.ModelSerializer):
    kamar_number = serializers.CharField(source='kamar.room_number', read_only=True)
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Kerusakan
        fields = ('laporan_id', 'kamar', 'kamar_number', 'penyewa', 'penyewa_username', 'deskripsi', 'tgl_lapor', 'status', 'priority', 'image', 'assigned_to', 'assigned_to_username', 'resolution_notes', 'resolved_at', 'updated_at')
        read_only_fields = ('laporan_id', 'tgl_lapor', 'penyewa')
