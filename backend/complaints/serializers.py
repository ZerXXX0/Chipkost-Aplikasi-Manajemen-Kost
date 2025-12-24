from rest_framework import serializers
from .models import Kerusakan

class KerusakanSerializer(serializers.ModelSerializer):
    kamar_number = serializers.CharField(source='kamar.room_number', read_only=True)
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True, allow_null=True)
    created_at = serializers.DateTimeField(source='tgl_lapor', read_only=True)  # Alias for frontend compatibility
    
    # Kamar detail for frontend compatibility
    kamar_detail = serializers.SerializerMethodField()
    
    def get_kamar_detail(self, obj):
        if obj.kamar:
            return {
                'id': obj.kamar.id,
                'room_number': obj.kamar.room_number,
                'nomor_kamar': obj.kamar.room_number,
                'kos_name': obj.kamar.kos.name if obj.kamar.kos else None,
            }
        return None
    
    class Meta:
        model = Kerusakan
        fields = ('laporan_id', 'kamar', 'kamar_number', 'kamar_detail', 'penyewa', 'penyewa_username', 'deskripsi', 'tgl_lapor', 'created_at', 'status', 'priority', 'image', 'assigned_to', 'assigned_to_username', 'resolution_notes', 'resolved_at', 'updated_at')
        read_only_fields = ('laporan_id', 'tgl_lapor', 'created_at', 'penyewa')
