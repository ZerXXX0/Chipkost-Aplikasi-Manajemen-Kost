#!/usr/bin/env python
"""
Script to clear database except adminkos1 user
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chipkost.settings')
django.setup()

from django.contrib.auth import get_user_model
from rooms.models import Kos, Room, Rental
from billing.models import Invoice, Pembayaran, LaporanKeuangan
from complaints.models import Kerusakan
from rfid.models import RFIDCard, AccessLog
from notifications.models import Notif

User = get_user_model()

def clear_database():
    # Simpan admin user
    admin_user = User.objects.filter(username='adminkos1').first()
    
    if not admin_user:
        print('ERROR: Admin user adminkos1 not found!')
        return
    
    print(f'✓ Admin user found: {admin_user.username}')
    print('\nClearing database...\n')
    
    # Hapus semua data dalam urutan yang benar (menghindari foreign key constraint)
    print('1. Deleting AccessLog...')
    count = AccessLog.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('2. Deleting RFIDCard...')
    count = RFIDCard.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('3. Deleting Notif...')
    count = Notif.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('4. Deleting LaporanKeuangan...')
    count = LaporanKeuangan.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('5. Deleting Pembayaran...')
    count = Pembayaran.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('6. Deleting Invoice...')
    count = Invoice.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('7. Deleting Kerusakan...')
    count = Kerusakan.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('8. Deleting Rental...')
    count = Rental.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('9. Deleting Room...')
    count = Room.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('10. Deleting Kos...')
    count = Kos.objects.all().delete()[0]
    print(f'   Deleted {count} records')
    
    print('11. Deleting Users (except adminkos1)...')
    count = User.objects.exclude(username='adminkos1').delete()[0]
    print(f'   Deleted {count} records')
    
    print('\n✅ Database cleared successfully!')
    print(f'✅ Remaining user: {admin_user.username} (ID: {admin_user.id}, Role: {admin_user.role})')
    print(f'   Email: {admin_user.email}')

if __name__ == '__main__':
    confirm = input('Are you sure you want to clear the database? This will delete ALL data except adminkos1 user. Type "YES" to confirm: ')
    if confirm == 'YES':
        clear_database()
    else:
        print('Operation cancelled.')
