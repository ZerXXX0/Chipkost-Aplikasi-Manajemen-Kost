from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date
from .models import Kos, Room, Rental, CctvCamera
from .serializers import KosSerializer, CctvCameraSerializer

User = get_user_model()

class KosModelTest(TestCase):
    """Test Kos model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman No. 123',
            owner=self.admin_user
        )
    
    def test_kos_str_representation(self):
        """Test Kos.__str__() returns name"""
        self.assertEqual(str(self.kos), 'ChipKost')
    
    def test_kos_creation(self):
        """Test Kos can be created successfully"""
        self.assertIsNotNone(self.kos.id)
        self.assertEqual(self.kos.name, 'ChipKost')
        self.assertEqual(self.kos.owner, self.admin_user)
    
    def test_kos_cctv_url_optional(self):
        """Test cctv_url is optional"""
        kos_no_cctv = Kos.objects.create(
            name='Kos2',
            address='Jl. Test',
            owner=self.admin_user
        )
        self.assertIsNone(kos_no_cctv.cctv_url)
    
    def test_kos_has_timestamps(self):
        """Test Kos has created_at and updated_at"""
        self.assertIsNotNone(self.kos.created_at)
        self.assertIsNotNone(self.kos.updated_at)
    
    def test_kos_update(self):
        """Test Kos can be updated"""
        self.kos.name = 'ChipKost Updated'
        self.kos.save()
        self.kos.refresh_from_db()
        self.assertEqual(self.kos.name, 'ChipKost Updated')
    
    def test_kos_delete(self):
        """Test Kos can be deleted"""
        kos_id = self.kos.id
        self.kos.delete()
        self.assertFalse(Kos.objects.filter(id=kos_id).exists())


class CctvCameraModelTest(TestCase):
    """Test CctvCamera model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.camera = CctvCamera.objects.create(
            kos=self.kos,
            name='Kamera Depan',
            stream_url='http://example.com/stream1.mp4',
            order=1
        )
    
    def test_cctv_camera_str_representation(self):
        """Test CctvCamera.__str__() returns 'kos_name - camera_name'"""
        expected = f"{self.kos.name} - {self.camera.name}"
        self.assertEqual(str(self.camera), expected)
    
    def test_cctv_camera_creation(self):
        """Test CctvCamera can be created"""
        self.assertIsNotNone(self.camera.id)
        self.assertEqual(self.camera.name, 'Kamera Depan')
        self.assertEqual(self.camera.kos, self.kos)
    
    def test_cctv_camera_default_is_active(self):
        """Test CctvCamera default is_active is True"""
        self.assertTrue(self.camera.is_active)
    
    def test_cctv_camera_default_order(self):
        """Test CctvCamera has default order of 1"""
        camera2 = CctvCamera.objects.create(
            kos=self.kos,
            name='Kamera Belakang',
            stream_url='http://example.com/stream2.mp4',
            order=2
        )
        self.assertEqual(camera2.order, 2)
    
    def test_cctv_camera_unique_order_per_kos(self):
        """Test unique_together constraint for (kos, order)"""
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            CctvCamera.objects.create(
                kos=self.kos,
                name='Kamera Belakang',
                stream_url='http://example.com/stream2.mp4',
                order=1  # Same order as first camera
            )
    
    def test_cctv_camera_same_order_different_kos(self):
        """Test same order is allowed in different kos"""
        kos2 = Kos.objects.create(name='Kos2', address='Jl. Test', owner=self.admin_user)
        camera2 = CctvCamera.objects.create(
            kos=kos2,
            name='Kamera Depan Kos2',
            stream_url='http://example.com/stream3.mp4',
            order=1  # Same order but different kos
        )
        self.assertEqual(camera2.order, 1)
    
    def test_cctv_camera_cascade_delete(self):
        """Test CctvCamera is deleted when Kos is deleted"""
        camera_id = self.camera.id
        self.kos.delete()
        self.assertFalse(CctvCamera.objects.filter(id=camera_id).exists())
    
    def test_cctv_camera_update(self):
        """Test CctvCamera can be updated"""
        self.camera.name = 'Kamera Depan Updated'
        self.camera.save()
        self.camera.refresh_from_db()
        self.assertEqual(self.camera.name, 'Kamera Depan Updated')
    
    def test_cctv_camera_is_active_toggle(self):
        """Test CctvCamera is_active can be toggled"""
        self.camera.is_active = False
        self.camera.save()
        self.camera.refresh_from_db()
        self.assertFalse(self.camera.is_active)


