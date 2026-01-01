# ChipKost - Aplikasi Manajemen Kost

A comprehensive web-based boarding house (kos) management system with integrated payment gateway, RFID access control, and CCTV monitoring. Built with Django REST Framework and React.

## 🌟 Key Features
For testing purpose, open the website link on github description, enter this credentials
Login Info Pemilik/Owner/Admin
username: admin1
pass: admin1

Login Info Penyewa/Tenant
username: Ghozy
pass: {Admin123}

## 🌟 Key Features

### For Admin (Kos Owner)

- ✅ **User Management** - Register and manage tenants with role-based access
- 🏠 **Property Management** - Manage multiple kos properties and rooms
- 👥 **Tenant Assignment** - Assign tenants to rooms with automatic rental tracking
- 💰 **Automated Billing** - Automatic monthly invoice generation with payment tracking
- 💳 **Payment Gateway** - Integrated Midtrans payment gateway for online payments
- 📊 **Financial Reports** - Comprehensive monthly financial reports and analytics
- 📝 **Complaint Management** - Track and manage tenant complaints efficiently
- 🔐 **RFID Access Control** - Register and manage RFID cards for room access
- 📹 **CCTV Monitoring** - Live CCTV feed integration with multi-camera support
- 📧 **Notifications** - Real-time notifications for payments, complaints, and system events

### For Tenants (Penyewa)

- ✅ **Secure Authentication** - JWT-based secure login system
- 🏠 **Room Information** - View assigned room details and rental period
- 💳 **Payment System** - Pay monthly rent via Midtrans (multiple payment methods)
- 📄 **Invoice History** - View and download all invoices (paid and unpaid)
- 📝 **Complaint Submission** - Submit and track maintenance complaints
- 🔐 **RFID Card Info** - View registered RFID card details
- 📹 **CCTV Access** - View CCTV feeds for common areas (if enabled)
- 🔔 **Real-time Notifications** - Receive payment reminders and updates

## 🛠 Tech Stack

### Backend

- **Django 5.0.3** - High-level Python web framework
- **Django REST Framework 3.14** - Powerful REST API toolkit
- **MySQL 8.0** - Relational database
- **Django Channels** - WebSocket support for real-time features
- **JWT (djangorestframework-simplejwt)** - Secure token-based authentication
- **Midtrans Python SDK** - Payment gateway integration
- **Pillow** - Image processing for profile pictures and proof uploads
- **python-dateutil** - Advanced date handling

### Frontend

- **React 18** - Modern JavaScript UI library
- **Vite 5** - Next-generation frontend build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful & consistent icon set
- **Midtrans Snap** - Payment gateway frontend integration

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Radon** - Python code complexity analysis

## 📁 Project Structure

```
chipkost/
├── backend/
│   ├── accounts/          # User authentication & management
│   │   ├── models.py      # Custom User model
│   │   ├── serializers.py # User data serialization
│   │   ├── views.py       # Auth endpoints
│   │   └── urls.py        # Auth routes
│   ├── rooms/             # Property & room management
│   │   ├── models.py      # Kos, Room, Rental, CctvCamera models
│   │   ├── serializers.py # Room data serialization
│   │   ├── views.py       # Room CRUD endpoints
│   │   └── urls.py        # Room routes
│   ├── billing/           # Payment & invoicing system
│   │   ├── models.py      # Invoice, Pembayaran, LaporanKeuangan
│   │   ├── serializers.py # Billing data serialization
│   │   ├── views.py       # Payment & invoice endpoints
│   │   └── urls.py        # Billing routes
│   ├── complaints/        # Complaint management
│   │   ├── models.py      # Kerusakan (complaint) model
│   │   ├── serializers.py # Complaint serialization
│   │   └── views.py       # Complaint endpoints
│   ├── notifications/     # Notification system
│   │   ├── models.py      # Notif model
│   │   └── views.py       # Notification endpoints
│   ├── rfid/             # RFID access control
│   │   ├── models.py      # RFIDCard, AccessLog models
│   │   ├── consumers.py   # WebSocket handlers
│   │   └── views.py       # RFID endpoints
│   ├── chipkost/         # Project configuration
│   │   ├── settings.py    # Django settings
│   │   ├── urls.py        # Main URL configuration
│   │   ├── asgi.py        # ASGI config for WebSocket
│   │   └── wsgi.py        # WSGI config
│   ├── media/            # User uploads (images, proofs)
│   ├── manage.py         # Django management script
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── dashboard/
│   │   │   ├── auth/
│   │   │   └── common/
│   │   ├── context/      # React context (Auth)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login & Register
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── UsersPage.jsx
│   │   │   │   ├── KosPage.jsx
│   │   │   │   ├── KosDetailPage.jsx
│   │   │   │   ├── FinancialPage.jsx
│   │   │   │   ├── ComplaintsPage.jsx
│   │   │   │   ├── RFIDPage.jsx
│   │   │   │   └── CCTVPage.jsx
│   │   │   └── penyewa/  # Tenant dashboard pages
│   │   │       ├── DashboardPage.jsx
│   │   │       ├── PaymentsPage.jsx
│   │   │       ├── ComplaintsPage.jsx
│   │   │       └── ProfilePage.jsx
│   │   ├── services/     # API service modules
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js   # Auth API calls
│   │   │   └── dashboardService.js
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json      # Node dependencies
├── asset/                # Documentation assets
├── README.md            # This file
├── SETUP_GUIDE.md       # Detailed setup instructions
├── QUICK_REFERENCE.md   # Quick reference guide
└── DATABASE_SCHEMA.md   # Database documentation
```

