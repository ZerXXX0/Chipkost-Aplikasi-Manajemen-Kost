# Chipkost - Boarding House Management System

A web-based boarding house (kos) management system built with Django REST Framework and React.

## Features

### For Admin

- ✅ User authentication and authorization
- 🏠 Manage kos and rooms
- 👥 Register and manage tenants
- 💰 Automatic monthly billing
- 📊 Financial reports
- 📝 Handle complaints
- 🔐 RFID card registration (coming soon)
- 📹 CCTV integration (coming soon)

### For Tenants

- ✅ Secure login
- 🏠 View room details
- 💳 View monthly invoices and payment history
- 📝 Submit complaints

## Tech Stack

### Backend

- **Django 5.0.3** - Python web framework
- **Django REST Framework** - REST API
- **MySQL** - Database
- **JWT Authentication** - Secure token-based auth
- **Channels** - WebSocket support for RFID

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
chipkost/
├── backend/
│   ├── accounts/          # User authentication
│   ├── rooms/             # Room and rental management
│   ├── billing/           # Invoice and payment
│   ├── complaints/        # Complaint management
│   ├── rfid/             # RFID card management
│   └── chipkost/         # Project settings
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login & Register
│   │   │   ├── admin/    # Admin dashboard
│   │   │   └── tenant/   # Tenant dashboard
│   │   └── services/     # API services
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Create MySQL database**

   ```sql
   CREATE DATABASE chipkost_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and set your database credentials
   ```

6. **Run migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (admin)**

   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**

   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/profile/` - Get user profile

### Coming Soon

- Room management endpoints
- Billing endpoints
- Complaint endpoints
- RFID endpoints

## Default Login Credentials

After creating a superuser, you can login with:

- **Username**: (your superuser username)
- **Password**: (your superuser password)

Or register a new account at `/register`

## Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=chipkost_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Development

### Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm run dev
```

## Testing

### Test Registration & Login Flow

1. Start both backend and frontend servers
2. Go to `http://localhost:5173`
3. Click "Register here"
4. Fill the registration form:
   - Username: testuser
   - Email: test@example.com
   - Password: testpass123
   - Role: Choose Admin or Tenant
5. After registration, you'll be redirected to the dashboard
6. Logout and try logging in again

## Troubleshooting

### MySQL Connection Error

- Make sure MySQL is running
- Check database credentials in `.env`
- Verify database exists

### CORS Error

- Check `CORS_ALLOWED_ORIGINS` in backend settings
- Ensure frontend URL is included

### Port Already in Use

- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.js`

## Next Steps

- [ ] Implement room management
- [ ] Implement billing system with auto-generation
- [ ] Implement complaint system
- [ ] Implement RFID integration
- [ ] Add payment gateway integration
- [ ] Add CCTV feed integration
- [ ] Add financial reports
- [ ] Deploy to production

## License

This project is developed for educational purposes.

## Contributors

- Your Team Name
