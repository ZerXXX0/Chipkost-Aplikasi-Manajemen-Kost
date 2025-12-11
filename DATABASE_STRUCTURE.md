# Chipkost Database Structure

Updated according to your requirements. All tables have been created and migrations applied successfully.

## 📊 Database Tables

### 1. **USER** (Tabel USER)

**Purpose**: Store user information (Admin & Tenant)

| Kolom        | Tipe           | Keterangan                           |
| ------------ | -------------- | ------------------------------------ |
| `user_id`    | AutoField (PK) | User ID (auto-generated)             |
| `username`   | CharField      | Username (unique)                    |
| `nama`       | CharField      | Full name (via first_name/last_name) |
| `email`      | EmailField     | Email address (unique)               |
| `password`   | CharField      | Hashed password                      |
| `role`       | CharField      | 'admin' or 'tenant'                  |
| `no_hp`      | CharField      | Phone number (phone_number field)    |
| `is_active`  | BooleanField   | Account status                       |
| `created_at` | DateTimeField  | Account creation date                |
| `updated_at` | DateTimeField  | Last update date                     |

**Model Location**: `accounts/models.py` → `User`

---

### 2. **KAMAR** (Tabel KAMAR)

**Purpose**: Store room information in boarding houses

| Kolom         | Tipe              | Keterangan                                |
| ------------- | ----------------- | ----------------------------------------- |
| `kamar_id`    | BigAutoField (PK) | Room ID (auto-generated)                  |
| `nomor_kamar` | CharField         | Room number (e.g., "101", "A-05")         |
| `hrga`        | DecimalField      | Room price per month                      |
| `status`      | CharField         | 'available', 'occupied', 'maintenance'    |
| `penyewa_id`  | ForeignKey        | Tenant ID (foreign key to USER)           |
| `floor`       | IntegerField      | Floor number                              |
| `kos_id`      | ForeignKey        | Boarding house ID                         |
| `facilities`  | TextField         | Available facilities (AC, WiFi, TV, etc.) |
| `capacity`    | IntegerField      | Room capacity                             |
| `image`       | ImageField        | Room photo                                |
| `created_at`  | DateTimeField     | Creation date                             |
| `updated_at`  | DateTimeField     | Last update date                          |

**Model Location**: `rooms/models.py` → `Room`

---

### 3. **PEMBAYARAN** (Tabel PEMBAYARAN)

**Purpose**: Track all tenant payments

| Kolom            | Tipe           | Keterangan                                    |
| ---------------- | -------------- | --------------------------------------------- |
| `pembayaran_id`  | AutoField (PK) | Payment ID (auto-generated)                   |
| `penyewa_id`     | ForeignKey     | Tenant ID (foreign key to USER)               |
| `kamar_id`       | ForeignKey     | Room ID (foreign key to KAMAR)                |
| `tgl_bayar`      | DateTimeField  | Payment date (auto-set)                       |
| `jumlah`         | DecimalField   | Payment amount                                |
| `metode`         | CharField      | 'cash', 'bank_transfer', 'qris', 'e_wallet'   |
| `status`         | CharField      | 'pending', 'completed', 'failed', 'cancelled' |
| `transaction_id` | CharField      | Transaction identifier                        |
| `payment_proof`  | ImageField     | Payment receipt image                         |
| `verified_by`    | ForeignKey     | Admin who verified (FK to USER)               |
| `verified_at`    | DateTimeField  | Verification timestamp                        |

**Model Location**: `billing/models.py` → `Pembayaran`

---

### 4. **NOTIF** (Tabel NOTIF)

**Purpose**: Store notifications for users

| Kolom      | Tipe           | Keterangan                    |
| ---------- | -------------- | ----------------------------- |
| `notif_id` | AutoField (PK) | Notification ID               |
| `user_id`  | ForeignKey     | User ID (foreign key to USER) |
| `pesan`    | TextField      | Notification message          |
| `tgl`      | DateTimeField  | Notification date (auto-set)  |
| `status`   | CharField      | 'unread', 'read', 'archived'  |

