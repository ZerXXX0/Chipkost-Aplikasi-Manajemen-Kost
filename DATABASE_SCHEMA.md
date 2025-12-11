# 🗄️ Chipkost Database Schema Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────┐
│           USER (tabel users)        │
├─────────────────────────────────────┤
│ PK  user_id (BigAutoField)          │
│ --- username (CharField)            │
│ --- email (EmailField)              │
│ --- password (CharField)            │
│ --- role (CharField)                │
│     Choices: admin, tenant          │
│ --- no_hp (CharField)               │
│ --- is_active (BooleanField)        │
│ --- created_at (DateTimeField)      │
│ --- updated_at (DateTimeField)      │
└─────────────┬───────────────────────┘
              │
    ┌─────────┼─────────┬───────────────────────┐
    │         │         │                       │
    │1        │1        │1                      │1
    │(N)      │(N)      │(N)                    │(N)
    │         │         │                       │
    ▼         ▼         ▼                       ▼
┌─────────┐┌──────────┐┌──────────┐  ┌──────────────────┐
│  KAMAR  ││PEMBAYARAN││  NOTIF   │  │   KERUSAKAN      │
├─────────┤├──────────┤├──────────┤  ├──────────────────┤
│PK kamar_││PK        ││PK notif_ │  │PK laporan_id     │
│   id    ││  pembaya-││   id     │  │ (AutoField)      │
│         ││  ran_id  ││          │  │                  │
│FK penyewa│FK penyewa│FK user_id │  │FK kamar_id       │
│   _id   ││   _id   ││          │  │FK penyewa_id     │
│         ││         ││pesan     │  │                  │
│nomor_   ││jumlah   ││(TextField) │deskripsi         │
│kamar    ││         ││          │  │ (TextField)      │
│         ││metode   ││tgl       │  │                  │
│hrga     ││('cash',││(DatetimeF)  │tgl_lapor         │
│(price)  ││'btr')  ││          │  │ (DatetimeField)  │
│         ││         ││status    │  │                  │
│status   ││status   ││(unread,  │  │status            │
│('avail.','pending') │read)    │  │('pending',...)   │
│'occupie'║'complet'││          │  │                  │
│'maintnd'║'failed'║└──────────┘  │priority          │
│         ║'cancel'│             │(low,med,...)    │
│FK kos_id║        │             │                  │
│         ║FK kamar_              │resolved_at       │
│penyewa  ║   id   │             │ (DateTimeField)  │
│(name)   ║        │             │                  │
│floor    ║tgl_bayar              │assigned_to       │
│capacity ║(DatetimeF)            │ (FK to admin)    │
│         ║                       │                  │
│created_ ║verified_by            │                  │
│at/updated║ (FK to admin)        │                  │
└─────────┴────────┴──────────────┘
    │         │
    └──1──────1─┐
          │
          ▼
    ┌──────────────────────┐
    │      KOS             │
    ├──────────────────────┤
    │ PK kos_id            │
    │ FK owner_id          │
    │ name (CharField)     │
    │ address (TextField)  │
    │ description          │
    └──────────────────────┘


     (Also exists but not shown)
    ┌──────────────┐
    │   RENTAL     │
    ├──────────────┤
    │ PK rental_id │
    │ FK room_id   │
    │ FK tenant_id │
    │ start_date   │
    │ end_date     │
    │ status       │
    │ monthly_price│
    └──────────────┘