# ==================== SERIALIZER TESTS ====================

class KosSerializerTest(TestCase):
    """Test KosSerializer"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
    
    def test_serializer_includes_required_fields(self):
        """Test serializer includes all required fields"""
        serializer = KosSerializer(self.kos)
        required_fields = ['id', 'name', 'address', 'owner', 'created_at', 'updated_at']
        for field in required_fields:
            self.assertIn(field, serializer.data)
    
    def test_serializer_output_name(self):
        """Test serializer outputs correct name"""
        serializer = KosSerializer(self.kos)
        self.assertEqual(serializer.data['name'], 'ChipKost')
    
    def test_serializer_output_address(self):
        """Test serializer outputs correct address"""
        serializer = KosSerializer(self.kos)
        self.assertEqual(serializer.data['address'], 'Jl. Sudirman')
    
    def test_serializer_create(self):
        """Test KosSerializer can create Kos"""
        data = {
            'name': 'Kos Baru',
            'address': 'Jl. Baru No. 1'
        }
        serializer = KosSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        # owner is read_only, so we pass it via save()
        kos = serializer.save(owner=self.admin_user)
        self.assertEqual(kos.name, 'Kos Baru')
    
    def test_serializer_update(self):
        """Test KosSerializer can update Kos"""
        data = {'name': 'ChipKost Updated', 'address': 'Jl. Updated'}
        serializer = KosSerializer(self.kos, data=data)
        self.assertTrue(serializer.is_valid())
        kos = serializer.save()
        self.assertEqual(kos.name, 'ChipKost Updated')


class CctvCameraSerializerTest(TestCase):
    """Test CctvCameraSerializer"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.camera = CctvCamera.objects.create(
            kos=self.kos,
            name='Kamera Depan',
            stream_url='http://example.com/stream.mp4',
            order=1
        )
    
    def test_serializer_includes_kos_name(self):
        """Test CctvCameraSerializer includes kos_name field"""
        serializer = CctvCameraSerializer(self.camera)
        self.assertEqual(serializer.data['kos_name'], 'ChipKost')
    
    def test_serializer_includes_required_fields(self):
        """Test serializer includes all required fields"""
        serializer = CctvCameraSerializer(self.camera)
        required_fields = ['id', 'kos', 'name', 'stream_url', 'order', 'is_active']
        for field in required_fields:
            self.assertIn(field, serializer.data)
    
    def test_serializer_output_stream_url(self):
        """Test serializer outputs correct stream_url"""
        serializer = CctvCameraSerializer(self.camera)
        self.assertEqual(serializer.data['stream_url'], 'http://example.com/stream.mp4')
    
    def test_serializer_create(self):
        """Test CctvCameraSerializer can create camera"""
        data = {
            'kos': self.kos.id,
            'name': 'Kamera Baru',
            'stream_url': 'http://example.com/new.mp4',
            'order': 2
        }
        serializer = CctvCameraSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        camera = serializer.save()
        self.assertEqual(camera.name, 'Kamera Baru')


# ==================== MODEL LOGIC TESTS ====================

class RoomModelLogicTest(TestCase):
    """Test Room model logic"""
    
    def test_room_status_choices_values(self):
        """Test Room STATUS_CHOICES has correct values"""
        choices = dict(Room.STATUS_CHOICES)
        self.assertIn('available', choices)
        self.assertIn('occupied', choices)
        self.assertIn('maintenance', choices)
        self.assertEqual(choices['available'], 'Tersedia')
        self.assertEqual(choices['occupied'], 'Ditempati')
        self.assertEqual(choices['maintenance'], 'Perbaikan')
    
    def test_room_status_choices_count(self):
        """Test Room has 3 status choices"""
        self.assertEqual(len(Room.STATUS_CHOICES), 3)


