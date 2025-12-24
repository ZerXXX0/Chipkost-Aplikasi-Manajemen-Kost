from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to check if user is admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class UserListView(generics.ListAPIView):
    """
    List all users - admin only
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)

class UserDeleteView(APIView):
    """
    Delete user and auto-unassign from all rooms - admin only
    """
    permission_classes = (permissions.IsAuthenticated, IsAdmin)
    
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            # Don't allow deleting admin users
            if user.role == 'admin':
                return Response({
                    'error': 'Tidak dapat menghapus user admin'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Don't allow deleting yourself
            if user.id == request.user.id:
                return Response({
                    'error': 'Tidak dapat menghapus akun Anda sendiri'
                }, status=status.HTTP_403_FORBIDDEN)
            
            username = user.username
            
            # Auto-unassign from all rooms and update status to available
            from rooms.models import Room
            affected_rooms = Room.objects.filter(penyewa=user)
            room_count = affected_rooms.count()
            affected_rooms.update(penyewa=None, status='available')
            
            # Delete the user
            user.delete()
            
            return Response({
                'message': f'User {username} berhasil dihapus',
                'unassigned_rooms': room_count
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class UserUpdateView(APIView):
    """
    Update user info including password reset - admin only
    """
    permission_classes = (permissions.IsAuthenticated, IsAdmin)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            # Don't allow editing admin users (except yourself)
            if user.role == 'admin' and user.id != request.user.id:
                return Response({
                    'error': 'Tidak dapat mengedit user admin lain'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Update basic fields
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'phone_number' in request.data:
                user.phone_number = request.data['phone_number']
            
            # Update profile picture if provided
            if 'profile_picture' in request.FILES:
                user.profile_picture = request.FILES['profile_picture']
            
            # Update password if provided (admin can reset without old password)
            if 'new_password' in request.data and request.data['new_password']:
                new_password = request.data['new_password']
                # Validate password length
                if len(new_password) < 8:
                    return Response({
                        'error': 'Password minimal 8 karakter'
                    }, status=status.HTTP_400_BAD_REQUEST)
                user.set_password(new_password)
            
            user.save()
            
            return Response({
                'message': f'User {user.username} berhasil diupdate',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User tidak ditemukan'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    """
    Admin only - Register a new tenant
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin)  # Admin only
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Don't return tokens for the new user since this is an admin-only endpoint
        # The admin is registering a new user, not logging in as that user
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    """
    Login view for both admin and tenant
    """
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    """
    Logout view - blacklist the refresh token
    """
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update user profile
    """
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_object(self):
        return self.request.user