┌─────────────────────────────────────┐
│  LAPORAN_KEUANGAN (Financial)       │
├─────────────────────────────────────┤
│ PK laporan_id (AutoField)           │
│ bulan (DateField)                   │
│ total_pemasukan (DecimalField)      │
│ total_pengeluaran (DecimalField)    │
│ saldo (DecimalField) [auto-calc]    │
│ created_at/updated_at               │
└─────────────────────────────────────┘
```

---

## 📊 Table Details

### USER

| Column     | Type           | Constraint | Notes                 |
| ---------- | -------------- | ---------- | --------------------- |
| user_id    | BigAutoField   | PK         | Auto-generated        |
| username   | CharField(150) | UNIQUE     | Login credential      |
| email      | EmailField     | UNIQUE     | Communication         |
| password   | CharField(128) | -          | Hashed by Django      |
| role       | CharField(10)  | CHOICES    | admin \| tenant       |
| no_hp      | CharField(15)  | -          | Phone number          |
| is_active  | Boolean        | -          | Account status        |
| created_at | DateTimeField  | -          | Auto-set on creation  |
| updated_at | DateTimeField  | -          | Auto-update on change |

### KAMAR

| Column      | Type               | Constraint | Notes                                |
| ----------- | ------------------ | ---------- | ------------------------------------ |
| id          | BigAutoField       | PK         | Auto-generated                       |
| kos_id      | ForeignKey         | FK → KOS   | Which boarding house                 |
| nomor_kamar | CharField(10)      | -          | E.g., "101", "A-05"                  |
| floor       | Integer            | -          | Floor number                         |
| hrga        | DecimalField(10,2) | -          | Monthly price                        |
| status      | CharField(20)      | CHOICES    | available \| occupied \| maintenance |
| penyewa_id  | ForeignKey         | FK → USER  | Current tenant (nullable)            |
| capacity    | Integer            | -          | How many people                      |
| facilities  | TextField          | -          | AC, WiFi, TV, etc.                   |
| image       | ImageField         | -          | Room photo                           |
| created_at  | DateTimeField      | -          | Auto-set                             |
| updated_at  | DateTimeField      | -          | Auto-update                          |

### PEMBAYARAN

| Column         | Type               | Constraint | Notes                                       |
| -------------- | ------------------ | ---------- | ------------------------------------------- |
| pembayaran_id  | AutoField          | PK         | Auto-generated                              |
| penyewa_id     | ForeignKey         | FK → USER  | Tenant who paid                             |
| kamar_id       | ForeignKey         | FK → KAMAR | Which room                                  |
| tgl_bayar      | DateTimeField      | -          | Auto-set on creation                        |
| jumlah         | DecimalField(12,2) | -          | Payment amount                              |
| metode         | CharField(20)      | CHOICES    | cash \| bank_transfer \| qris \| e_wallet   |
| status         | CharField(20)      | CHOICES    | pending \| completed \| failed \| cancelled |
| transaction_id | CharField(100)     | -          | External transaction ID                     |
| payment_proof  | ImageField         | -          | Receipt image                               |
| verified_by    | ForeignKey         | FK → USER  | Admin who verified                          |
| verified_at    | DateTimeField      | -          | Verification timestamp                      |

### NOTIF

| Column   | Type          | Constraint | Notes                      |
| -------- | ------------- | ---------- | -------------------------- |
| notif_id | AutoField     | PK         | Auto-generated             |
| user_id  | ForeignKey    | FK → USER  | Notification recipient     |
| pesan    | TextField     | -          | Message content            |
| tgl      | DateTimeField | -          | Auto-set on creation       |
| status   | CharField(20) | CHOICES    | unread \| read \| archived |

### LAPORAN_KEUANGAN

| Column            | Type               | Constraint | Notes                              |
| ----------------- | ------------------ | ---------- | ---------------------------------- |
| laporan_id        | AutoField          | PK         | Auto-generated                     |
| bulan             | DateField          | -          | First day of month                 |
| total_pemasukan   | DecimalField(15,2) | -          | Total income for month             |
| total_pengeluaran | DecimalField(15,2) | -          | Total expenses for month           |
| saldo             | DecimalField(15,2) | -          | Auto-calc: pemasukan - pengeluaran |
| created_at        | DateTimeField      | -          | Auto-set                           |
| updated_at        | DateTimeField      | -          | Auto-update                        |

### KERUSAKAN

| Column           | Type          | Constraint | Notes                                          |
| ---------------- | ------------- | ---------- | ---------------------------------------------- |
| laporan_id       | AutoField     | PK         | Auto-generated                                 |
| kamar_id         | ForeignKey    | FK → KAMAR | Which room damaged                             |
| penyewa_id       | ForeignKey    | FK → USER  | Who reported                                   |
| deskripsi        | TextField     | -          | Damage description                             |
| tgl_lapor        | DateTimeField | -          | Auto-set on creation                           |
| status           | CharField(20) | CHOICES    | pending \| in_progress \| resolved \| rejected |
| priority         | CharField(20) | CHOICES    | low \| medium \| high \| urgent                |
| image            | ImageField    | -          | Damage photo                                   |
| assigned_to      | ForeignKey    | FK → USER  | Admin assigned (nullable)                      |
| resolution_notes | TextField     | -          | How it was fixed                               |
| resolved_at      | DateTimeField | -          | Resolution timestamp                           |
| updated_at       | DateTimeField | -          | Auto-update                                    |

---

## 🔑 Primary Keys & Foreign Keys

### Primary Keys (PK)

- USER: `user_id` (BigAutoField)
- KAMAR: `id` (BigAutoField)
- PEMBAYARAN: `pembayaran_id` (AutoField)
- NOTIF: `notif_id` (AutoField)
- LAPORAN_KEUANGAN: `laporan_id` (AutoField)
- KERUSAKAN: `laporan_id` (AutoField)

### Foreign Keys (FK)

- KAMAR.penyewa_id → USER.user_id
- KAMAR.kos_id → KOS.id
- PEMBAYARAN.penyewa_id → USER.user_id
- PEMBAYARAN.kamar_id → KAMAR.id
- PEMBAYARAN.verified_by → USER.user_id
- NOTIF.user_id → USER.user_id
- KERUSAKAN.kamar_id → KAMAR.id
- KERUSAKAN.penyewa_id → USER.user_id
- KERUSAKAN.assigned_to → USER.user_id

---

## 📈 Cardinality

```
USER (1) ──────┬────→ (N) KAMAR (as penyewa)
               ├────→ (N) PEMBAYARAN (as penyewa)
               ├────→ (N) PEMBAYARAN (as verified_by)
               ├────→ (N) NOTIF
               ├────→ (N) KERUSAKAN (as penyewa)
               └────→ (N) KERUSAKAN (as assigned_to)

