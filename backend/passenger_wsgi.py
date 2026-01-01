import os
import sys

# Tambahkan path aplikasi backend ke sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Set environment variable untuk Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chipkost.settings')

# Import Django application
from chipkost.wsgi import application
