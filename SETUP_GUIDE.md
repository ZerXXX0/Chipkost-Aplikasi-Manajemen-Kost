# ChipKost - Complete Setup Guide

This guide provides step-by-step instructions to set up the ChipKost project from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Pre-Installation](#pre-installation)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Midtrans Integration](#midtrans-integration)
7. [Testing the Application](#testing-the-application)
8. [Common Issues](#common-issues)
9. [Production Deployment](#production-deployment)

---

## System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Internet**: Stable connection for dependencies

### Required Software

1. **Python 3.11 or higher**

   - Download: https://www.python.org/downloads/
   - Verify: `python3 --version`

2. **Node.js 18 or higher**

   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **MySQL 8.0 or higher**

   - Download: https://dev.mysql.com/downloads/
   - Verify: `mysql --version`

4. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

---

## Pre-Installation

### 1. Clone the Repository

```bash
# Clone the project
git clone <repository-url>
cd IMPAL

# Project structure should look like:
# IMPAL/
# ├── backend/
# ├── frontend/
# └── README.md
```

### 2. Check Python Installation

```bash
# Check Python version (must be 3.11+)
python3 --version

# If not installed, download from python.org
# On macOS: brew install python@3.11
# On Ubuntu: sudo apt install python3.11
```

### 3. Check Node.js Installation

```bash
# Check Node.js version (must be 18+)
node --version
npm --version

# If not installed, download from nodejs.org
# Or use nvm (Node Version Manager)
```

---

## Database Setup

### 1. Start MySQL Server

#### On macOS:

```bash
brew services start mysql
# or
sudo mysql.server start
```

#### On Linux:

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### On Windows:

- Start MySQL from Services or MySQL Workbench

### 2. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Enter your MySQL root password
# Then run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE chipkost_dbv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create database user (optional but recommended)
CREATE USER 'chipkost_user'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON chipkost_dbv2.* TO 'chipkost_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify database created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### 3. Verify Database Access

```bash
# Test connection
mysql -u chipkost_user -p chipkost_dbv2

# Should connect successfully
# Exit with: EXIT;
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### 3. Install Python Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# This will install:
# - Django 5.0.3
# - djangorestframework 3.14.0
# - djangorestframework-simplejwt 5.3.1
# - django-cors-headers 4.3.1
# - mysqlclient 2.2.1
# - pillow 10.2.0
# - channels 4.0.0
# - midtransclient 1.3.1
# - python-dateutil 2.8.2
# And other dependencies...
```

### 4. Configure Environment Variables

```bash
# Create .env file in backend/ directory
touch .env

# Edit .env with your preferred editor
nano .env
# or
code .env
```

**Add the following to `.env`:**

```env
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=chipkost_dbv2
DB_USER=chipkost_user
DB_PASSWORD=secure_password_here
DB_HOST=localhost
DB_PORT=3306

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Midtrans Payment Gateway (Sandbox)
MIDTRANS_SERVER_KEY=your-server-key-here
MIDTRANS_CLIENT_KEY=your-client-key-here
MIDTRANS_IS_PRODUCTION=False

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=media
```

**Generate a new SECRET_KEY:**

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Run Database Migrations

```bash
# Create migration files
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# You should see output like:
# Running migrations:
#   Applying contenttypes.0001_initial... OK
#   Applying accounts.0001_initial... OK
#   Applying rooms.0001_initial... OK
#   ... etc
```

### 6. Create Superuser (Admin)

```bash
# Create admin account
python manage.py createsuperuser

# Enter the following when prompted:
# Username: admin
# Email: admin@chipkost.com
# Password: (choose a strong password)
# Password (again): (confirm password)
```

### 7. Collect Static Files

```bash
# Collect static files for Django admin
python manage.py collectstatic --noinput
```

### 8. Test Backend Server

```bash
# Start development server
python manage.py runserver

# Server should start on http://127.0.0.1:8000/
# Press Ctrl+C to stop
```

**Verify Backend is Working:**

- Open browser: http://localhost:8000/admin
- Login with superuser credentials
- You should see Django admin panel

---

## Frontend Setup

### 1. Open New Terminal

Keep backend server running and open a new terminal window.

### 2. Navigate to Frontend Directory

```bash
cd frontend
# or from project root:
cd IMPAL/frontend
```

### 3. Install Node Dependencies

```bash
# Install all dependencies from package.json
npm install

# This will install:
# - React 18.x
# - React Router DOM 6.x
# - Axios
# - Tailwind CSS
# - Vite
# - And other dependencies...

# Wait for installation to complete (may take 2-5 minutes)
```

### 4. Configure Environment Variables

```bash
# Create .env file in frontend/ directory
touch .env

# Edit .env
nano .env
```

**Add the following to `.env`:**

```env
VITE_API_URL=http://localhost:8000
```

### 5. Verify Tailwind Configuration

Check `tailwind.config.js` exists with content:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 6. Start Frontend Development Server

```bash
# Start Vite dev server
npm run dev

# Server should start on http://localhost:5173/
# Output should show:
#   VITE v5.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/
```

**Verify Frontend is Working:**

- Open browser: http://localhost:5173
- You should see ChipKost login page

---

## Midtrans Integration

### 1. Create Sandbox Account

1. Go to: https://dashboard.sandbox.midtrans.com/register
2. Fill registration form
3. Verify email
4. Login to dashboard

### 2. Get API Keys

1. Go to **Settings** → **Access Keys**
2. Copy **Server Key**
3. Copy **Client Key**
4. Add to backend `.env`:

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=False
```

### 3. Test Payment Configuration

**Sandbox Test Cards:**

- **Success**: 4811 1111 1111 1114
- **Failed**: 4911 1111 1111 1113
- CVV: 123
- Expiry: 01/26 (any future date)

### 4. Restart Backend Server

```bash
# Stop server (Ctrl+C)
# Restart
python manage.py runserver
```

---

## Testing the Application

### 1. Create Test Data

#### A. Register Admin User (Web Interface)

1. Open: http://localhost:5173
2. Click "Register here"
3. Fill form:
   - First Name: Admin
   - Last Name: Kos
   - Username: adminkos1
   - Email: admin@chipkost.com
   - Phone: 081234567890
   - Password: Admin123!
   - Role: Admin
4. Click Register

#### B. Create Kos Property

1. Login as admin
2. Go to "Kelola Kos"
3. Click "Tambah Kos"
4. Fill form:
   - Name: Kos Putra Sejahtera
   - Address: Jl. Sudirman No. 123, Jakarta
   - City: Jakarta
5. Submit

#### C. Add Rooms

1. Click on the kos you created
2. Click "Tambah Kamar"
3. Fill form:
   - Room Number: 101
   - Price: 1200000
   - Status: Available
4. Repeat for more rooms

#### D. Register Tenant

1. Go to "Fitur" → "Buat User Baru"
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Username: john_doe
   - Email: john@example.com
   - Phone: 082345678901
   - Password: John123!
   - Role: Penyewa
3. Register

#### E. Assign Tenant to Room

1. Go to "Kelola Kos"
2. Click on your kos
3. Find an available room
4. Click "Assign Penyewa"
5. Select the tenant
6. Click Assign

### 2. Test Payment Flow

1. Logout from admin account
2. Login as tenant (john_doe)
3. Go to Dashboard
4. You should see unpaid invoice
5. Click "Bayar"
6. Choose payment period (1, 6, or 12 months)
7. Click "Lanjutkan Pembayaran"
8. Use sandbox test card: 4811 1111 1111 1114
9. Complete payment
10. Verify invoice status changes to "Lunas"

### 3. Test Other Features

#### RFID Card Registration

1. Login as admin
2. Go to "Fitur" → "RFID"
3. Add RFID card for tenant
4. Verify card appears in list

#### CCTV Management

1. Login as admin
2. Go to "Fitur" → "CCTV"
3. Add CCTV camera
4. Enter RTSP/HTTP stream URL
5. Verify camera appears

#### Complaint System

1. Login as tenant
2. Go to "Keluhan"
3. Click "Buat Keluhan Baru"
4. Fill complaint details
5. Upload photo (optional)
6. Submit
7. Login as admin to view complaints

---

## Common Issues

### Issue 1: Database Connection Error

**Error:** `django.db.utils.OperationalError: (2002, "Can't connect to MySQL server")`

**Solution:**

```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Start MySQL if not running
sudo systemctl start mysql  # Linux
brew services start mysql  # macOS

# Verify connection
mysql -u root -p
```

### Issue 2: Port Already in Use

**Error:** `Error: That port is already in use.`

**Solution:**

```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python manage.py runserver 8001
```

### Issue 3: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'xxx'`

**Solution:**

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 4: CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**

```python
# In backend/.env, ensure:
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Restart backend server
```

### Issue 5: Midtrans Snap Not Loading

**Error:** Payment popup doesn't appear

**Solution:**

1. Check browser console for errors
2. Verify Midtrans keys in `.env`
3. Clear browser cache
4. Try different browser
5. Check internet connection

### Issue 6: Migration Conflicts

**Error:** `Conflicting migrations detected`

**Solution:**

```bash
# Reset migrations (CAUTION: deletes data)
python manage.py migrate --fake
python manage.py migrate --run-syncdb

# Or manually delete migration files and recreate
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate
```

---

## Production Deployment

### Backend Deployment

#### 1. Update Settings

```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
MIDTRANS_IS_PRODUCTION = True
```

#### 2. Use Production Database

Update `.env` with production MySQL credentials.

#### 3. Collect Static Files

```bash
python manage.py collectstatic
```

#### 4. Use Production Server

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn chipkost.wsgi:application --bind 0.0.0.0:8000
```

#### 5. Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/staticfiles/;
    }

    location /media/ {
        alias /path/to/media/;
    }
}
```

### Frontend Deployment

#### 1. Build for Production

```bash
cd frontend

# Update API URL in .env
VITE_API_URL=https://api.yourdomain.com

# Build
npm run build
```

#### 2. Deploy to Hosting

**Option A: Vercel**

```bash
npm install -g vercel
vercel --prod
```

**Option B: Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option C: Static Hosting**

- Upload `dist/` folder to any static hosting
- Configure rewrites for SPA routing

---

## Maintenance

### Database Backup

```bash
# Backup database
mysqldump -u chipkost_user -p chipkost_dbv2 > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u chipkost_user -p chipkost_dbv2 < backup_20251224.sql
```

### Clear Database (Development Only)

```bash
cd backend
python manage.py flush  # Removes all data
python manage.py migrate  # Recreate tables
python manage.py createsuperuser  # Create admin again
```

### Update Dependencies

```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt --upgrade

# Frontend
npm update
```

---

## Support

If you encounter issues not covered here:

1. Check [README.md](README.md) for overview
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for API details
3. Check Django documentation: https://docs.djangoproject.com/
4. Check React documentation: https://react.dev/
5. Contact development team

---

**Setup Complete!** 🎉

You should now have a fully functional ChipKost application running locally.

Next steps:

- Explore the admin dashboard
- Test payment flows
- Add more kos properties and rooms
- Customize the application for your needs

Happy coding!