KAMAR (1) ─────┬────→ (N) PEMBAYARAN
               └────→ (N) KERUSAKAN

KOS (1) ───────┬────→ (N) KAMAR
               └────→ (N) RENTAL
```

---

## 💾 Data Flow Examples

### Example 1: Tenant Payment

```
USER (Budi)
  ↓
KAMAR (Room 101)
  ↓
PEMBAYARAN (1,000,000 rupiah, pending)
  ↓
NOTIF (Payment received notification)
  ↓
LAPORAN_KEUANGAN (Monthly income updated)
```

### Example 2: Damage Report

```
USER (Budi - Tenant)
  ↓
KERUSAKAN (AC rusak, high priority)
  ↓
NOTIF (Damage report sent to admin)
  ↓
USER (Admin - Assigned to fix)
  ↓
KERUSAKAN (Status updated to resolved)
  ↓
NOTIF (Repair completed notification)
```

---

## ✅ Status Values

| Table      | Field    | Possible Values                          |
| ---------- | -------- | ---------------------------------------- |
| KAMAR      | status   | available, occupied, maintenance         |
| PEMBAYARAN | status   | pending, completed, failed, cancelled    |
| PEMBAYARAN | metode   | cash, bank_transfer, qris, e_wallet      |
| NOTIF      | status   | unread, read, archived                   |
| KERUSAKAN  | status   | pending, in_progress, resolved, rejected |
| KERUSAKAN  | priority | low, medium, high, urgent                |
