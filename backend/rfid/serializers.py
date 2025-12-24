from rest_framework import serializers
from .models import RFIDCard, AccessLog
from rooms.models import Room
from django.contrib.auth import get_user_model

User = get_user_model()


class RFIDCardSerializer(serializers.ModelSerializer):
    card_id = serializers.CharField(source='card_uid')  # Map card_uid ke card_id untuk API
    penyewa = serializers.PrimaryKeyRelatedField(source='tenant', queryset=User.objects.filter(role='penyewa'), allow_null=True, required=False)
    penyewa_username = serializers.CharField(source='tenant.username', read_only=True)
    penyewa_name = serializers.SerializerMethodField()
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    kos_name = serializers.CharField(source='room.kos.name', read_only=True)
    registered_by_name = serializers.CharField(source='registered_by.username', read_only=True)
    
    class Meta:
        model = RFIDCard
        fields = [
            'id', 'card_id', 'penyewa', 'penyewa_username', 'penyewa_name',
            'room', 'room_number', 'kos_name', 'status', 'registered_at',
            'registered_by', 'registered_by_name', 'last_used', 'notes'
        ]
        read_only_fields = ['registered_at', 'registered_by', 'last_used']
    
    def get_penyewa_name(self, obj):
        if obj.tenant:
            return f"{obj.tenant.first_name} {obj.tenant.last_name}".strip() or obj.tenant.username
        return None


class RFIDCardCreateSerializer(serializers.ModelSerializer):
    card_id = serializers.CharField(source='card_uid', write_only=True)
    penyewa = serializers.PrimaryKeyRelatedField(source='tenant', queryset=User.objects.filter(role='penyewa'), allow_null=True, required=False)
    
    class Meta:
        model = RFIDCard
        fields = ['card_id', 'penyewa', 'room', 'status']
    
    def validate_card_uid(self, value):
        if RFIDCard.objects.filter(card_uid=value).exists():
            raise serializers.ValidationError("Kartu RFID dengan ID ini sudah terdaftar.")
        return value


class AccessLogSerializer(serializers.ModelSerializer):
    card_id = serializers.SerializerMethodField()
    penyewa_username = serializers.SerializerMethodField()
    penyewa_name = serializers.SerializerMethodField()
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    kos_name = serializers.CharField(source='room.kos.name', read_only=True)
    
    class Meta:
        model = AccessLog
        fields = [
            'id', 'rfid_card', 'card_id', 'penyewa_username', 'penyewa_name',
            'room', 'room_number', 'kos_name', 'status', 'access_time',
            'denied_reason', 'attempted_card_id'
        ]
        read_only_fields = ['access_time']
    
    def get_card_id(self, obj):
        if obj.rfid_card:
            return obj.rfid_card.card_id
        return obj.attempted_card_id or 'Unknown'
    
    def get_penyewa_username(self, obj):
        if obj.rfid_card and obj.rfid_card.penyewa:
            return obj.rfid_card.penyewa.username
        return None
    
    def get_penyewa_name(self, obj):
        if obj.rfid_card and obj.rfid_card.penyewa:
            penyewa = obj.rfid_card.penyewa
            return f"{penyewa.first_name} {penyewa.last_name}".strip() or penyewa.username
        return None


class TapCardSerializer(serializers.Serializer):
    """Serializer for RFID tap simulation"""
    card_id = serializers.CharField(max_length=50)
    room_id = serializers.IntegerField()
    
    def validate_room_id(self, value):
        if not Room.objects.filter(id=value).exists():
            raise serializers.ValidationError("Kamar tidak ditemukan.")
        return value
