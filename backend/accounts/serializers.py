from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

User = get_user_model()

def validate_password_strength(password):
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long.")
    
    if not re.search(r'\d', password):
        raise serializers.ValidationError("Password must contain at least 1 number (0-9).")
    
    if not re.search(r'[@!#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        raise serializers.ValidationError("Password must contain at least 1 special character (@, !, #, $, %, ^, &, *, etc.).")
    
    return password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone_number',
            'profile_picture',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Kata Sandi')
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Konfirmasi Kata Sandi')
    
    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'password2',
            'first_name',
            'last_name',
            'phone_number',
            'profile_picture',
            'role',
        )
        extra_kwargs = {
            'first_name': {'required': True, 'label': 'Nama Depan'},
            'last_name': {'required': True, 'label': 'Nama Belakang'},
            'email': {'label': 'Email'},
            'username': {'label': 'Nama Pengguna'},
            'phone_number': {'label': 'Nomor HP'},
            'role': {'label': 'Peran'}
        }
    
    def validate_password(self, value):
        """Validate password strength"""
        return validate_password_strength(value)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Kata sandi tidak cocok."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra responses
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'phone_number': self.user.phone_number,
        }
        
        return data