class RentalModelLogicTest(TestCase):
    """Test Rental model logic"""
    
    def test_rental_status_choices_values(self):
        """Test Rental STATUS_CHOICES has correct values"""
        choices = dict(Rental.STATUS_CHOICES)
        self.assertIn('active', choices)
        self.assertIn('expired', choices)
        self.assertIn('terminated', choices)
        self.assertEqual(choices['active'], 'Aktif')
        self.assertEqual(choices['expired'], 'Kadaluarsa')
        self.assertEqual(choices['terminated'], 'Dihentikan')
    
    def test_rental_status_choices_count(self):
        """Test Rental has 3 status choices"""
        self.assertEqual(len(Rental.STATUS_CHOICES), 3)


# ==================== QUERYSET LOGIC TESTS ====================

class KosQuerySetTest(TestCase):
    """Test Kos queryset operations"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.admin_user2 = User.objects.create_user(
            username='admin2',
            password='testpass123',
            role='admin'
        )
        self.kos1 = Kos.objects.create(
            name='ChipKost 1',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.kos2 = Kos.objects.create(
            name='ChipKost 2',
            address='Jl. Gatot Subroto',
            owner=self.admin_user
        )
        self.kos3 = Kos.objects.create(
            name='Kos Lain',
            address='Jl. Thamrin',
            owner=self.admin_user2
        )
    
    def test_kos_filter_by_owner(self):
        """Test Kos can be filtered by owner"""
        queryset = Kos.objects.filter(owner=self.admin_user)
        self.assertEqual(queryset.count(), 2)
    
    def test_kos_filter_by_name_contains(self):
        """Test Kos can be filtered by name containing string"""
        queryset = Kos.objects.filter(name__icontains='ChipKost')
        self.assertEqual(queryset.count(), 2)
    
    def test_kos_filter_by_specific_owner(self):
        """Test Kos can be filtered by specific owner"""
        queryset = Kos.objects.filter(owner=self.admin_user2)
        self.assertEqual(queryset.count(), 1)
        self.assertEqual(queryset.first().name, 'Kos Lain')
    
    def test_kos_order_by_name(self):
        """Test Kos can be ordered by name"""
        queryset = Kos.objects.all().order_by('name')
        names = list(queryset.values_list('name', flat=True))
        self.assertEqual(names, ['ChipKost 1', 'ChipKost 2', 'Kos Lain'])


class CctvCameraQuerySetTest(TestCase):
    """Test CctvCamera queryset operations"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.kos1 = Kos.objects.create(name='Kos 1', address='Jl. A', owner=self.admin_user)
        self.kos2 = Kos.objects.create(name='Kos 2', address='Jl. B', owner=self.admin_user)
        
        self.camera1 = CctvCamera.objects.create(
            kos=self.kos1, name='Kamera 1', 
            stream_url='http://example.com/1.mp4', order=1
        )
        self.camera2 = CctvCamera.objects.create(
            kos=self.kos1, name='Kamera 2',
            stream_url='http://example.com/2.mp4', order=2
        )
        self.camera3 = CctvCamera.objects.create(
            kos=self.kos2, name='Kamera 1',
            stream_url='http://example.com/3.mp4', order=1, is_active=False
        )
    
    def test_camera_filter_by_kos(self):
        """Test CctvCamera can be filtered by kos"""
        queryset = CctvCamera.objects.filter(kos=self.kos1)
        self.assertEqual(queryset.count(), 2)
    
    def test_camera_filter_active_only(self):
        """Test CctvCamera can filter active cameras only"""
        queryset = CctvCamera.objects.filter(is_active=True)
        self.assertEqual(queryset.count(), 2)
    
    def test_camera_filter_inactive(self):
        """Test CctvCamera can filter inactive cameras"""
        queryset = CctvCamera.objects.filter(is_active=False)
        self.assertEqual(queryset.count(), 1)
        self.assertEqual(queryset.first().kos, self.kos2)
    
    def test_camera_order_by_order_field(self):
        """Test CctvCamera can be ordered by order field"""
        queryset = CctvCamera.objects.filter(kos=self.kos1).order_by('order')
        orders = list(queryset.values_list('order', flat=True))
        self.assertEqual(orders, [1, 2])