**Model Location**: `notifications/models.py` → `Notif`

---

### 5. **LAPORAN_KEUANGAN** (Tabel LAPORAN_KEUANGAN)

**Purpose**: Store monthly financial reports

| Kolom               | Tipe           | Keterangan                 |
| ------------------- | -------------- | -------------------------- |
| `laporan_id`        | AutoField (PK) | Report ID                  |
| `bulan`             | DateField      | Month (first day of month) |
| `total_pemasukan`   | DecimalField   | Total income               |
| `total_pengeluaran` | DecimalField   | Total expenses             |
| `saldo`             | DecimalField   | Balance (auto-calculated)  |
| `created_at`        | DateTimeField  | Report creation date       |
| `updated_at`        | DateTimeField  | Last update date           |

**Model Location**: `billing/models.py` → `LaporanKeuangan`

---

### 6. **KERUSAKAN** (Tabel KERUSAKAN)

**Purpose**: Store damage/maintenance reports

| Kolom              | Tipe           | Keterangan                                       |
| ------------------ | -------------- | ------------------------------------------------ |
| `laporan_id`       | AutoField (PK) | Report ID                                        |
| `kamar_id`         | ForeignKey     | Room ID (foreign key to KAMAR)                   |
| `penyewa_id`       | ForeignKey     | Tenant ID (foreign key to USER)                  |
| `deskripsi`        | TextField      | Damage description                               |
| `tgl_lapor`        | DateTimeField  | Report date (auto-set)                           |
| `status`           | CharField      | 'pending', 'in_progress', 'resolved', 'rejected' |
| `priority`         | CharField      | 'low', 'medium', 'high', 'urgent'                |
| `image`            | ImageField     | Damage photo                                     |
| `assigned_to`      | ForeignKey     | Assigned admin (FK to USER)                      |
| `resolution_notes` | TextField      | Resolution details                               |
| `resolved_at`      | DateTimeField  | Resolution timestamp                             |

**Model Location**: `complaints/models.py` → `Kerusakan`

---

## 🔗 Relationships (Foreign Keys)

```
USER (1) ──┬──────→ KAMAR (many) [penyewa_id]
           ├──────→ PEMBAYARAN (many) [penyewa_id]
           ├──────→ NOTIF (many) [user_id]
           ├──────→ KERUSAKAN (many) [penyewa_id]
           └──────→ KERUSAKAN (many) [assigned_to]
                    (when assigned to admin)

KAMAR (1) ──┬──────→ PEMBAYARAN (many) [kamar_id]
            └──────→ KERUSAKAN (many) [kamar_id]
```

---

## 📁 App Structure

```
backend/
├── accounts/          # User management
│   └── models.py      # User model
├── rooms/             # Kos & Room management
│   └── models.py      # Kos, Room, Rental models
├── billing/           # Payment & Financial reports
│   └── models.py      # Pembayaran, LaporanKeuangan models
├── complaints/        # Damage reports
│   └── models.py      # Kerusakan model
├── notifications/     # Notifications (NEW)
│   └── models.py      # Notif model
└── rfid/              # RFID card management
    └── models.py
```

---

## ✅ Migration History

- **0001_initial**: Initial migration
- **0002_room_penyewa**: Added `penyewa_id` field to Room
- **0002_laporankeuangan_pembayaran_delete_payment**: Created Pembayaran & LaporanKeuangan models
- **0002_kerusakan_delete_complaint**: Renamed Complaint to Kerusakan

---

## 🔧 Admin Interface

All models are registered in Django Admin with appropriate:

- List display fields
- Filters
- Search fields
- Read-only fields

**Admin URL**: `http://localhost:8000/admin/`

---

## 📝 Notes

1. All `_id` fields are auto-generated by Django
2. All date fields with "tgl" are `DateTimeField` for precision
3. Status fields use `CharField` with `choices`
4. Foreign keys automatically create index for better query performance
5. The `saldo` field in LAPORAN_KEUANGAN is auto-calculated on save
6. Backward compatibility maintained with `Complaint = Kerusakan` alias
