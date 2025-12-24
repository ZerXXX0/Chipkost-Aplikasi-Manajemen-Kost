from rest_framework import serializers
from .models import Kos, Room, Rental, CctvCamera

class KosSerializer(serializers.ModelSerializer):
    room_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Kos
        fields = ('id', 'name', 'address', 'cctv_url', 'owner', 'room_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')
    
    def get_room_count(self, obj):
        return obj.rooms.count()

class RoomSerializer(serializers.ModelSerializer):
    kos_name = serializers.CharField(source='kos.name', read_only=True)
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True, allow_null=True)
    penyewa_name = serializers.SerializerMethodField()
    rental_id = serializers.SerializerMethodField()
    # Alias fields for frontend compatibility (write-only, used for input)
    nomor_kamar = serializers.CharField(write_only=True, required=False)
    harga = serializers.DecimalField(write_only=True, max_digits=10, decimal_places=2, required=False)
    
    def get_penyewa_name(self, obj):
        if obj.penyewa:
            return f"{obj.penyewa.first_name} {obj.penyewa.last_name}".strip()
        return None
    
    def get_rental_id(self, obj):
        # Get active rental for this room
        from rooms.models import Rental
        active_rental = Rental.objects.filter(room=obj, status='active').first()
        return active_rental.id if active_rental else None
    
    class Meta:
        model = Room
        fields = ('id', 'kos', 'kos_name', 'room_number', 'nomor_kamar', 'floor', 'price', 'harga', 'status', 'description', 'capacity', 'facilities', 'image', 'penyewa', 'penyewa_username', 'penyewa_name', 'rental_id', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
        extra_kwargs = {
            'room_number': {'required': False},
            'price': {'required': False},
            'floor': {'required': False, 'default': 1},
            'capacity': {'required': False, 'default': 1},
            'description': {'required': False, 'allow_blank': True},
            'facilities': {'required': False, 'allow_blank': True},
        }
        # Remove automatic unique_together validator to handle it manually
        validators = []
    
    def validate(self, data):
        # Get room_number from either field (nomor_kamar alias or room_number)
        room_number = data.get('room_number') or data.pop('nomor_kamar', None)
        if room_number:
            data['room_number'] = room_number
        
        # Get price from either field (harga alias or price)
        price = data.get('price') or data.pop('harga', None)
        if price:
            data['price'] = price
        
        # Validate required fields
        if not data.get('room_number'):
            raise serializers.ValidationError({'room_number': 'Nomor kamar harus diisi.'})
        if not data.get('price'):
            raise serializers.ValidationError({'price': 'Harga harus diisi.'})
            
        kos = data.get('kos')
        
        # Manual unique check
        if kos and data.get('room_number'):
            room_number = data['room_number']
            # Check if updating existing room
            if self.instance:
                # Exclude current instance from uniqueness check
                if Room.objects.filter(kos=kos, room_number=room_number).exclude(id=self.instance.id).exists():
                    raise serializers.ValidationError({
                        'room_number': f'Kamar {room_number} sudah ada di kos ini.'
                    })
            else:
                # Creating new room
                if Room.objects.filter(kos=kos, room_number=room_number).exists():
                    raise serializers.ValidationError({
                        'room_number': f'Kamar {room_number} sudah ada di kos ini.'
                    })
        
        return data
    
    def to_representation(self, instance):
        """Add nomor_kamar and harga to output for frontend compatibility"""
        data = super().to_representation(instance)
        data['nomor_kamar'] = instance.room_number
        data['harga'] = instance.price
        return data

class RentalSerializer(serializers.ModelSerializer):
    nomor_kamar = serializers.CharField(source='room.room_number', read_only=True)
    penyewa_username = serializers.CharField(source='penyewa.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Rental
        fields = ('id', 'room', 'nomor_kamar', 'penyewa', 'penyewa_username', 'start_date', 'end_date', 'harga_bulanan', 'status', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CctvCameraSerializer(serializers.ModelSerializer):
    kos_name = serializers.CharField(source='kos.name', read_only=True)

    class Meta:
        model = CctvCamera
        fields = ('id', 'kos', 'kos_name', 'name', 'stream_url', 'order', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