# ==================== ROOM MODEL TESTS ====================

class RoomModelTest(TestCase):
    """Test Room model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.penyewa = User.objects.create_user(
            username='penyewa1',
            password='testpass123',
            role='penyewa'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.room = Room.objects.create(
            kos=self.kos,
            room_number='101',
            floor=1,
            price=Decimal('500000.00'),
            capacity=2,
            status='available'
        )
    
    def test_room_str_representation(self):
        """Test Room.__str__() returns 'kos_name - Room room_number'"""
        expected = f"{self.kos.name} - Room {self.room.room_number}"
        self.assertEqual(str(self.room), expected)
    
    def test_room_creation(self):
        """Test Room can be created"""
        self.assertIsNotNone(self.room.id)
        self.assertEqual(self.room.room_number, '101')
        self.assertEqual(self.room.status, 'available')
    
    def test_room_has_timestamps(self):
        """Test Room has created_at and updated_at"""
        self.assertIsNotNone(self.room.created_at)
        self.assertIsNotNone(self.room.updated_at)
    
    def test_room_update(self):
        """Test Room can be updated"""
        self.room.price = Decimal('600000.00')
        self.room.save()
        self.room.refresh_from_db()
        self.assertEqual(self.room.price, Decimal('600000.00'))
    
    def test_room_delete(self):
        """Test Room can be deleted"""
        room_id = self.room.id
        self.room.delete()
        self.assertFalse(Room.objects.filter(id=room_id).exists())
    
    def test_room_unique_together_constraint(self):
        """Test unique_together constraint for (kos, room_number)"""
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Room.objects.create(
                kos=self.kos,
                room_number='101',  # Same room number in same kos
                floor=1,
                price=Decimal('500000.00')
            )
    
    def test_room_same_number_different_kos(self):
        """Test same room_number is allowed in different kos"""
        kos2 = Kos.objects.create(name='Kos2', address='Jl. Test', owner=self.admin_user)
        room2 = Room.objects.create(
            kos=kos2,
            room_number='101',  # Same number but different kos
            floor=1,
            price=Decimal('500000.00')
        )
        self.assertEqual(room2.room_number, '101')
    
    def test_room_cascade_delete_with_kos(self):
        """Test Room is deleted when Kos is deleted"""
        room_id = self.room.id
        self.kos.delete()
        self.assertFalse(Room.objects.filter(id=room_id).exists())


# ==================== RENTAL MODEL TESTS ====================

class RentalModelTest(TestCase):
    """Test Rental model"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.penyewa = User.objects.create_user(
            username='penyewa1',
            password='testpass123',
            role='penyewa'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.room = Room.objects.create(
            kos=self.kos,
            room_number='101',
            floor=1,
            price=Decimal('500000.00')
        )
        self.rental = Rental.objects.create(
            room=self.room,
            penyewa=self.penyewa,
            start_date=date(2025, 1, 1),
            harga_bulanan=Decimal('500000.00'),
            status='active'
        )
    
    def test_rental_str_representation(self):
        """Test Rental.__str__() returns 'username - room'"""
        expected = f"{self.penyewa.username} - {self.room}"
        self.assertEqual(str(self.rental), expected)
    
    def test_rental_creation(self):
        """Test Rental can be created"""
        self.assertIsNotNone(self.rental.id)
        self.assertEqual(self.rental.status, 'active')
        self.assertEqual(self.rental.penyewa, self.penyewa)
    
    def test_rental_has_timestamps(self):
        """Test Rental has created_at and updated_at"""
        self.assertIsNotNone(self.rental.created_at)
        self.assertIsNotNone(self.rental.updated_at)
    
    def test_rental_update(self):
        """Test Rental can be updated"""
        self.rental.status = 'expired'
        self.rental.save()
        self.rental.refresh_from_db()
        self.assertEqual(self.rental.status, 'expired')
    
    def test_rental_delete(self):
        """Test Rental can be deleted"""
        rental_id = self.rental.id
        self.rental.delete()
        self.assertFalse(Rental.objects.filter(id=rental_id).exists())
    
    def test_rental_cascade_delete_with_room(self):
        """Test Rental is deleted when Room is deleted"""
        rental_id = self.rental.id
        self.room.delete()
        self.assertFalse(Rental.objects.filter(id=rental_id).exists())