## 🚀 Quick Start

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Git

### Quick Setup

1. **Clone and setup backend**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

2. **Setup frontend** (in new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## 📚 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - API quick reference
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database structure
- [CLASS_DIAGRAM.md](CLASS_DIAGRAM.md) - System architecture

## 🔑 Key Functionalities

### 1. User Management

- **Registration**: Admin can register new tenants through the system
- **Authentication**: JWT-based secure login with role-based access
- **User Roles**: Admin (kos owner) and Penyewa (tenant)

### 2. Room Management

- **Property Setup**: Create multiple kos properties with details
- **Room Assignment**: Assign tenants to rooms with automatic rental creation
- **Rental Period**: 1-day trial period forces web-based payment
- **Status Tracking**: Available, Occupied, Maintenance

### 3. Payment System

- **Auto Billing**: Invoices auto-generated when rental period < 6 months
- **Payment Options**: 1, 6, or 12 months advance payment
- **Midtrans Integration**: Multiple payment methods (Credit/Debit, E-wallet, Bank Transfer)
- **Invoice Management**: Download invoices as PDF
- **Duplicate Prevention**: Smart detection of duplicate/superseded invoices

### 4. Financial Management

- **Monthly Reports**: Automatic financial report generation
- **Revenue Tracking**: Track income from all properties
- **Payment History**: Complete payment audit trail

### 5. Complaint System

- **Tenant Submission**: Tenants can submit maintenance complaints with photos
- **Status Tracking**: Pending, In Progress, Completed
- **Admin Dashboard**: Centralized complaint management

### 6. RFID Access Control

- **Card Registration**: Register RFID cards for tenants
- **Access Logging**: Track room access with timestamps
- **Real-time Updates**: WebSocket-based live access monitoring

### 7. CCTV Integration

- **Multi-camera Support**: Multiple CCTV feeds per property
- **Live Streaming**: Real-time video feed viewing
- **Access Control**: Role-based CCTV access

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with Django's built-in system
- CORS protection
- SQL injection prevention (Django ORM)
- XSS protection (React sanitization)
- CSRF protection
- Secure payment gateway integration

## 🎯 API Endpoints

### Authentication (`/api/auth/`)

- `POST /register/` - Register new user
- `POST /login/` - User login
- `POST /logout/` - User logout
- `GET /profile/` - Get user profile
- `PUT /profile/` - Update profile
- `GET /users/` - List all users (admin only)
- `DELETE /users/{id}/delete/` - Delete user (admin only)

### Rooms (`/api/kamar/`)

- `GET /` - List all rooms
- `POST /` - Create room
- `GET /{id}/` - Get room detail
- `PUT /{id}/` - Update room (also handles tenant assignment)
- `DELETE /{id}/` - Delete room
- `GET /my-room/` - Get current user's room

### Kos (`/api/kos/`)

- `GET /` - List all kos properties
- `POST /` - Create kos
- `GET /{id}/` - Get kos detail
- `PUT /{id}/` - Update kos
- `DELETE /{id}/` - Delete kos

### Rentals (`/api/rental/`)

- `GET /` - List all rentals
- `POST /` - Create rental
- `POST /extend/` - Extend rental period
- `GET /{id}/` - Get rental detail

### Payments (`/api/pembayaran/`)

- `GET /` - List payments
- `POST /create-snap-transaction/` - Create Midtrans payment
- `POST /midtrans-notification/` - Midtrans webhook
- `GET /rental-info/` - Get rental info with payment status

### Invoices (`/api/invoice/`)

- `GET /` - List invoices
- `GET /{id}/` - Get invoice detail
- `GET /{id}/download/` - Download invoice PDF

### Complaints (`/api/kerusakan/`)

- `GET /` - List complaints
- `POST /` - Submit complaint
- `PUT /{id}/` - Update complaint status

### RFID (`/api/rfid/`)

- `GET /cards/` - List RFID cards
- `POST /cards/register/` - Register new card
- `DELETE /cards/{id}/` - Delete card
- `GET /access-logs/` - List access logs

### CCTV (`/api/cctv/`)

- `GET /` - List CCTV cameras
- `POST /` - Add camera
- `PUT /{id}/` - Update camera
- `DELETE /{id}/` - Delete camera

### Notifications (`/api/notifikasi/`)

- `GET /` - List user notifications
- `PUT /{id}/mark-as-read/` - Mark as read

## 💾 Database Schema

### Main Tables

- `users` - User accounts (admin, penyewa)
- `kos` - Kos properties
- `rooms` - Room listings
- `rentals` - Rental records
- `invoices` - Payment invoices
- `pembayaran` - Payment transactions
- `laporan_keuangan` - Monthly financial reports
- `kerusakan` - Complaints/maintenance requests
- `rfid_cards` - RFID card registrations
- `access_logs` - Room access history
- `cctv_cameras` - CCTV camera configurations
- `notifications` - User notifications

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Code Quality Analysis

```bash
# Complexity analysis
radon cc backend/ -a

# Maintainability index
radon mi backend/

# Raw metrics
radon raw backend/
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Real-time Updates**: Live notifications and status updates
- **Data Visualization**: Charts and graphs for financial data
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: User-friendly error messages
- **Dark Mode Ready**: CSS structure supports dark mode

## 🔄 Workflow Examples

### Admin Workflow: Adding New Tenant

1. Register user account (role: penyewa)
2. Create/select kos property
3. Assign tenant to available room
4. System automatically:
   - Creates 1-day trial rental
   - Generates unpaid invoice
   - Sends notification to tenant

### Tenant Workflow: Paying Rent

1. Login to dashboard
2. View unpaid invoices
3. Click "Bayar" (Pay)
4. Choose payment period (1/6/12 months)
5. Complete payment via Midtrans
6. System automatically:
   - Updates invoice status
   - Extends rental period
   - Cancels superseded invoices
   - Updates financial report
   - Sends confirmation notification

## 📊 Business Logic

### Rental Period Management

- **Initial Assignment**: 1-day trial to force web payment
- **Auto Invoice Generation**: When remaining period < 6 months
- **Payment Options**: Flexible 1, 6, or 12-month payments
- **Period Extension**: Automatic extension upon successful payment

### Invoice Superseding

- **Smart Detection**: System detects overlapping invoice periods
- **Auto Cancellation**: Older invoices cancelled when covered by new payment
- **Duplicate Prevention**: Prevents showing duplicate paid invoices

### Financial Reports

- **Auto Generation**: Monthly reports generated automatically
- **Revenue Tracking**: Tracks all completed payments
- **Room Occupancy**: Monitors occupied vs available rooms

## 🛡️ Error Handling

- **Payment Failures**: Automatic status updates and retry options
- **Network Errors**: User-friendly error messages with retry
- **Validation**: Client and server-side validation
- **Database Constraints**: Proper foreign key relationships
- **Timeout Handling**: 60-second timeout for payment popups

## 🚧 Known Limitations

- CCTV live streaming requires specific camera models
- RFID WebSocket requires persistent connection
- Payment gateway limited to Midtrans sandbox in development
- File uploads limited to 5MB per file

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] WhatsApp notification integration
- [ ] Email notification system
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Tenant rating system
- [ ] Automated contract generation
- [ ] Integration with more payment gateways
- [ ] Biometric access control
- [ ] AI-powered complaint categorization

## ⚙️ Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=chipkost_dbv2
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=False

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=media
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

### Midtrans Setup

1. Register at https://dashboard.sandbox.midtrans.com/
2. Get Server Key and Client Key from Settings
3. Add keys to backend `.env` file
4. Test with sandbox credit card: 4811 1111 1111 1114

## 📱 Deployment

### Backend (Django)

1. Set `DEBUG=False`
2. Configure production database
3. Set `MIDTRANS_IS_PRODUCTION=True`
4. Collect static files: `python manage.py collectstatic`
5. Use Gunicorn/uWSGI for production server
6. Configure Nginx as reverse proxy

### Frontend (React)

1. Build production: `npm run build`
2. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
3. Update `VITE_API_URL` to production backend URL

## 🐛 Troubleshooting

### MySQL Connection Error

```bash
# Check MySQL is running
sudo systemctl status mysql

# Reset password if needed
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

### CORS Error

- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Check browser console for exact error
- Clear browser cache

### Midtrans Payment Not Working

- Verify Server Key and Client Key
- Check `MIDTRANS_IS_PRODUCTION` setting
- Use sandbox test cards from Midtrans docs
- Check browser console for Snap errors

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Migration Errors

```bash
# Reset migrations (use with caution!)
python manage.py migrate --fake
python manage.py migrate --run-syncdb

# Or clear database and re-migrate
python manage.py flush
python manage.py migrate
```

## 📞 Support

For issues and questions:

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for API usage
- Check existing issues in repository
- Contact development team

## 👥 Contributors

**ChipKost Development Team**

- Backend Development: Django REST Framework
- Frontend Development: React + Vite
- Database Design: MySQL
- Payment Integration: Midtrans
- Access Control: RFID System
- Monitoring: CCTV Integration

## 📄 License

This project is developed for educational purposes as part of Software Engineering (IMPAL) course project.

## 🙏 Acknowledgments

- Django & Django REST Framework community
- React & Vite community
- Midtrans payment gateway
- Tailwind CSS framework
- All open-source contributors

---

**Project Status**: ✅ Production Ready

**Last Updated**: December 24, 2025

**Version**: 1.0.0
