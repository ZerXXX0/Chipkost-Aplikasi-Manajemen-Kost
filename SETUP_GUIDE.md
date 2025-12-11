# 🚀 Chipkost - Setup & Database Guide

## ✅ Your Current Status

### Backend Status

- ✅ Django project created
- ✅ All apps created (accounts, rooms, billing, complaints, rfid)
- ✅ Models defined with proper relationships
- ✅ Authentication system ready (JWT)
- ✅ Django settings configured

### Frontend Status

- ✅ React project created
- ✅ Login page matching your Figma design ✨
- ✅ Registration page created
- ✅ AuthContext for state management
- ✅ API service configured
- ✅ TailwindCSS ready

---

## 📋 Database Setup

### Your Original Schema vs Django Schema

**❌ Your Tables (Don't use these):**

```sql
USER, KAMAR, PEMBAYARAN, NOTIF, LAPORAN_KEUANGAN, KERUSAKAN
```

**✅ Django Will Create (Use these):**

```sql
users                 # User accounts
kos                   # Kos properties
rooms                 # Room details
rentals               # Rental contracts
invoices              # Monthly bills
payments              # Payment records
complaints            # Damage reports
rfid_cards            # RFID card registry
access_logs           # Door access logs
```

### Why Django Tables Are Better:

1. **Password Security**: Django hashes passwords (yours was plain VARCHAR)
2. **Built-in Auth**: Login/logout/sessions handled automatically
3. **Relationships**: Foreign keys with proper constraints
4. **Migrations**: Easy schema updates without manual SQL
5. **Admin Panel**: Free UI to manage all data

---

## 🛠️ Complete Setup Instructions

### Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run these commands:
DROP DATABASE IF EXISTS chipkost_db;
CREATE DATABASE chipkost_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 2: Backend Setup

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run migrations (creates all tables automatically)
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Username: admin
# Email: admin@chipkost.com
# Password: (your choice)

# Start backend server
python manage.py runserver
```

**Backend will run on:** `http://localhost:8000`

### Step 3: Frontend Setup

```bash
# In a NEW terminal
cd frontend

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 🎯 Test Your Login

1. Open `http://localhost:5173`
2. You'll see your beautiful login page with:

   - Chipkost chip logo background
   - Email field
   - Password field
   - Blue login button
   - "Forget Password?" link
   - "Sign Up" link

3. Try logging in with the admin user you created!

---

## 📊 Django Database Tables Explained

### 1. **users** (Your USER table)

```python
- id (auto)
- username
- email
- password (hashed by Django!)
- role: 'admin' or 'tenant' (not 'pemilik'/'penyewa')
- first_name, last_name
- phone_number
- profile_picture
- created_at, updated_at
```

### 2. **rooms** (Your KAMAR table)

```python
- id
- kos_id (foreign key to kos table)
- room_number (nomor_kamar)
- price (harga)
- status: 'available', 'occupied', 'maintenance'
- description, capacity, facilities
- image
```

### 3. **invoices** (Your PEMBAYARAN table - Part 1)

```python
- id
- rental_id (which room rental)
- tenant_id (penyewa)
- invoice_number
- amount (jumlah)
- billing_period_start, billing_period_end
- due_date
- status: 'unpaid', 'paid', 'overdue', 'cancelled'
```

### 4. **payments** (Your PEMBAYARAN table - Part 2)

```python
- id
- invoice_id (which invoice)
- amount
- payment_method: 'cash', 'bank_transfer', 'qris', 'e_wallet'
- payment_date (tgl_bayar)
- transaction_id
- payment_proof (upload image)
- verified_by (admin user)
```

### 5. **complaints** (Your KERUSAKAN table)

```python
- id
- tenant_id (penyewa)
- room_id (kamar)
- title, description (deskripsi)
- priority: 'low', 'medium', 'high', 'urgent'
- status: 'pending', 'in_progress', 'resolved', 'rejected'
- image
- assigned_to (admin)
- resolved_at
```

---

## 🔥 Key Differences from Your Schema

| Feature       | Your Schema             | Django Schema     |
| ------------- | ----------------------- | ----------------- |
| Password      | Plain text VARCHAR(255) | Hashed 128 chars  |
| User Roles    | 'pemilik', 'penyewa'    | 'admin', 'tenant' |
| Table Names   | UPPERCASE               | lowercase         |
| Relationships | Manual FK               | Django ORM        |
| Migrations    | Manual SQL              | Auto-generated    |
| Admin Panel   | None                    | Built-in          |

---

## 🚀 Quick Start Commands

```bash
# ONE-COMMAND SETUP (if MySQL password is empty)
./setup.sh

# OR Manual step-by-step:

# 1. Database
mysql -u root -p -e "DROP DATABASE IF EXISTS chipkost_db; CREATE DATABASE chipkost_db;"

# 2. Backend
cd backend && source venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 3. Frontend (new terminal)
cd frontend && npm run dev
```

---

## 📱 Access Points

| Service          | URL                                      | Purpose           |
| ---------------- | ---------------------------------------- | ----------------- |
| **Frontend**     | http://localhost:5173                    | Your login page   |
| **Backend API**  | http://localhost:8000                    | REST API          |
| **Admin Panel**  | http://localhost:8000/admin              | Manage data       |
| **API Login**    | http://localhost:8000/api/auth/login/    | Auth endpoint     |
| **API Register** | http://localhost:8000/api/auth/register/ | Register endpoint |

---

## ✅ Verification Checklist

- [ ] MySQL database `chipkost_db` created
- [ ] Django migrations ran successfully
- [ ] Admin user created
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can see login page matching your design
- [ ] Can login with admin credentials

---

## 🎨 Your Login Design Features

✅ **Implemented:**

- Chipkost chip logo as background
- Clean email + password fields
- Blue indigo button
- "Forget Password?" link
- "Sign Up" link
- Decorative dots (top-right, bottom-left)
- Responsive design
- Loading states
- Error messages

---

## 🔧 Troubleshooting

### "Can't connect to MySQL"

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Update backend/.env with your MySQL password
DB_PASSWORD=your_mysql_password
```

### "Module not found"

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "npm command not found"

```bash
# Install Node.js from https://nodejs.org
# Then:
cd frontend
npm install
```

---

## 📝 Next Steps

1. ✅ Run setup.sh
2. ✅ Create admin user
3. ✅ Test login page
4. 📋 Create first Kos property in admin panel
5. 📋 Add rooms to the Kos
6. 📋 Register first tenant
7. 📋 Create rental contract
8. 📋 Generate invoice
9. 🎨 Build tenant dashboard
10. 🎨 Build admin dashboard

---

## 💡 Pro Tips

1. **Use Django Admin** (http://localhost:8000/admin) to:

   - Add test data
   - View all tables
   - Test relationships

2. **Auto-generate invoices**: Django can create monthly invoices automatically (we'll implement this)

3. **RFID Integration**: WebSocket setup ready for real-time card detection

4. **Role-based views**: Login redirects admin → `/admin` and tenant → `/tenant`

---

Need help? Check the files:

- `backend/chipkost/settings.py` - Django config
- `backend/accounts/models.py` - User model
- `frontend/src/pages/auth/Login.jsx` - Your login design
- `frontend/src/services/authService.js` - API calls

🎉 **Your Chipkost project is ready to go!**