# ==================== ROOM QUERYSET TESTS ====================

class RoomQuerySetTest(TestCase):
    """Test Room queryset operations"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.penyewa = User.objects.create_user(
            username='penyewa1',
            password='testpass123',
            role='penyewa'
        )
        self.kos1 = Kos.objects.create(
            name='ChipKost 1',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.kos2 = Kos.objects.create(
            name='ChipKost 2',
            address='Jl. Gatot Subroto',
            owner=self.admin_user
        )
        self.room1 = Room.objects.create(
            kos=self.kos1, room_number='101', floor=1, 
            price=Decimal('500000.00'), status='available'
        )
        self.room2 = Room.objects.create(
            kos=self.kos1, room_number='102', floor=1, 
            price=Decimal('500000.00'), status='occupied', penyewa=self.penyewa
        )
        self.room3 = Room.objects.create(
            kos=self.kos2, room_number='101', floor=1, 
            price=Decimal('600000.00'), status='maintenance'
        )
    
    def test_room_filter_by_kos(self):
        """Test Room can be filtered by kos"""
        queryset = Room.objects.filter(kos=self.kos1)
        self.assertEqual(queryset.count(), 2)
    
    def test_room_filter_by_status(self):
        """Test Room can be filtered by status"""
        queryset = Room.objects.filter(status='available')
        self.assertEqual(queryset.count(), 1)
    
    def test_room_filter_by_penyewa(self):
        """Test Room can be filtered by penyewa (my_room logic)"""
        queryset = Room.objects.filter(penyewa=self.penyewa)
        self.assertEqual(queryset.count(), 1)
        self.assertEqual(queryset.first(), self.room2)
    
    def test_room_filter_available_in_kos(self):
        """Test Room can filter available rooms in specific kos"""
        queryset = Room.objects.filter(kos=self.kos1, status='available')
        self.assertEqual(queryset.count(), 1)


# ==================== RENTAL QUERYSET TESTS ====================

class RentalQuerySetTest(TestCase):
    """Test Rental queryset operations"""
    
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin',
            password='testpass123',
            role='admin'
        )
        self.penyewa1 = User.objects.create_user(
            username='penyewa1',
            password='testpass123',
            role='penyewa'
        )
        self.penyewa2 = User.objects.create_user(
            username='penyewa2',
            password='testpass123',
            role='penyewa'
        )
        self.kos = Kos.objects.create(
            name='ChipKost',
            address='Jl. Sudirman',
            owner=self.admin_user
        )
        self.room1 = Room.objects.create(
            kos=self.kos, room_number='101', floor=1, price=Decimal('500000.00')
        )
        self.room2 = Room.objects.create(
            kos=self.kos, room_number='102', floor=1, price=Decimal('500000.00')
        )
        self.rental1 = Rental.objects.create(
            room=self.room1, penyewa=self.penyewa1, 
            start_date=date(2025, 1, 1), harga_bulanan=Decimal('500000.00'),
            status='active'
        )
        self.rental2 = Rental.objects.create(
            room=self.room2, penyewa=self.penyewa2,
            start_date=date(2025, 1, 1), harga_bulanan=Decimal('500000.00'),
            status='expired'
        )
    
    def test_rental_filter_by_penyewa(self):
        """Test Rental can be filtered by penyewa (RentalViewSet logic)"""
        queryset = Rental.objects.filter(penyewa=self.penyewa1)
        self.assertEqual(queryset.count(), 1)
        self.assertEqual(queryset.first(), self.rental1)
    
    def test_rental_filter_by_status(self):
        """Test Rental can be filtered by status"""
        queryset = Rental.objects.filter(status='active')
        self.assertEqual(queryset.count(), 1)
    
    def test_rental_filter_by_room(self):
        """Test Rental can be filtered by room"""
        queryset = Rental.objects.filter(room=self.room1)
        self.assertEqual(queryset.count(), 1)
