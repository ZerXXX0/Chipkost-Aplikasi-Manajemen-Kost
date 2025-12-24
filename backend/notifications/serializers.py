from rest_framework import serializers
from .models import Notif

class NotifSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(source='tgl', read_only=True)  # Alias for frontend compatibility
    
    class Meta:
        model = Notif
        fields = ('notif_id', 'user', 'user_username', 'pesan', 'tgl', 'created_at', 'status')
        read_only_fields = ('notif_id', 'tgl', 'created_at')
