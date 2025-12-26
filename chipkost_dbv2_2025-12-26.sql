# ************************************************************
# Sequel Ace SQL dump
# Version 20094
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 9.3.0)
# Database: chipkost_dbv2
# Generation Time: 2025-12-26 00:27:52 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table access_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `access_logs`;

CREATE TABLE `access_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_time` datetime(6) NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `room_id` bigint NOT NULL,
  `rfid_card_id` bigint DEFAULT NULL,
  `denied_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempted_card_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `access_logs_room_id_1dcc8d23_fk_rooms_id` (`room_id`),
  KEY `access_logs_rfid_card_id_8750c85d_fk_rfid_cards_id` (`rfid_card_id`),
  CONSTRAINT `access_logs_rfid_card_id_8750c85d_fk_rfid_cards_id` FOREIGN KEY (`rfid_card_id`) REFERENCES `rfid_cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `access_logs_room_id_1dcc8d23_fk_rooms_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `access_logs` WRITE;
/*!40000 ALTER TABLE `access_logs` DISABLE KEYS */;

INSERT INTO `access_logs` (`id`, `status`, `access_time`, `notes`, `room_id`, `rfid_card_id`, `denied_reason`, `attempted_card_id`)
VALUES
	(18,'granted','2025-12-26 00:12:42.790004',NULL,12,7,NULL,NULL),
	(19,'denied','2025-12-26 00:12:46.020560',NULL,14,7,'Kartu RFID tidak terdaftar untuk kamar ini',NULL),
	(20,'granted','2025-12-26 00:12:59.920013',NULL,12,7,NULL,NULL);

/*!40000 ALTER TABLE `access_logs` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table auth_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `auth_group`;

CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table auth_group_permissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `auth_group_permissions`;

CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table auth_permission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `auth_permission`;

CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`)
VALUES
	(1,'Can add log entry',1,'add_logentry'),
	(2,'Can change log entry',1,'change_logentry'),
	(3,'Can delete log entry',1,'delete_logentry'),
	(4,'Can view log entry',1,'view_logentry'),
	(5,'Can add permission',2,'add_permission'),
	(6,'Can change permission',2,'change_permission'),
	(7,'Can delete permission',2,'delete_permission'),
	(8,'Can view permission',2,'view_permission'),
	(9,'Can add group',3,'add_group'),
	(10,'Can change group',3,'change_group'),
	(11,'Can delete group',3,'delete_group'),
	(12,'Can view group',3,'view_group'),
	(13,'Can add content type',4,'add_contenttype'),
	(14,'Can change content type',4,'change_contenttype'),
	(15,'Can delete content type',4,'delete_contenttype'),
	(16,'Can view content type',4,'view_contenttype'),
	(17,'Can add session',5,'add_session'),
	(18,'Can change session',5,'change_session'),
	(19,'Can delete session',5,'delete_session'),
	(20,'Can view session',5,'view_session'),
	(21,'Can add blacklisted token',6,'add_blacklistedtoken'),
	(22,'Can change blacklisted token',6,'change_blacklistedtoken'),
	(23,'Can delete blacklisted token',6,'delete_blacklistedtoken'),
	(24,'Can view blacklisted token',6,'view_blacklistedtoken'),
	(25,'Can add outstanding token',7,'add_outstandingtoken'),
	(26,'Can change outstanding token',7,'change_outstandingtoken'),
	(27,'Can delete outstanding token',7,'delete_outstandingtoken'),
	(28,'Can view outstanding token',7,'view_outstandingtoken'),
	(29,'Can add Pengguna',8,'add_user'),
	(30,'Can change Pengguna',8,'change_user'),
	(31,'Can delete Pengguna',8,'delete_user'),
	(32,'Can view Pengguna',8,'view_user'),
	(33,'Can add Kos',9,'add_kos'),
	(34,'Can change Kos',9,'change_kos'),
	(35,'Can delete Kos',9,'delete_kos'),
	(36,'Can view Kos',9,'view_kos'),
	(37,'Can add Kamar',10,'add_room'),
	(38,'Can change Kamar',10,'change_room'),
	(39,'Can delete Kamar',10,'delete_room'),
	(40,'Can view Kamar',10,'view_room'),
	(41,'Can add Penyewaan',11,'add_rental'),
	(42,'Can change Penyewaan',11,'change_rental'),
	(43,'Can delete Penyewaan',11,'delete_rental'),
	(44,'Can view Penyewaan',11,'view_rental'),
	(45,'Can add Invoice',12,'add_invoice'),
	(46,'Can change Invoice',12,'change_invoice'),
	(47,'Can delete Invoice',12,'delete_invoice'),
	(48,'Can view Invoice',12,'view_invoice'),
	(49,'Can add Laporan Keuangan',13,'add_laporankeuangan'),
	(50,'Can change Laporan Keuangan',13,'change_laporankeuangan'),
	(51,'Can delete Laporan Keuangan',13,'delete_laporankeuangan'),
	(52,'Can view Laporan Keuangan',13,'view_laporankeuangan'),
	(53,'Can add Pembayaran',14,'add_pembayaran'),
	(54,'Can change Pembayaran',14,'change_pembayaran'),
	(55,'Can delete Pembayaran',14,'delete_pembayaran'),
	(56,'Can view Pembayaran',14,'view_pembayaran'),
	(57,'Can add Kerusakan',15,'add_kerusakan'),
	(58,'Can change Kerusakan',15,'change_kerusakan'),
	(59,'Can delete Kerusakan',15,'delete_kerusakan'),
	(60,'Can view Kerusakan',15,'view_kerusakan'),
	(61,'Can add Notifikasi',16,'add_notif'),
	(62,'Can change Notifikasi',16,'change_notif'),
	(63,'Can delete Notifikasi',16,'delete_notif'),
	(64,'Can view Notifikasi',16,'view_notif'),
	(65,'Can add rfid card',17,'add_rfidcard'),
	(66,'Can change rfid card',17,'change_rfidcard'),
	(67,'Can delete rfid card',17,'delete_rfidcard'),
	(68,'Can view rfid card',17,'view_rfidcard'),
	(69,'Can add access log',18,'add_accesslog'),
	(70,'Can change access log',18,'change_accesslog'),
	(71,'Can delete access log',18,'delete_accesslog'),
	(72,'Can view access log',18,'view_accesslog'),
	(73,'Can add CCTV Kamera',19,'add_cctvcamera'),
	(74,'Can change CCTV Kamera',19,'change_cctvcamera'),
	(75,'Can delete CCTV Kamera',19,'delete_cctvcamera'),
	(76,'Can view CCTV Kamera',19,'view_cctvcamera');

/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table cctv_cameras
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cctv_cameras`;

CREATE TABLE `cctv_cameras` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `kos_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cctv_cameras_kos_id_order_62388451_uniq` (`kos_id`,`order`),
  CONSTRAINT `cctv_cameras_kos_id_3263b9c2_fk_kos_id` FOREIGN KEY (`kos_id`) REFERENCES `kos` (`id`),
  CONSTRAINT `cctv_cameras_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `cctv_cameras` WRITE;
/*!40000 ALTER TABLE `cctv_cameras` DISABLE KEYS */;

INSERT INTO `cctv_cameras` (`id`, `name`, `stream_url`, `order`, `is_active`, `created_at`, `updated_at`, `kos_id`)
VALUES
	(7,'Bandara Pribadi','https://assets.mixkit.co/videos/4003/4003-720.mp4',1,1,'2025-12-24 03:39:46.903288','2025-12-24 03:39:46.903317',7);

/*!40000 ALTER TABLE `cctv_cameras` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table django_admin_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `django_admin_log`;

CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table django_content_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `django_content_type`;

CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;

INSERT INTO `django_content_type` (`id`, `app_label`, `model`)
VALUES
	(8,'accounts','user'),
	(1,'admin','logentry'),
	(3,'auth','group'),
	(2,'auth','permission'),
	(12,'billing','invoice'),
	(13,'billing','laporankeuangan'),
	(14,'billing','pembayaran'),
	(15,'complaints','kerusakan'),
	(4,'contenttypes','contenttype'),
	(16,'notifications','notif'),
	(18,'rfid','accesslog'),
	(17,'rfid','rfidcard'),
	(19,'rooms','cctvcamera'),
	(9,'rooms','kos'),
	(11,'rooms','rental'),
	(10,'rooms','room'),
	(5,'sessions','session'),
	(6,'token_blacklist','blacklistedtoken'),
	(7,'token_blacklist','outstandingtoken');

/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table django_migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `django_migrations`;

CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`)
VALUES
	(1,'contenttypes','0001_initial','2025-10-28 16:17:44.273661'),
	(2,'contenttypes','0002_remove_content_type_name','2025-10-28 16:17:44.291341'),
	(3,'auth','0001_initial','2025-10-28 16:17:44.340862'),
	(4,'auth','0002_alter_permission_name_max_length','2025-10-28 16:17:44.354102'),
	(5,'auth','0003_alter_user_email_max_length','2025-10-28 16:17:44.356880'),
	(6,'auth','0004_alter_user_username_opts','2025-10-28 16:17:44.359109'),
	(7,'auth','0005_alter_user_last_login_null','2025-10-28 16:17:44.361480'),
	(8,'auth','0006_require_contenttypes_0002','2025-10-28 16:17:44.362304'),
	(9,'auth','0007_alter_validators_add_error_messages','2025-10-28 16:17:44.364597'),
	(10,'auth','0008_alter_user_username_max_length','2025-10-28 16:17:44.366771'),
	(11,'auth','0009_alter_user_last_name_max_length','2025-10-28 16:17:44.370177'),
	(12,'auth','0010_alter_group_name_max_length','2025-10-28 16:17:44.376179'),
	(13,'auth','0011_update_proxy_permissions','2025-10-28 16:17:44.378583'),
	(14,'auth','0012_alter_user_first_name_max_length','2025-10-28 16:17:44.380563'),
	(15,'accounts','0001_initial','2025-10-28 16:17:44.446211'),
	(16,'accounts','0002_alter_user_role','2025-10-28 16:17:44.449580'),
	(17,'accounts','0003_alter_user_options_alter_user_created_at_and_more','2025-10-28 16:17:44.463625'),
	(18,'admin','0001_initial','2025-10-28 16:17:44.498149'),
	(19,'admin','0002_logentry_remove_auto_add','2025-10-28 16:17:44.501472'),
	(20,'admin','0003_logentry_add_action_flag_choices','2025-10-28 16:17:44.504257'),
	(22,'rooms','0002_room_penyewa','2025-10-28 16:17:44.594863'),
	(23,'rooms','0003_remove_rental_tenant_rental_penyewa_and_more','2025-10-28 16:17:44.635998'),
	(24,'rooms','0004_alter_kos_options_alter_rental_options_and_more','2025-10-28 16:17:44.728937'),
	(26,'billing','0002_laporankeuangan_pembayaran_delete_payment','2025-10-28 16:17:44.888905'),
	(27,'billing','0003_remove_invoice_tenant_invoice_penyewa_and_more','2025-10-28 16:17:44.939051'),
	(28,'billing','0004_alter_invoice_options_alter_laporankeuangan_options_and_more','2025-10-28 16:17:45.037880'),
	(29,'billing','0005_pembayaran_tenggat','2025-10-28 16:17:45.057344'),
	(31,'complaints','0002_kerusakan_delete_complaint','2025-10-28 16:17:45.181971'),
	(32,'complaints','0003_alter_kerusakan_penyewa','2025-10-28 16:17:45.191228'),
	(33,'complaints','0004_alter_kerusakan_options_alter_kerusakan_assigned_to_and_more','2025-10-28 16:17:45.251983'),
	(34,'notifications','0001_initial','2025-10-28 16:17:45.283996'),
	(35,'notifications','0002_alter_notif_options_alter_notif_pesan_and_more','2025-10-28 16:17:45.312220'),
	(37,'sessions','0001_initial','2025-10-28 16:17:45.441226'),
	(38,'token_blacklist','0001_initial','2025-10-28 16:17:45.493909'),
	(39,'token_blacklist','0002_outstandingtoken_jti_hex','2025-10-28 16:17:45.514363'),
	(40,'token_blacklist','0003_auto_20171017_2007','2025-10-28 16:17:45.525330'),
	(41,'token_blacklist','0004_auto_20171017_2013','2025-10-28 16:17:45.551882'),
	(42,'token_blacklist','0005_remove_outstandingtoken_jti','2025-10-28 16:17:45.571144'),
	(43,'token_blacklist','0006_auto_20171017_2113','2025-10-28 16:17:45.582135'),
	(44,'token_blacklist','0007_auto_20171017_2214','2025-10-28 16:17:45.629236'),
	(45,'token_blacklist','0008_migrate_to_bigautofield','2025-10-28 16:17:45.677145'),
	(46,'token_blacklist','0010_fix_migrate_to_bigautofield','2025-10-28 16:17:45.687189'),
	(47,'token_blacklist','0011_linearizes_history','2025-10-28 16:17:45.687848'),
	(48,'token_blacklist','0012_alter_outstandingtoken_user','2025-10-28 16:17:45.695882'),
	(49,'rooms','0001_initial','2025-11-22 09:34:48.626325'),
	(50,'billing','0001_initial','2025-11-22 09:35:18.051541'),
	(51,'complaints','0001_initial','2025-11-22 09:35:18.353608'),
	(52,'rfid','0001_initial','2025-11-22 09:35:18.692433'),
	(53,'rfid','0002_accesslog_updates','2025-12-11 22:32:12.000000'),
	(54,'rooms','0002_kos_cctv_url','2025-12-14 07:19:32.308989'),
	(55,'rooms','0003_cctvcamera','2025-12-14 07:20:20.453358'),
	(56,'rooms','0004_sync_room_columns','2025-12-23 10:46:16.542569'),
	(57,'billing','0002_alter_laporankeuangan_options_and_more','2025-12-24 00:10:08.811515');

/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table django_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `django_session`;

CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table invoices
# ------------------------------------------------------------

DROP TABLE IF EXISTS `invoices`;

CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `billing_period_start` date DEFAULT NULL,
  `billing_period_end` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `rental_id` bigint NOT NULL,
  `penyewa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `invoices_rental_id_1406b879_fk_rentals_id` (`rental_id`),
  KEY `invoices_penyewa_id_c2836e94_fk_users_id` (`penyewa_id`),
  CONSTRAINT `invoices_penyewa_id_c2836e94_fk_users_id` FOREIGN KEY (`penyewa_id`) REFERENCES `users` (`id`),
  CONSTRAINT `invoices_rental_id_1406b879_fk_rentals_id` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;

INSERT INTO `invoices` (`id`, `invoice_number`, `amount`, `billing_period_start`, `billing_period_end`, `due_date`, `status`, `notes`, `created_at`, `updated_at`, `rental_id`, `penyewa_id`)
VALUES
	(82,'CHIPKOST-20251224032146-4GDXOS',6600000.00,'2025-12-25','2026-12-25','2025-12-26','paid','Invoice untuk pembayaran 12 bulan','2025-12-24 03:21:46.548057','2025-12-24 03:21:57.092447',30,22),
	(86,'INV-ASSIGN-20251225-78660F',1000000.00,'2025-12-25','2026-01-25','2025-12-26','paid','Tagihan awal sewa - Segera lakukan pembayaran melalui sistem','2025-12-25 23:30:42.158434','2025-12-25 23:30:42.158464',32,24),
	(87,'CHIPKOST-20251225233226-TR7IZM',1000000.00,'2025-12-26','2026-01-26','2025-12-26','paid','Tagihan Perpanjangan Sewa - 1 Bulan (Otomatis)','2025-12-25 23:31:48.275088','2025-12-25 23:32:50.696375',32,24),
	(88,'CHIPKOST-20251225235515-VDF9N9',1000000.00,'2026-01-26','2026-02-26','2026-01-26','paid','Tagihan Perpanjangan Sewa - 1 Bulan (Otomatis)','2025-12-25 23:32:52.908364','2025-12-25 23:55:29.342633',32,24),
	(90,'CHIPKOST-20251226000749-0RE8R7',550000.00,'2025-12-26','2026-01-26','2025-12-27','paid','Invoice untuk pembayaran 1 bulan','2025-12-26 00:07:50.489576','2025-12-26 00:08:05.363014',33,22),
	(91,'INV-EXT-20251226-940F3C',550000.00,'2026-01-26','2026-02-26','2026-01-26','cancelled','Tagihan Perpanjangan Sewa - 1 Bulan (Otomatis)\n[Auto-cancelled] Sudah ada pembayaran yang mencakup periode ini','2025-12-26 00:08:06.649891','2025-12-26 00:11:39.377122',33,22),
	(92,'CHIPKOST-20251226001126-9TA2XH',6600000.00,'2026-01-26','2027-01-26','2026-01-27','paid','Invoice untuk pembayaran 12 bulan','2025-12-26 00:11:28.069297','2025-12-26 00:11:39.809203',33,22);

/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table kerusakan
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kerusakan`;

CREATE TABLE `kerusakan` (
  `laporan_id` int NOT NULL AUTO_INCREMENT,
  `deskripsi` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tgl_lapor` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolution_notes` longtext COLLATE utf8mb4_unicode_ci,
  `resolved_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `assigned_to_id` bigint DEFAULT NULL,
  `kamar_id` bigint NOT NULL,
  `penyewa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`laporan_id`),
  KEY `kerusakan_assigned_to_id_ec6f2e0d_fk_users_id` (`assigned_to_id`),
  KEY `kerusakan_kamar_id_ecc787a5_fk_rooms_id` (`kamar_id`),
  KEY `kerusakan_penyewa_id_2aa5bc33_fk_users_id` (`penyewa_id`),
  CONSTRAINT `kerusakan_assigned_to_id_ec6f2e0d_fk_users_id` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`),
  CONSTRAINT `kerusakan_kamar_id_ecc787a5_fk_rooms_id` FOREIGN KEY (`kamar_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `kerusakan_penyewa_id_2aa5bc33_fk_users_id` FOREIGN KEY (`penyewa_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table kos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kos`;

CREATE TABLE `kos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `owner_id` bigint NOT NULL,
  `cctv_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kos_owner_id_b2a87a7f_fk_users_id` (`owner_id`),
  CONSTRAINT `kos_owner_id_b2a87a7f_fk_users_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `kos` WRITE;
/*!40000 ALTER TABLE `kos` DISABLE KEYS */;

INSERT INTO `kos` (`id`, `name`, `address`, `description`, `created_at`, `updated_at`, `owner_id`, `cctv_url`)
VALUES
	(7,'Pondok Islam','Buah Batu, Bojongsoang',NULL,'2025-12-24 03:05:45.328724','2025-12-24 03:05:45.328736',18,NULL),
	(8,'Pondok Pondok','Bojongsoang, PGA',NULL,'2025-12-24 03:36:50.860595','2025-12-24 03:36:50.860612',18,NULL);

/*!40000 ALTER TABLE `kos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table laporan_keuangan
# ------------------------------------------------------------

DROP TABLE IF EXISTS `laporan_keuangan`;

CREATE TABLE `laporan_keuangan` (
  `laporan_id` int NOT NULL AUTO_INCREMENT,
  `bulan` date NOT NULL,
  `total_pemasukan` decimal(15,2) NOT NULL,
  `total_pengeluaran` decimal(15,2) NOT NULL,
  `saldo` decimal(15,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`laporan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `laporan_keuangan` WRITE;
/*!40000 ALTER TABLE `laporan_keuangan` DISABLE KEYS */;

INSERT INTO `laporan_keuangan` (`laporan_id`, `bulan`, `total_pemasukan`, `total_pengeluaran`, `saldo`, `created_at`, `updated_at`)
VALUES
	(3,'2025-12-01',0.00,0.00,0.00,'2025-12-24 01:32:33.121909','2025-12-26 00:12:09.320888');

/*!40000 ALTER TABLE `laporan_keuangan` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table notif
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notif`;

CREATE TABLE `notif` (
  `notif_id` int NOT NULL AUTO_INCREMENT,
  `pesan` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tgl` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`notif_id`),
  KEY `notif_user_id_cde11f99_fk_users_id` (`user_id`),
  CONSTRAINT `notif_user_id_cde11f99_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `notif` WRITE;
/*!40000 ALTER TABLE `notif` DISABLE KEYS */;

INSERT INTO `notif` (`notif_id`, `pesan`, `tgl`, `status`, `user_id`)
VALUES
	(45,'Pembayaran Berhasil. Pembayaran sebesar Rp 1.200.000 telah berhasil','2025-12-24 03:18:05.135068','unread',22),
	(46,'Pembayaran Berhasil. Pembayaran sebesar Rp 7.200.000 telah berhasil','2025-12-24 03:18:47.308337','unread',22),
	(47,'Pembayaran Berhasil. Pembayaran sebesar Rp 1.200.000 telah berhasil','2025-12-24 03:19:14.755472','unread',22),
	(48,'Pembayaran Berhasil. Pembayaran sebesar Rp 6.600.000 telah berhasil','2025-12-24 03:21:57.098457','unread',22),
	(52,'Pembayaran Berhasil. Pembayaran sebesar Rp 1.000.000 telah berhasil','2025-12-25 23:32:50.702532','unread',24),
	(53,'Pembayaran Berhasil. Pembayaran sebesar Rp 1.000.000 telah berhasil','2025-12-25 23:55:29.357346','unread',24),
	(54,'Pembayaran Berhasil. Pembayaran sebesar Rp 1.000.000 telah berhasil','2025-12-25 23:55:29.428116','unread',24),
	(55,'Pembayaran Berhasil. Pembayaran sebesar Rp 550.000 telah berhasil','2025-12-26 00:08:05.376896','unread',22),
	(56,'Pembayaran Berhasil. Pembayaran sebesar Rp 6.600.000 telah berhasil','2025-12-26 00:11:39.819648','unread',22),
	(57,'Pembayaran Berhasil. Pembayaran sebesar Rp 6.600.000 telah berhasil','2025-12-26 00:11:39.840516','unread',22),
	(58,'Selamat datang di Kamar 101','2025-12-26 00:12:42.793867','unread',22),
	(59,'Selamat datang di Kamar 101','2025-12-26 00:12:59.923774','unread',22);

/*!40000 ALTER TABLE `notif` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table pembayaran
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pembayaran`;

CREATE TABLE `pembayaran` (
  `pembayaran_id` int NOT NULL AUTO_INCREMENT,
  `tgl_bayar` datetime(6) NOT NULL,
  `jumlah` decimal(12,2) NOT NULL,
  `metode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_proof` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `verified_at` datetime(6) DEFAULT NULL,
  `kamar_id` bigint NOT NULL,
  `penyewa_id` bigint DEFAULT NULL,
  `verified_by_id` bigint DEFAULT NULL,
  `tenggat` date DEFAULT NULL,
  PRIMARY KEY (`pembayaran_id`),
  KEY `pembayaran_kamar_id_5338979b_fk_rooms_id` (`kamar_id`),
  KEY `pembayaran_penyewa_id_db882d72_fk_users_id` (`penyewa_id`),
  KEY `pembayaran_verified_by_id_0b935ef3_fk_users_id` (`verified_by_id`),
  CONSTRAINT `pembayaran_kamar_id_5338979b_fk_rooms_id` FOREIGN KEY (`kamar_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `pembayaran_penyewa_id_db882d72_fk_users_id` FOREIGN KEY (`penyewa_id`) REFERENCES `users` (`id`),
  CONSTRAINT `pembayaran_verified_by_id_0b935ef3_fk_users_id` FOREIGN KEY (`verified_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `pembayaran` WRITE;
/*!40000 ALTER TABLE `pembayaran` DISABLE KEYS */;

INSERT INTO `pembayaran` (`pembayaran_id`, `tgl_bayar`, `jumlah`, `metode`, `status`, `transaction_id`, `payment_proof`, `notes`, `verified_at`, `kamar_id`, `penyewa_id`, `verified_by_id`, `tenggat`)
VALUES
	(68,'2025-12-24 03:21:46.543160',6600000.00,'midtrans','completed','CHIPKOST-20251224032146-4GDXOS','','Pembayaran Sewa 12 bulan - Kamar 101 (Periode: 25/12/2025 - 25/12/2026)','2025-12-24 03:21:57.091231',12,22,NULL,'2026-12-25'),
	(70,'2025-12-25 23:32:27.892415',1000000.00,'midtrans','completed','CHIPKOST-20251225233226-TR7IZM','','Pembayaran Sewa 1 bulan - Kamar 101 (Periode: 26/12/2025 - 26/01/2026)','2025-12-25 23:32:50.695499',14,24,NULL,'2026-01-26'),
	(71,'2025-12-25 23:55:16.499123',1000000.00,'midtrans','completed','CHIPKOST-20251225235515-VDF9N9','','Pembayaran Sewa 1 bulan - Kamar 101 (Periode: 26/01/2026 - 26/02/2026)','2025-12-25 23:55:29.412245',14,24,NULL,'2026-02-26'),
	(72,'2025-12-26 00:07:50.479089',550000.00,'midtrans','completed','CHIPKOST-20251226000749-0RE8R7','','Pembayaran Sewa 1 bulan - Kamar 101 (Periode: 26/12/2025 - 26/01/2026)','2025-12-26 00:08:05.360717',12,22,NULL,'2026-01-26'),
	(73,'2025-12-26 00:11:28.059566',6600000.00,'midtrans','completed','CHIPKOST-20251226001126-9TA2XH','','Pembayaran Sewa 12 bulan - Kamar 101 (Periode: 26/01/2026 - 26/01/2027)','2025-12-26 00:11:39.835556',12,22,NULL,'2027-01-26');

/*!40000 ALTER TABLE `pembayaran` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rentals
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rentals`;

CREATE TABLE `rentals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `monthly_price` decimal(10,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `room_id` bigint NOT NULL,
  `penyewa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rentals_room_id_79ad5282_fk_rooms_id` (`room_id`),
  KEY `rentals_penyewa_id_e45bf727_fk_users_id` (`penyewa_id`),
  CONSTRAINT `rentals_penyewa_id_e45bf727_fk_users_id` FOREIGN KEY (`penyewa_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rentals_room_id_79ad5282_fk_rooms_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `rentals` WRITE;
/*!40000 ALTER TABLE `rentals` DISABLE KEYS */;

INSERT INTO `rentals` (`id`, `start_date`, `end_date`, `monthly_price`, `status`, `notes`, `created_at`, `updated_at`, `room_id`, `penyewa_id`)
VALUES
	(30,'2025-12-24','2025-12-25',550000.00,'terminated','Rental baru - Assign dari admin pada 2025-12-24. Masa sewa 1 hari, pembayaran melalui web.\n[Dihentikan] Penyewa diganti pada 2025-12-25','2025-12-24 03:21:21.147872','2025-12-25 23:57:03.911720',12,22),
	(32,'2025-12-25','2026-02-26',1000000.00,'active','Rental baru - Assign dari admin pada 2025-12-25. Masa sewa 1 hari, pembayaran melalui web.','2025-12-25 23:30:42.155855','2025-12-25 23:55:29.346405',14,24),
	(33,'2025-12-26','2027-01-26',550000.00,'active','Auto-generated rental from room assignment','2025-12-26 00:07:10.778903','2025-12-26 00:11:39.811303',12,22);

/*!40000 ALTER TABLE `rentals` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rfid_cards
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rfid_cards`;

CREATE TABLE `rfid_cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_uid` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registered_at` datetime(6) NOT NULL,
  `last_used` datetime(6) DEFAULT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `registered_by_id` bigint DEFAULT NULL,
  `room_id` bigint NOT NULL,
  `tenant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `card_uid` (`card_uid`),
  KEY `rfid_cards_registered_by_id_5e15f647_fk_users_id` (`registered_by_id`),
  KEY `rfid_cards_room_id_a8263adc_fk_rooms_id` (`room_id`),
  KEY `rfid_cards_tenant_id_10279fd4_fk_users_id` (`tenant_id`),
  CONSTRAINT `rfid_cards_registered_by_id_5e15f647_fk_users_id` FOREIGN KEY (`registered_by_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rfid_cards_room_id_a8263adc_fk_rooms_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `rfid_cards_tenant_id_10279fd4_fk_users_id` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `rfid_cards` WRITE;
/*!40000 ALTER TABLE `rfid_cards` DISABLE KEYS */;

INSERT INTO `rfid_cards` (`id`, `card_uid`, `status`, `registered_at`, `last_used`, `notes`, `registered_by_id`, `room_id`, `tenant_id`)
VALUES
	(7,'B8018DA7','active','2025-12-26 00:12:38.781201','2025-12-26 00:12:59.922346',NULL,18,12,22);

/*!40000 ALTER TABLE `rfid_cards` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rooms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `capacity` int NOT NULL,
  `facilities` longtext COLLATE utf8mb4_unicode_ci,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `kos_id` bigint NOT NULL,
  `penyewa_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rooms_kos_id_room_number_36a05295_uniq` (`kos_id`,`room_number`),
  KEY `rooms_penyewa_id_3d3efd1e_fk_users_id` (`penyewa_id`),
  KEY `rooms_kos_id_69b3b651` (`kos_id`),
  CONSTRAINT `rooms_kos_id_69b3b651_fk_kos_id` FOREIGN KEY (`kos_id`) REFERENCES `kos` (`id`),
  CONSTRAINT `rooms_penyewa_id_3d3efd1e_fk_users_id` FOREIGN KEY (`penyewa_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;

INSERT INTO `rooms` (`id`, `room_number`, `floor`, `price`, `status`, `description`, `capacity`, `facilities`, `image`, `created_at`, `updated_at`, `kos_id`, `penyewa_id`)
VALUES
	(12,'101',1,550000.00,'occupied','Kos Mantap',1,'TV, AC, Kamar Mandi Dalam','room_images/images.jpeg','2025-12-24 03:21:17.773154','2025-12-25 23:57:05.480403',7,22),
	(14,'101',1,1000000.00,'occupied',NULL,1,NULL,'','2025-12-25 23:30:29.724502','2025-12-25 23:30:42.144485',8,24);

/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table token_blacklist_blacklistedtoken
# ------------------------------------------------------------

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;

CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;

INSERT INTO `token_blacklist_blacklistedtoken` (`id`, `blacklisted_at`, `token_id`)
VALUES
	(1,'2025-11-14 14:51:44.202230',4),
	(2,'2025-11-15 09:43:43.272428',5),
	(3,'2025-11-15 09:43:54.120317',8),
	(4,'2025-11-15 16:42:45.827570',10),
	(5,'2025-11-15 16:48:41.953038',11),
	(6,'2025-11-15 16:50:07.786853',12),
	(7,'2025-11-15 19:22:37.631960',13),
	(13,'2025-11-16 10:59:44.643132',14),
	(14,'2025-11-16 11:00:03.358357',15),
	(15,'2025-11-18 06:40:48.493654',16),
	(16,'2025-11-18 06:41:32.126977',17),
	(17,'2025-11-18 06:46:13.368404',18),
	(18,'2025-11-18 06:53:45.240325',21),
	(19,'2025-11-18 16:32:32.149513',22),
	(20,'2025-11-22 08:21:01.541028',23),
	(21,'2025-11-22 08:22:36.476185',24),
	(22,'2025-11-22 08:28:52.225605',25),
	(23,'2025-11-22 08:44:18.864309',26),
	(24,'2025-11-22 09:53:21.010404',28),
	(28,'2025-11-22 13:06:26.627495',29),
	(34,'2025-11-22 15:21:20.033947',30),
	(35,'2025-12-01 09:47:42.463504',31),
	(36,'2025-12-01 10:15:45.792806',33),
	(37,'2025-12-01 10:21:08.160956',34),
	(38,'2025-12-11 11:03:43.604657',37),
	(39,'2025-12-11 11:15:41.939364',39),
	(40,'2025-12-11 11:22:22.976570',40),
	(41,'2025-12-11 11:30:52.920327',41),
	(42,'2025-12-11 11:31:57.112584',42),
	(43,'2025-12-11 11:36:44.220614',43),
	(44,'2025-12-11 11:37:08.616518',44),
	(45,'2025-12-11 11:38:57.519813',45),
	(46,'2025-12-11 11:49:04.597175',46),
	(47,'2025-12-11 11:50:37.990008',47),
	(48,'2025-12-11 11:56:37.210952',48),
	(49,'2025-12-11 11:57:07.596975',49),
	(50,'2025-12-11 12:01:56.791298',50),
	(51,'2025-12-11 12:10:22.707231',51),
	(52,'2025-12-11 12:12:32.981047',53),
	(53,'2025-12-11 12:16:08.465146',54),
	(54,'2025-12-11 12:16:22.083315',55),
	(55,'2025-12-11 12:19:44.273865',56),
	(56,'2025-12-11 12:20:17.338494',57),
	(57,'2025-12-11 12:28:10.567474',59),
	(58,'2025-12-11 14:38:31.183911',60),
	(62,'2025-12-11 15:58:59.517172',61),
	(63,'2025-12-11 16:09:22.351797',62),
	(64,'2025-12-11 16:57:29.894554',64),
	(65,'2025-12-11 17:24:22.171991',66),
	(66,'2025-12-11 17:46:37.189231',67),
	(68,'2025-12-11 20:38:55.271853',68),
	(71,'2025-12-11 20:50:41.882698',69),
	(72,'2025-12-12 05:19:47.692356',71),
	(75,'2025-12-12 06:54:27.057364',72),
	(77,'2025-12-12 09:26:20.334527',73),
	(78,'2025-12-12 09:27:20.347857',74),
	(79,'2025-12-12 09:31:12.974155',75),
	(80,'2025-12-12 09:34:45.037567',76),
	(81,'2025-12-12 09:42:07.337232',77),
	(84,'2025-12-12 14:03:26.463028',79),
	(88,'2025-12-12 14:04:27.415739',80),
	(89,'2025-12-12 14:14:23.596644',81),
	(91,'2025-12-12 22:22:59.353668',82),
	(94,'2025-12-12 22:32:06.290221',83),
	(95,'2025-12-12 22:50:52.308800',85),
	(96,'2025-12-12 22:56:44.170833',86),
	(97,'2025-12-13 16:00:51.555008',88),
	(99,'2025-12-14 07:08:43.976698',89),
	(102,'2025-12-14 07:34:45.806967',92),
	(103,'2025-12-14 07:37:33.782618',93),
	(104,'2025-12-14 07:39:59.208061',94),
	(105,'2025-12-14 07:44:17.339219',95),
	(106,'2025-12-14 07:44:25.727924',96),
	(107,'2025-12-14 07:46:52.454222',97),
	(109,'2025-12-14 11:59:36.451000',98),
	(112,'2025-12-19 13:30:35.010264',100),
	(115,'2025-12-19 16:16:01.016563',102),
	(117,'2025-12-19 16:24:08.159934',103),
	(118,'2025-12-19 16:30:38.711449',105),
	(119,'2025-12-19 16:40:16.541902',106),
	(120,'2025-12-19 16:41:52.443342',107),
	(121,'2025-12-19 16:44:12.309649',108),
	(122,'2025-12-19 16:44:49.842900',109),
	(125,'2025-12-19 20:12:38.361203',110),
	(129,'2025-12-19 20:16:46.184090',111),
	(130,'2025-12-19 22:04:14.417129',112),
	(136,'2025-12-19 22:15:28.963818',113),
	(137,'2025-12-19 22:15:38.596761',114),
	(138,'2025-12-19 22:16:32.097115',115),
	(139,'2025-12-19 22:17:53.673893',116),
	(140,'2025-12-19 22:30:57.166128',117),
	(141,'2025-12-20 02:24:18.556726',119),
	(142,'2025-12-22 19:06:10.017968',121),
	(143,'2025-12-22 19:25:16.103008',122),
	(145,'2025-12-22 21:05:57.725120',123),
	(148,'2025-12-23 10:56:47.044338',125),
	(149,'2025-12-23 10:57:21.300105',126),
	(150,'2025-12-23 10:57:31.821623',127),
	(151,'2025-12-23 10:57:52.787175',128),
	(152,'2025-12-23 10:59:36.481247',129),
	(153,'2025-12-23 11:17:49.750145',130),
	(154,'2025-12-23 11:26:45.948077',132),
	(155,'2025-12-23 21:58:34.675176',133),
	(156,'2025-12-23 22:10:30.600847',134),
	(157,'2025-12-23 22:16:29.806080',135),
	(158,'2025-12-23 22:30:55.667263',137),
	(159,'2025-12-23 22:40:52.676025',138),
	(160,'2025-12-23 22:42:38.889156',140),
	(161,'2025-12-23 22:56:59.760569',141),
	(162,'2025-12-23 23:04:34.692384',142),
	(163,'2025-12-23 23:10:58.008122',143),
	(164,'2025-12-23 23:13:08.683048',144),
	(165,'2025-12-23 23:13:55.541150',145),
	(166,'2025-12-23 23:14:26.695811',146),
	(167,'2025-12-23 23:22:29.489973',147),
	(168,'2025-12-23 23:23:18.469981',148),
	(169,'2025-12-23 23:24:47.850016',149),
	(170,'2025-12-23 23:36:12.890981',150),
	(171,'2025-12-23 23:40:14.076709',151),
	(172,'2025-12-23 23:46:41.513349',152),
	(173,'2025-12-23 23:56:50.038640',153),
	(174,'2025-12-23 23:59:23.882083',154),
	(175,'2025-12-24 00:06:08.112252',155),
	(176,'2025-12-24 00:09:05.835449',156),
	(177,'2025-12-24 00:11:13.192085',157),
	(178,'2025-12-24 00:14:10.567191',158),
	(179,'2025-12-24 00:18:23.399759',159),
	(180,'2025-12-24 00:24:58.423808',160),
	(181,'2025-12-24 00:46:16.338361',161),
	(182,'2025-12-24 00:46:56.872719',162),
	(183,'2025-12-24 00:51:38.180855',163),
	(184,'2025-12-24 00:55:09.345076',164),
	(185,'2025-12-24 00:58:01.081748',165),
	(186,'2025-12-24 01:03:32.633845',166),
	(187,'2025-12-24 01:04:51.828582',167),
	(188,'2025-12-24 01:29:07.047700',168),
	(189,'2025-12-24 01:33:04.367732',169),
	(190,'2025-12-24 01:33:25.131205',170),
	(191,'2025-12-24 01:37:40.834342',172),
	(192,'2025-12-24 02:21:36.223212',174),
	(193,'2025-12-24 03:01:05.375696',175),
	(194,'2025-12-24 03:02:15.405757',176),
	(195,'2025-12-24 03:07:44.378703',177),
	(196,'2025-12-24 03:16:17.096804',178),
	(197,'2025-12-24 03:17:36.175818',179),
	(198,'2025-12-24 03:19:35.320093',180),
	(199,'2025-12-24 03:20:34.691242',181),
	(200,'2025-12-24 03:20:55.439468',182),
	(201,'2025-12-24 03:21:30.142175',183),
	(202,'2025-12-24 03:25:18.026086',184),
	(203,'2025-12-24 03:37:29.511947',185),
	(204,'2025-12-24 03:39:08.866669',186),
	(205,'2025-12-24 03:41:31.654415',187),
	(206,'2025-12-24 03:42:34.344610',188),
	(207,'2025-12-24 03:43:20.129508',189),
	(208,'2025-12-24 04:09:55.545574',190),
	(212,'2025-12-25 23:26:57.217715',124),
	(213,'2025-12-25 23:27:49.568181',192),
	(214,'2025-12-25 23:31:37.532983',193),
	(215,'2025-12-25 23:55:38.621502',194),
	(216,'2025-12-26 00:07:05.432763',195),
	(217,'2025-12-26 00:11:53.530811',196),
	(218,'2025-12-26 00:12:50.382282',197);

/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table token_blacklist_outstandingtoken
# ------------------------------------------------------------

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;

CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outstandingtoken_user_id_83bc629a_fk_users_id` (`user_id`),
  CONSTRAINT `token_blacklist_outstandingtoken_user_id_83bc629a_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;

INSERT INTO `token_blacklist_outstandingtoken` (`id`, `token`, `created_at`, `expires_at`, `user_id`, `jti`)
VALUES
	(1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MjI3MzQ0OCwiaWF0IjoxNzYxNjY4NjQ4LCJqdGkiOiJjMDhjZTU4YmUwYTk0MDFjYTA5Yjg5ZDY0OGYzMTA4ZiIsInVzZXJfaWQiOjJ9.cs0C62FQTJn66GHYmjxYBEixsmX9oDlxRcu4rESekyM','2025-10-28 16:24:08.252538','2025-11-04 16:24:08.000000',NULL,'c08ce58be0a9401ca09b89d648f3108f'),
	(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzM5NTc5NSwiaWF0IjoxNzYyNzkwOTk1LCJqdGkiOiI5NWZmYzZjM2RhZmM0YzJkOGQzNzQ2ZjRlY2Q2YmNjOSIsInVzZXJfaWQiOjN9.S5V8G2wD0Ge05ucs1eHLEuhzXvaAPZ3ZC5NG18nSydY','2025-11-10 16:09:55.596131','2025-11-17 16:09:55.000000',NULL,'95ffc6c3dafc4c2d8d3746f4ecd6bcc9'),
	(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzM5NTc5OSwiaWF0IjoxNzYyNzkwOTk5LCJqdGkiOiJmMDU4YjRhMjRmNmI0N2YxOTk4YmVkMjI0MzdhYTdhZiIsInVzZXJfaWQiOjN9.otGuGSNfHKo4xQDis8pv2mqRgwb45GOkUTqS54Qb9F8','2025-11-10 16:09:59.923144','2025-11-17 16:09:59.000000',NULL,'f058b4a24f6b47f1998bed22437aa7af'),
	(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzczNjY5MSwiaWF0IjoxNzYzMTMxODkxLCJqdGkiOiI5YTEyMjk3ZTA1Njg0OGIwOGU3OTE2ZmEzODM4YmY1YiIsInVzZXJfaWQiOjR9.XZuVl_trkscJ4Fc4K6NZ8b3q5HFU85vVHTPuM9uzwls','2025-11-14 14:51:31.865975','2025-11-21 14:51:31.000000',NULL,'9a12297e056848b08e7916fa3838bf5b'),
	(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgwMzg2OCwiaWF0IjoxNzYzMTk5MDY4LCJqdGkiOiJjMmQ0ZTE2NTc3NTQ0YTZkOTRiODkyYmI4Zjk4YzEwNyIsInVzZXJfaWQiOjJ9.oOI6bAXRYC4W1GEXNQTaiALYI2m68OcR09HS_aTGK_A','2025-11-15 09:31:08.738963','2025-11-22 09:31:08.000000',NULL,'c2d4e16577544a6d94b892bb8f98c107'),
	(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgwNDEwOSwiaWF0IjoxNzYzMTk5MzA5LCJqdGkiOiIzZTY4ZDUwM2ExYmM0YjVhOTFkMzU0N2FhMzkyMmQ1YyIsInVzZXJfaWQiOjJ9.tTWlz37ubrugHoMQPGZspZBxvhf7PEXIro67nJ2nnY0','2025-11-15 09:35:09.530649','2025-11-22 09:35:09.000000',NULL,'3e68d503a1bc4b5a91d3547aa3922d5c'),
	(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgwNDEzMywiaWF0IjoxNzYzMTk5MzMzLCJqdGkiOiJkNzg4OWZmNzkzMjY0Yzg1YTBhOWIxMzVlMmZhNTNkNyIsInVzZXJfaWQiOjJ9.IHhfc3u4H3t6ryf4B2AdDPqG3Lse6HbveA2oe8D3dkM','2025-11-15 09:35:33.528803','2025-11-22 09:35:33.000000',NULL,'d7889ff793264c85a0a9b135e2fa53d7'),
	(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgwNDYyOCwiaWF0IjoxNzYzMTk5ODI4LCJqdGkiOiIxYWM1ZmQ2NjNiNjQ0MDc1YmNiNDcyN2NlNjFlZGQ3YiIsInVzZXJfaWQiOjF9.ScjduThaLY-OepUgoY_v3bBBOGLt27aljWZdKzd5U2Q','2025-11-15 09:43:48.177023','2025-11-22 09:43:48.000000',NULL,'1ac5fd663b644075bcb4727ce61edd7b'),
	(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgyOTQ0OCwiaWF0IjoxNzYzMjI0NjQ4LCJqdGkiOiIwNGFiNjUwMTVjNDI0MWU5ODM0MzE5M2E2MGI0YzE2ZSIsInVzZXJfaWQiOjJ9.P53bagALOsoMl3X4CwT7IWEfgiXY_4dI9bA2woCiBDk','2025-11-15 16:37:28.767014','2025-11-22 16:37:28.000000',NULL,'04ab65015c4241e98343193a60b4c16e'),
	(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgyOTQ3OSwiaWF0IjoxNzYzMjI0Njc5LCJqdGkiOiIyOTZjN2ZjMDdmZjQ0NzRmYTExNDMwMmE3MGUzMGZiNiIsInVzZXJfaWQiOjJ9.dQR6ch9-EtR_79lx7ce8dynLzR7MEzhofTYrx3G42wI','2025-11-15 16:37:59.955636','2025-11-22 16:37:59.000000',NULL,'296c7fc07ff4474fa114302a70e30fb6'),
	(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgyOTc4NCwiaWF0IjoxNzYzMjI0OTg0LCJqdGkiOiI4NGY4ZmQ1YjM2Mzg0NzI2YTc5ZTQxZTE3ZWU2NDJkYiIsInVzZXJfaWQiOjV9.gs2qW6xEXLApsDLPVORx9zIduGnIaooJoJInLmsQWEA','2025-11-15 16:43:04.960271','2025-11-22 16:43:04.000000',NULL,'84f8fd5b36384726a79e41e17ee642db'),
	(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgzMDEyOCwiaWF0IjoxNzYzMjI1MzI4LCJqdGkiOiI3YTBlOGQ1YWQ0NDE0OWZmYjU1NjQzMzljYWE2YzljMyIsInVzZXJfaWQiOjV9.kkBbC488BLyMw691UY-UOR3FkafTY_Ml767lSvYbPOM','2025-11-15 16:48:48.668359','2025-11-22 16:48:48.000000',NULL,'7a0e8d5ad44149ffb5564339caa6c9c3'),
	(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2MzgzMDIxMywiaWF0IjoxNzYzMjI1NDEzLCJqdGkiOiI4Mjg5OGMzZmFhYTU0YzIwYmJkYzdkNDA2ODI3ODUxMyIsInVzZXJfaWQiOjV9.hCHo_jVVQw1BgLmy9K0MCE3w3QfeQZCR8ojMJw6xEw4','2025-11-15 16:50:13.609526','2025-11-22 16:50:13.000000',NULL,'82898c3faaa54c20bbdc7d4068278513'),
	(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Mzg5NTU3NiwiaWF0IjoxNzYzMjkwNzc2LCJqdGkiOiIwMmE2ODE3YjEyNTQ0ZmJmOWY5ODkwYzQ2MDljNDg5ZiIsInVzZXJfaWQiOjV9.NTetUALS1R4uyu1DsXt5iVc8oHmpqPnaRvWJtdgGvy0','2025-11-16 10:59:36.532215','2025-11-23 10:59:36.000000',NULL,'02a6817b12544fbf9f9890c4609c489f'),
	(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Mzg5NTU4OSwiaWF0IjoxNzYzMjkwNzg5LCJqdGkiOiJmYzBhNTI5ODc5NTQ0YzAyYTA5NTc5MWJmMWFjNWRjYSIsInVzZXJfaWQiOjJ9.0Q7T2aCrIVyMBaIFQkPUywgeaS0kF7joc5MjSQ4-CkU','2025-11-16 10:59:49.293686','2025-11-23 10:59:49.000000',NULL,'fc0a529879544c02a095791bf1ac5dca'),
	(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MjgyMywiaWF0IjoxNzYzNDQ4MDIzLCJqdGkiOiJmOWI0MGU5ZDBjYzI0ZGQ2OWVlZGNiODNhZjYxN2RjZCIsInVzZXJfaWQiOjV9.0QoDieK2m7zH0Ujc__FByroBzd0m2fBMRVyTAlC4HYs','2025-11-18 06:40:23.929779','2025-11-25 06:40:23.000000',NULL,'f9b40e9d0cc24dd69eedcb83af617dcd'),
	(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1Mjg1MywiaWF0IjoxNzYzNDQ4MDUzLCJqdGkiOiI4YmVhOGM5NGIyN2I0MzgxODI1MDcyN2UwZjNmMjlmNyIsInVzZXJfaWQiOjJ9.K_YrE9Telo4A5UuYrASiscxZaKIcR2CM-jNRpFTEcAc','2025-11-18 06:40:53.711454','2025-11-25 06:40:53.000000',NULL,'8bea8c94b27b43818250727e0f3f29f7'),
	(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MjkwMCwiaWF0IjoxNzYzNDQ4MTAwLCJqdGkiOiI1YjM1YTU0NDUyMDA0NGMwYmI3OGQ3YjYwMjJhNzA1YiIsInVzZXJfaWQiOjV9.QD1dRjzYXECKeuz6jQ5IiZFbH74NyoUUiAW7KDpO6Dk','2025-11-18 06:41:40.422470','2025-11-25 06:41:40.000000',NULL,'5b35a544520044c0bb78d7b6022a705b'),
	(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MzE3OCwiaWF0IjoxNzYzNDQ4Mzc4LCJqdGkiOiJmZjE1Y2RkZThmODk0ZDcwYTcwOWRhYmEyOGExNDAzZSIsInVzZXJfaWQiOjV9._CzoqVRK7Wp8SoIF7r5jHeGFkx7FahRi-X9dQdJJHLc','2025-11-18 06:46:18.680613','2025-11-25 06:46:18.000000',NULL,'ff15cdde8f894d70a709daba28a1403e'),
	(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MzQzNywiaWF0IjoxNzYzNDQ4NjM3LCJqdGkiOiIzMWIyYWNiYmI0ODQ0NzEwOGNlY2IzOWU5M2JjOWNiNCIsInVzZXJfaWQiOjJ9.RRQrI-vI7FXZsFHENVm8AeWnvARgjfStiFciMtIx4K8','2025-11-18 06:50:37.870608','2025-11-25 06:50:37.000000',NULL,'31b2acbbb48447108cecb39e93bc9cb4'),
	(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MzYwMiwiaWF0IjoxNzYzNDQ4ODAyLCJqdGkiOiJhODI2ZTczOGEyZmQ0YzE1ODM1MzExOWFkZTdjZGE1ZCIsInVzZXJfaWQiOjV9.XCjO9Q6a-8IyPEYNxCYSRuQCwW8F5S1ct7c-wMBzhXk','2025-11-18 06:53:22.771027','2025-11-25 06:53:22.000000',NULL,'a826e738a2fd4c158353119ade7cda5d'),
	(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDA1MzY5MiwiaWF0IjoxNzYzNDQ4ODkyLCJqdGkiOiJlMjQ4MzVmZjQxNWY0ZTc3YjU4NjA3N2EyNzYwZGFlYSIsInVzZXJfaWQiOjV9.mX5qYtzoS5zplv2RB4rkCfmod455tXbombucr814P_w','2025-11-18 06:54:52.954431','2025-11-25 06:54:52.000000',NULL,'e24835ff415f4e77b586077a2760daea'),
	(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNDA5NywiaWF0IjoxNzYzNzk5Mjk3LCJqdGkiOiJhYjVhZDA3YTAwNTI0YzgyYmE4ZDhiODJkOGM2MWMwOSIsInVzZXJfaWQiOjJ9.ZQvEWIh-PpQBQEF-2-miyEnjbzFH7bKW_w9EiR92xfs','2025-11-22 08:14:57.661784','2025-11-29 08:14:57.000000',NULL,'ab5ad07a00524c82ba8d8b82d8c61c09'),
	(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNDQ2NywiaWF0IjoxNzYzNzk5NjY3LCJqdGkiOiJkMzFjOTM1Y2MwNjY0NDY0YjczMmFjZGRlODIxZWFiZiIsInVzZXJfaWQiOjV9.uN8W11-KFZfXE5fJ4TunZVc1sVZuTTYIbr1pnce7RhU','2025-11-22 08:21:07.157701','2025-11-29 08:21:07.000000',NULL,'d31c935cc0664464b732acdde821eabf'),
	(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNDU2MSwiaWF0IjoxNzYzNzk5NzYxLCJqdGkiOiIyYzI4ZDAzOWJkODA0NjE1YWM4ZWIzOTA2NmFhOWNjNCIsInVzZXJfaWQiOjJ9.OTlCe32ub7MBCTyUiXhygY3U80eBtDQdeM-CX6O07KU','2025-11-22 08:22:41.286619','2025-11-29 08:22:41.000000',NULL,'2c28d039bd804615ac8eb39066aa9cc4'),
	(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNDk0NCwiaWF0IjoxNzYzODAwMTQ0LCJqdGkiOiIzOGQ4MTdmYTU3Y2M0NGQzOTQwZjc4MTBiMTIyZGIyNyIsInVzZXJfaWQiOjJ9.DM8uzCcPMd5czWFmbF9g4SqpZsC70wXdiLLfQZxk8rc','2025-11-22 08:29:04.878443','2025-11-29 08:29:04.000000',NULL,'38d817fa57cc44d3940f7810b122db27'),
	(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNTAxMywiaWF0IjoxNzYzODAwMjEzLCJqdGkiOiJjNGU0OGY2ZWIwNjk0YjU0OWRmMjU0YzA1ZDY1ZmQ4OSIsInVzZXJfaWQiOjJ9.eDEkf9w1xGMycjiY7-k-MwjFKnMmfIT8PWlA4RfM-9g','2025-11-22 08:30:13.981849','2025-11-29 08:30:13.000000',NULL,'c4e48f6eb0694b549df254c05d65fd89'),
	(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQwNTg2NiwiaWF0IjoxNzYzODAxMDY2LCJqdGkiOiJkZjI1MWE1OTdmYjQ0NGMxOWNhYTRhYmU5ZmM4OTYyZCIsInVzZXJfaWQiOjV9.EBk1GikgmnRgNo-fjkL3XJcs5tsko31nlFUH_eLeOl0','2025-11-22 08:44:26.827938','2025-11-29 08:44:26.000000',NULL,'df251a597fb444c19caa4abe9fc8962d'),
	(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQxODI0NiwiaWF0IjoxNzYzODEzNDQ2LCJqdGkiOiJjMmM4MjRjMzg2NTY0M2RiYjFiYzRlYmYxYTM2M2MyOCIsInVzZXJfaWQiOjJ9.iOJZEa0Phnf5X9PCltGVJ4qkJlSHXM0zFZ4m_cRZUP4','2025-11-22 12:10:46.650628','2025-11-29 12:10:46.000000',NULL,'c2c824c3865643dbb1bc4ebf1a363c28'),
	(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NDQyMTU5NCwiaWF0IjoxNzYzODE2Nzk0LCJqdGkiOiI5MjY3NDMyMGM0NmE0OWQxYjliYjNiZjU0MmQ2NTRmOSIsInVzZXJfaWQiOjV9.mAfqLhB2ijfUdB_Z6QfiNamYEPV0qJicaYoi6VZif60','2025-11-22 13:06:34.216477','2025-11-29 13:06:34.000000',NULL,'92674320c46a49d1b9bb3bf542d654f9'),
	(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTE4NzIyNCwiaWF0IjoxNzY0NTgyNDI0LCJqdGkiOiI1NzMxMzZlMjdmMjk0MGI1OGRhMDI4Nzg3YzAzM2U3YiIsInVzZXJfaWQiOjJ9.GAjPZJSk3h3C_7PdUTmwUp3Y3mNEdzQd58JL8J45zzo','2025-12-01 09:47:04.779502','2025-12-08 09:47:04.000000',NULL,'573136e27f2940b58da028787c033e7b'),
	(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTE4NzI3NCwiaWF0IjoxNzY0NTgyNDc0LCJqdGkiOiI1ZmQ5NjgyNjkyNmY0NDY2YjAwMmI5NGY5ZTQ4MjUwOCIsInVzZXJfaWQiOjV9.5d9SqRQzm6Zt5Gz154D8s09WT5lNJfVSni0Qa2N6QO0','2025-12-01 09:47:54.227957','2025-12-08 09:47:54.000000',NULL,'5fd96826926f4466b002b94f9e482508'),
	(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTE4ODUxNSwiaWF0IjoxNzY0NTgzNzE1LCJqdGkiOiI0ZWEyYmRjYzM0Zjc0ZTk2OWFhMTUzM2IyNGY2YzhmMCIsInVzZXJfaWQiOjV9.6gHBjRvyQaZiTrnP8Q-KLhNzNkCred-3quLbNtIV-ss','2025-12-01 10:08:35.383298','2025-12-08 10:08:35.000000',NULL,'4ea2bdcc34f74e969aa1533b24f6c8f0'),
	(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTE4ODk1MiwiaWF0IjoxNzY0NTg0MTUyLCJqdGkiOiI1YjYyYTZlYzg0Mzg0OWUzYTRiOTdmMWZmMDc1ODA2MiIsInVzZXJfaWQiOjV9.dZmxHEtNW_4Pi9D_V3tFu8tvqXHmXf7iZ9jTxM5-vMg','2025-12-01 10:15:52.291742','2025-12-08 10:15:52.000000',NULL,'5b62a6ec843849e3a4b97f1ff0758062'),
	(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTE4OTI3NCwiaWF0IjoxNzY0NTg0NDc0LCJqdGkiOiJjODFhY2ViMWYyNGE0YTkyOWNmOTJjNmJmNmYwMjdmZCIsInVzZXJfaWQiOjV9._mnollaqa5G7__K6QoJD1TW4IqjtAA6OkXp3KO-2-M0','2025-12-01 10:21:14.145856','2025-12-08 10:21:14.000000',NULL,'c81aceb1f24a4a929cf92c6bf6f027fd'),
	(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NTU0ODMwNSwiaWF0IjoxNzY0OTQzNTA1LCJqdGkiOiIyZjllN2FkZjk0NTY0NDUxOTMxZWNhOTA1YjEwZDcwMiIsInVzZXJfaWQiOjV9.ZwXqpD_p3WlXrb1hnk8AIJQPs3UPv-_XlHkUy3U1VwI','2025-12-05 14:05:05.840055','2025-12-12 14:05:05.000000',NULL,'2f9e7adf94564451931eca905b10d702'),
	(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NTY4NiwiaWF0IjoxNzY1NDUwODg2LCJqdGkiOiI3Y2VlOWIxOGFiOGM0NDM5ODQyYzc4YTQ0ZGI2ODZmZSIsInVzZXJfaWQiOjV9.QjKQtGWZ2YmORTDbU16vmTDXv_Oqm4TGZZVxrEMqqUI','2025-12-11 11:01:26.544512','2025-12-18 11:01:26.000000',NULL,'7cee9b18ab8c4439842c78a44db686fe'),
	(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NTgzNCwiaWF0IjoxNzY1NDUxMDM0LCJqdGkiOiI0ZWZmOTRmMzM3ZDE0ZjIzYmM5YTZiNThjY2I2MDVmMSIsInVzZXJfaWQiOjJ9.60ahaImcLDJMfOC0UamJh_pWu1T2uFIaoI4he87SN18','2025-12-11 11:03:54.931578','2025-12-18 11:03:54.000000',NULL,'4eff94f337d14f23bc9a6b58ccb605f1'),
	(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NjA5NSwiaWF0IjoxNzY1NDUxMjk1LCJqdGkiOiI2NGM1MDY1NTliY2Y0YzAxYjY4NDAyMTJlZjhjMWI4MyIsInVzZXJfaWQiOjV9.2p5MbfnNacX2MCy-w-CgwFxYG8t5QgQE9cEytB36aMI','2025-12-11 11:08:15.514138','2025-12-18 11:08:15.000000',NULL,'64c506559bcf4c01b6840212ef8c1b83'),
	(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NjU0NiwiaWF0IjoxNzY1NDUxNzQ2LCJqdGkiOiI3MTMwY2Q3ZjZkNjM0ODY2ODBkMzliZGVkMDgwYWVmZSIsInVzZXJfaWQiOjV9.DMTYRHXrmUWptq6Wp75i13luQrMg6VVrjsYZUricT8I','2025-12-11 11:15:46.596975','2025-12-18 11:15:46.000000',NULL,'7130cd7f6d63486680d39bded080aefe'),
	(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1Njk1MywiaWF0IjoxNzY1NDUyMTUzLCJqdGkiOiJjMzg0YjcyNGUzYzc0MmI4YjJiYzk1NWE2NTAxYzYyZSIsInVzZXJfaWQiOjJ9.QF9h1GM4kb_4KJd4Ms10bc8Lp5rMzpQ4DgahgQntogg','2025-12-11 11:22:33.501991','2025-12-18 11:22:33.000000',NULL,'c384b724e3c742b8b2bc955a6501c62e'),
	(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NzQ1NiwiaWF0IjoxNzY1NDUyNjU2LCJqdGkiOiI0ZDAzOWEyYThjMGE0NDBhYTc3ZmU1MWFhYjg0NjRkOSIsInVzZXJfaWQiOjV9.W8cbhod4SxxmxZoUnJrJ-N_dajtUw7rsQUBfiNlVgXc','2025-12-11 11:30:56.986501','2025-12-18 11:30:56.000000',NULL,'4d039a2a8c0a440aa77fe51aab8464d9'),
	(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NzUyNSwiaWF0IjoxNzY1NDUyNzI1LCJqdGkiOiIyMjY2Yjg5ZDZjOGU0ZThhOTgxMzI5NmMzNGFlODUzOCIsInVzZXJfaWQiOjJ9._Zc0QEnv-ZSYYyQoDZnApVv8Tb4qdf7JbN1lFqabga4','2025-12-11 11:32:05.729410','2025-12-18 11:32:05.000000',NULL,'2266b89d6c8e4e8a9813296c34ae8538'),
	(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NzgyNiwiaWF0IjoxNzY1NDUzMDI2LCJqdGkiOiJmOGY1YzVjYWFhOTg0OTBmYTU4YWQwYjhjMjdjODIzYSIsInVzZXJfaWQiOjJ9.kAXFhOWilZG4kYtdxpQtFgZsLtL9Jz4nJ-CFmz6Z-FE','2025-12-11 11:37:06.545428','2025-12-18 11:37:06.000000',NULL,'f8f5c5caaa98490fa58ad0b8c27c823a'),
	(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1NzgzMywiaWF0IjoxNzY1NDUzMDMzLCJqdGkiOiI3M2NmMTEyMzAxOTk0ZWU5OGI4MDIxMTQxOTQzYzQzMyIsInVzZXJfaWQiOjV9.7gT7NEWIDb5KxILSY7cknRhVCLiFgZEsSikUcUm5D98','2025-12-11 11:37:13.744333','2025-12-18 11:37:13.000000',NULL,'73cf112301994ee98b8021141943c433'),
	(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1Nzk2MywiaWF0IjoxNzY1NDUzMTYzLCJqdGkiOiJlMWJmZTEzNzI1Yjk0NGM3YWRmNWNjMzMyMDUzMDZhMiIsInVzZXJfaWQiOjJ9.2npSHb4bTNaDz8IscdRyFqYcRqKtdZC2I2cIXQjBCc4','2025-12-11 11:39:23.725953','2025-12-18 11:39:23.000000',NULL,'e1bfe13725b944c7adf5cc33205306a2'),
	(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1ODU1MCwiaWF0IjoxNzY1NDUzNzUwLCJqdGkiOiJjY2MxOWM0Yzc4YzA0ZGEwYWQ0ZjA1ZTYzYjExMDFhNSIsInVzZXJfaWQiOjV9.pXvVEHpGY_uq-hSqHpEaU38zKwlSpmrbqxnwPPkR6zM','2025-12-11 11:49:10.989471','2025-12-18 11:49:10.000000',NULL,'ccc19c4c78c04da0ad4f05e63b1101a5'),
	(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1ODY0MywiaWF0IjoxNzY1NDUzODQzLCJqdGkiOiJhYTI2OGU1OWExYWI0N2VmODhmZTk5ZTIyZWRjZWFkOSIsInVzZXJfaWQiOjJ9.LgNm6P-8zhl9wQDU1cAsqKmWgSBrRQLT98_6hJ007wo','2025-12-11 11:50:43.325660','2025-12-18 11:50:43.000000',NULL,'aa268e59a1ab47ef88fe99e22edcead9'),
	(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTAwMiwiaWF0IjoxNzY1NDU0MjAyLCJqdGkiOiIyMjcyYzhlODhiYzE0OTAxYTc4ZjIwZDg3ZTRjMWYzZiIsInVzZXJfaWQiOjJ9.MePhqZ_7P13KdwTIVaZgEGn6IOAl3HaK3wB-04wjkfU','2025-12-11 11:56:42.268588','2025-12-18 11:56:42.000000',NULL,'2272c8e88bc14901a78f20d87e4c1f3f'),
	(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTAzMSwiaWF0IjoxNzY1NDU0MjMxLCJqdGkiOiI2OGM2ZWE5YTc5OTQ0MTNhOTBlMGE4Y2MxZTU0ZDlkOCIsInVzZXJfaWQiOjV9.zd3klTFFxyBN5Z0r6cKvHv8Yv5BNVE9NL6z-dy4xp7E','2025-12-11 11:57:11.263895','2025-12-18 11:57:11.000000',NULL,'68c6ea9a7994413a90e0a8cc1e54d9d8'),
	(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTMyNiwiaWF0IjoxNzY1NDU0NTI2LCJqdGkiOiIxNzUzYTdjNWQyMmQ0Nzk0YmI5ZjM1ODA3YjNmMWZiMCIsInVzZXJfaWQiOjJ9.OvIWo-QZI0U-ASo5TwJv3coCE9TSMEgs0hdko5Olmow','2025-12-11 12:02:06.802925','2025-12-18 12:02:06.000000',NULL,'1753a7c5d22d4794bb9f35807b3f1fb0'),
	(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTgyOSwiaWF0IjoxNzY1NDU1MDI5LCJqdGkiOiJlMjE4NGJjNmJiM2Y0Y2I4ODI4MTMzYjA1NmUyMjdlMiIsInVzZXJfaWQiOjV9.PAiflzoiJCJ0AgC1LMoJPFMZl9itWOV_RLS1JIK1gXA','2025-12-11 12:10:29.985598','2025-12-18 12:10:29.000000',NULL,'e2184bc6bb3f4cb8828133b056e227e2'),
	(53,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTkyNSwiaWF0IjoxNzY1NDU1MTI1LCJqdGkiOiJhYWMxMjQwMWMwODU0MDNjYWM2NGY4ODQwMTI5NDg0OSIsInVzZXJfaWQiOjV9.znTYtb4xj5l5mWf_MsuR4Q3XyZZYortPF9PXpN_Jnow','2025-12-11 12:12:05.094368','2025-12-18 12:12:05.000000',NULL,'aac12401c085403cac64f88401294849'),
	(54,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA1OTk1OCwiaWF0IjoxNzY1NDU1MTU4LCJqdGkiOiI5ODY3NzZkZGU5MTQ0ZTY1OTM3YTFlMjZmMzhiOWQyYyIsInVzZXJfaWQiOjV9.Sak6jkLRZDKsXX1IboNONa2iH8oZd--CRNq3_oeuqd8','2025-12-11 12:12:38.858883','2025-12-18 12:12:38.000000',NULL,'986776dde9144e65937a1e26f38b9d2c'),
	(55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDE3NywiaWF0IjoxNzY1NDU1Mzc3LCJqdGkiOiI3YmVhMTRhMGQ2YWU0ZDcyODgyYzZjOTI2YTFmNmRiMCIsInVzZXJfaWQiOjJ9.fcJHQJGS_JATvJzmphyDEKaKKF1AgtUawjvrbsg_e7o','2025-12-11 12:16:17.834562','2025-12-18 12:16:17.000000',NULL,'7bea14a0d6ae4d72882c6c926a1f6db0'),
	(56,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDM3NCwiaWF0IjoxNzY1NDU1NTc0LCJqdGkiOiI5MjA3ZjgyYjBkYWU0ZWQxYTE2NzliNzdjYjZmYWMxMCIsInVzZXJfaWQiOjV9.jlIpsW79gQX9oT0fPYRPo6E-_7Y8aY1jTpdKoG5ggRw','2025-12-11 12:19:34.281804','2025-12-18 12:19:34.000000',NULL,'9207f82b0dae4ed1a1679b77cb6fac10'),
	(57,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDM4OSwiaWF0IjoxNzY1NDU1NTg5LCJqdGkiOiI0ZGNmMGQ1ZWRmNTY0M2E2YTYxNzMyMDI3ZmQ0MDlhNSIsInVzZXJfaWQiOjJ9.GwJvgjxItijPm45GTEroqe5inOvFtG_Mtm6No60Afd8','2025-12-11 12:19:49.245149','2025-12-18 12:19:49.000000',NULL,'4dcf0d5edf5643a6a61732027fd409a5'),
	(58,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDQyMywiaWF0IjoxNzY1NDU1NjIzLCJqdGkiOiI5YTBjZjhlYjg2Njg0NDNiYWRiNWUxMGUwNTQ4N2U4NiIsInVzZXJfaWQiOjV9.z563ekX85RWUHBiQWtsY_voH7FS5AV7sZVEwsElFKyU','2025-12-11 12:20:23.046846','2025-12-18 12:20:23.000000',NULL,'9a0cf8eb8668443badb5e10e05487e86'),
	(59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDgwOCwiaWF0IjoxNzY1NDU2MDA4LCJqdGkiOiIwYzBlNjdhMDZjN2Y0ZTUzYTAwMDg3MTZlNjQ3MDdiYiIsInVzZXJfaWQiOjV9.l2lUsNvy-P8O8iyI2Ez0OYLsUFu4w91ULrhqiyiGUqw','2025-12-11 12:26:48.898421','2025-12-18 12:26:48.000000',NULL,'0c0e67a06c7f4e53a0008716e64707bb'),
	(60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA2MDg5NSwiaWF0IjoxNzY1NDU2MDk1LCJqdGkiOiJlZjVmY2VmNDk2NzE0Mjg0OWVjYmJjZTQyNzczMDVhYiIsInVzZXJfaWQiOjJ9.H9DWRWcxLPVLy68BH6jbMDdV9NgyABhuJWFJ0MGezqc','2025-12-11 12:28:15.772546','2025-12-18 12:28:15.000000',NULL,'ef5fcef4967142849ecbbce4277305ab'),
	(61,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3Mjc3MywiaWF0IjoxNzY1NDY3OTczLCJqdGkiOiI3NzAyNTZjNTllN2I0YjZmOTIxZGRiNzMyZjc1YjliOSIsInVzZXJfaWQiOjV9.IhxGWr5ny7utNVBbsk5FXxyask_-diSIbE-TjlMmw0w','2025-12-11 15:46:13.795398','2025-12-18 15:46:13.000000',NULL,'770256c59e7b4b6f921ddb732f75b9b9'),
	(62,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3Mzc5MSwiaWF0IjoxNzY1NDY4OTkxLCJqdGkiOiIzMjVhZjA4ZjE2NDc0M2UxOWI3ZDNlZTA4YzE1NzA2MSIsInVzZXJfaWQiOjV9.s-8KTfxbJ8rAYmCfjRIqLis618lq3c0HyJTz1K_0GgM','2025-12-11 16:03:11.931791','2025-12-18 16:03:11.000000',NULL,'325af08f164743e19b7d3ee08c157061'),
	(63,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3NDE2NywiaWF0IjoxNzY1NDY5MzY3LCJqdGkiOiI2MWYwMTRjMGJkNTk0MWEwYTQwNjQyM2U5Yzg0OGVlNiIsInVzZXJfaWQiOjJ9.lPKDZHuCgGz7u3U8kf32rQxFVROKSQTl5KOut2l9ZuU','2025-12-11 16:09:27.920128','2025-12-18 16:09:27.000000',NULL,'61f014c0bd5941a0a406423e9c848ee6'),
	(64,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3NTgwNSwiaWF0IjoxNzY1NDcxMDA1LCJqdGkiOiI5ZDI0MTZmM2IxMTM0OGUyODYzYWEwNDIzNzU3Mjk1YSIsInVzZXJfaWQiOjJ9.hEiAir98uGI_q86V1WiwwsWMaEuXk333n7Mf6giVTRY','2025-12-11 16:36:45.355779','2025-12-18 16:36:45.000000',NULL,'9d2416f3b11348e2863aa0423757295a'),
	(65,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3NzA1NCwiaWF0IjoxNzY1NDcyMjU0LCJqdGkiOiJkNTNhNWY1ZGExZGM0M2IxYTBjNDc2MzE3N2E0MWEwNCIsInVzZXJfaWQiOjJ9.EImzYNE2bseaz-o19mzg4KKfKjhVvuf4H5I1ONBAJaY','2025-12-11 16:57:34.592469','2025-12-18 16:57:34.000000',NULL,'d53a5f5da1dc43b1a0c4763177a41a04'),
	(66,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3Nzg1NiwiaWF0IjoxNzY1NDczMDU2LCJqdGkiOiI2YmYxZWQ5MWU3MGQ0NWQ4OTE2NTA1YmRhMTRkYzFjZiIsInVzZXJfaWQiOjJ9.7M-lLQMCYNPHOhYbZOsi0ANXDom7TofzrysmzyUUfPQ','2025-12-11 17:10:56.911708','2025-12-18 17:10:56.000000',NULL,'6bf1ed91e70d45d8916505bda14dc1cf'),
	(67,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA3ODY2NiwiaWF0IjoxNzY1NDczODY2LCJqdGkiOiJlMzBiODhiOTMzMDQ0MTE1YTlkYWZlODg0MDVhNzI4NSIsInVzZXJfaWQiOjV9.3upVmr1U6kr1DN_mcALdE8QGeV4I9qDiYnVyf5VO2mY','2025-12-11 17:24:26.704916','2025-12-18 17:24:26.000000',NULL,'e30b88b933044115a9dafe88405a7285'),
	(68,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA4MDAwMCwiaWF0IjoxNzY1NDc1MjAwLCJqdGkiOiI4OTBkODE4OTk0NmY0YjcwOTkxNzUyZGFjNThkNDY5OCIsInVzZXJfaWQiOjJ9.ho8mVcBnyiBZe-nQDdU764-QIll_9uJ50zcbwv34pQo','2025-12-11 17:46:40.803699','2025-12-18 17:46:40.000000',NULL,'890d8189946f4b70991752dac58d4698'),
	(69,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA5MDc5MywiaWF0IjoxNzY1NDg1OTkzLCJqdGkiOiI5NDg4ZDk4MGNlMzU0MWYxODdjOGY3NGM0YTA2NjcxNCIsInVzZXJfaWQiOjV9.wViRFWj_d7gU2sxAXweXWIu5f_S6ohPyU_ZviXCw6bM','2025-12-11 20:46:33.470495','2025-12-18 20:46:33.000000',NULL,'9488d980ce3541f187c8f74c4a066714'),
	(70,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjA5MTA0NywiaWF0IjoxNzY1NDg2MjQ3LCJqdGkiOiIzNGNmOTdjMzAxM2I0ZjkyODEyMTNkNGZhYTZiZGMyOCIsInVzZXJfaWQiOjJ9.POnsY5Sya40zZy0Zvmgr5Z8ZPuf6-F4-NVsOWA5M4hk','2025-12-11 20:50:47.553818','2025-12-18 20:50:47.000000',NULL,'34cf97c3013b4f9281213d4faa6bdc28'),
	(71,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEyMTIwMywiaWF0IjoxNzY1NTE2NDAzLCJqdGkiOiI4N2RkYTU2NGE1YjM0ZTQ4OTdjNWMwNWFlN2Y2NzJmMiIsInVzZXJfaWQiOjV9.DJub3SoVCGSyB2nsUyLcZmYXw-tPGIJIKDaZHx7yDZc','2025-12-12 05:13:23.619075','2025-12-19 05:13:23.000000',NULL,'87dda564a5b34e4897c5c05ae7f672f2'),
	(72,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEyMTU5NCwiaWF0IjoxNzY1NTE2Nzk0LCJqdGkiOiI0YjM4ZDY2Yzk0YTI0NDM5ODlmN2VjMjY0ZWExNjg5ZiIsInVzZXJfaWQiOjd9.13HjAblvnqX4eSK2xkSE3DK_LGeGxcOIeoDdaCXJK5k','2025-12-12 05:19:54.471841','2025-12-19 05:19:54.000000',NULL,'4b38d66c94a2443989f7ec264ea1689f'),
	(73,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNTkzOCwiaWF0IjoxNzY1NTMxMTM4LCJqdGkiOiIwNjdlMGZhOTE5Yzg0MTEzODg4ZmFiMTQ3YzMwN2NkZCIsInVzZXJfaWQiOjd9.L38a9o4-f5Irwxo3WwaiZAxca_pizQdYiErpsl2W3rw','2025-12-12 09:18:58.605372','2025-12-19 09:18:58.000000',NULL,'067e0fa919c84113888fab147c307cdd'),
	(74,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNjM4NCwiaWF0IjoxNzY1NTMxNTg0LCJqdGkiOiI2MDQ1MDU4YmRkZmY0NWEyOTk4NjdlZTg4MWQ2YWQ3NSIsInVzZXJfaWQiOjV9.YUSlMmPqJmqvb2gf_xPeQIayzk7eTztlqOZbVvQnGTw','2025-12-12 09:26:24.212580','2025-12-19 09:26:24.000000',NULL,'6045058bddff45a299867ee881d6ad75'),
	(75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNjQ0NiwiaWF0IjoxNzY1NTMxNjQ2LCJqdGkiOiIyNTJkNzVhNjY1ZTA0NGFjOTdiMGVlODc4Yzc5NTk0YSIsInVzZXJfaWQiOjd9.4Q0MP842hjyfBxzVFtvWbt_00KBEehZvW_tyMiQrxPI','2025-12-12 09:27:26.295033','2025-12-19 09:27:26.000000',NULL,'252d75a665e044ac97b0ee878c79594a'),
	(76,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNjY4NSwiaWF0IjoxNzY1NTMxODg1LCJqdGkiOiJiMmNhYzM3NjNkNTM0OWJlYmI3MjI1NDYzZmM1ZTMxNyIsInVzZXJfaWQiOjd9.YarurfTyi_QW66JzA9d5f5EsYRPdUG4y2t6gLy0P0JQ','2025-12-12 09:31:25.763249','2025-12-19 09:31:25.000000',NULL,'b2cac3763d5349bebb7225463fc5e317'),
	(77,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNzAxOSwiaWF0IjoxNzY1NTMyMjE5LCJqdGkiOiI0OTE0MmFkNGM3MWE0Mzc4YWQ1NWMyMmMxNjg2NGJmZSIsInVzZXJfaWQiOjd9.nNYdNP844JuQnG3iKJ4lowB45x5k6YW3LhjJ95ypNVk','2025-12-12 09:36:59.744435','2025-12-19 09:36:59.000000',NULL,'49142ad4c71a4378ad55c22c16864bfe'),
	(78,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjEzNzMzMywiaWF0IjoxNzY1NTMyNTMzLCJqdGkiOiI2MzZkMjgyNzJhMzc0MzA4YWQ2MjU3YmZkNjVmMjVlZiIsInVzZXJfaWQiOjV9.oegupTj4bIyTjBzN-X0e-bEbl51L4SbBADgkHcToldI','2025-12-12 09:42:13.572397','2025-12-19 09:42:13.000000',NULL,'636d28272a374308ad6257bfd65f25ef'),
	(79,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE0MTYwNSwiaWF0IjoxNzY1NTM2ODA1LCJqdGkiOiJiN2QwMTFiMzFkNTM0NzMyODQyNzU4NDNjNTQzZjNlNSIsInVzZXJfaWQiOjJ9.i8SJy036RIjfqJDrAhLF6jnqZSL_3m_oM_bEgEy6Uw4','2025-12-12 10:53:25.839148','2025-12-19 10:53:25.000000',NULL,'b7d011b31d53473284275843c543f3e5'),
	(80,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE1MzAxMSwiaWF0IjoxNzY1NTQ4MjExLCJqdGkiOiI3MDMxODIxODk0ODY0MmFjOTJkOWMzM2M2MThhZDEyOSIsInVzZXJfaWQiOjJ9.KVhIA4to5wZF2eROGJxs0Ko6TjBNK0rYdwgfQuTFaVY','2025-12-12 14:03:31.718459','2025-12-19 14:03:31.000000',NULL,'70318218948642ac92d9c33c618ad129'),
	(81,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE1MzA3NCwiaWF0IjoxNzY1NTQ4Mjc0LCJqdGkiOiJkYjNkM2JkNzZjM2E0Y2Q2ODliOGQ2MjMwNTYxZjg5ZiIsInVzZXJfaWQiOjJ9.LBw2eKnfWs2FuAbTZ89dv6FiU-rLg-PUC3kdDGnP7Gk','2025-12-12 14:04:34.870492','2025-12-19 14:04:34.000000',NULL,'db3d3bd76c3a4cd689b8d6230561f89f'),
	(82,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE1MzY2NywiaWF0IjoxNzY1NTQ4ODY3LCJqdGkiOiJiMDUzMGY4ZWQzZDE0N2IxODJkZjI3ZjFmYzY2N2JiNiIsInVzZXJfaWQiOjV9.2xVDt6WTyIBuPBsyPP549Kspw0hkGMxcp_B8KfjJT3M','2025-12-12 14:14:27.080276','2025-12-19 14:14:27.000000',NULL,'b0530f8ed3d147b182df27f1fc667bb6'),
	(83,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE4MzI3OSwiaWF0IjoxNzY1NTc4NDc5LCJqdGkiOiJkNjNkMjYxYjg0ZTQ0Zjc4YmI2NTRmYTU5ZjQ0NzE2OSIsInVzZXJfaWQiOjV9.ze84IxYZZ3z3l-SHOEUbZqR8b6tS5adylcjjZjRor0w','2025-12-12 22:27:59.112481','2025-12-19 22:27:59.000000',NULL,'d63d261b84e44f78bb654fa59f447169'),
	(84,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE4MzU0MiwiaWF0IjoxNzY1NTc4NzQyLCJqdGkiOiIwZDQ4MWI1YWJjYjA0OGFlODNhY2JlNzZkNGQ5ZTQ1ZCIsInVzZXJfaWQiOjV9.cBTusMaUEqnHYXxJRjIEtNayGNbz6SjW_ZIre1fZ30Q','2025-12-12 22:32:22.667928','2025-12-19 22:32:22.000000',NULL,'0d481b5abcb048ae83acbe76d4d9e45d'),
	(85,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE4NDIwMiwiaWF0IjoxNzY1NTc5NDAyLCJqdGkiOiI0ZTJjZmI1NjA3MjU0MjkwOTE4MTE2YzZhNjljZWQxYyIsInVzZXJfaWQiOjV9.CEPwAAGao_qD5KWqAYsdTTTbF1TqdasGxGfbbg4zT_k','2025-12-12 22:43:22.343311','2025-12-19 22:43:22.000000',NULL,'4e2cfb5607254290918116c6a69ced1c'),
	(86,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE4NDY2MSwiaWF0IjoxNzY1NTc5ODYxLCJqdGkiOiI3NTQ4MmMzYTk4NDM0NWM0YjYyNTM3NWZjODljNDNhYiIsInVzZXJfaWQiOjV9.5jzm2DQor1Si1-tUfnevPyuWX1806fSXyml2c6ota80','2025-12-12 22:51:01.481816','2025-12-19 22:51:01.000000',NULL,'75482c3a984345c4b625375fc89c43ab'),
	(87,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjE4NTAwOCwiaWF0IjoxNzY1NTgwMjA4LCJqdGkiOiJiNWZlMzBiZDExNTk0N2JmOTEyMjBkMWM1NGI2NDcwZCIsInVzZXJfaWQiOjV9.2TSoyIOd2g2a8xFW1OX1eBjY9_7N8JbJT4N1OJvMRFs','2025-12-12 22:56:48.297977','2025-12-19 22:56:48.000000',NULL,'b5fe30bd115947bf91220d1c54b6470d'),
	(88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjI0NjMzMSwiaWF0IjoxNzY1NjQxNTMxLCJqdGkiOiJiMTNjNDY4NGFiYTA0Y2Q1ODM3OWFiNjJmMjU1NTlmMiIsInVzZXJfaWQiOjV9.ZnLKBeItlDy2pINL00bGLKlNOdTDnr1-pxMzgOCmC0Y','2025-12-13 15:58:51.956896','2025-12-20 15:58:51.000000',NULL,'b13c4684aba04cd58379ab62f25559f2'),
	(89,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjI0NjQ1OCwiaWF0IjoxNzY1NjQxNjU4LCJqdGkiOiIxNDVkNzFhZWE5MTY0NzE4YTVhMzc3MWFkZjY1YTFiZSIsInVzZXJfaWQiOjJ9.UYiTjFtxApJ-uYMgF8xe2VAhMro0aOAVc29Yq-FVfa8','2025-12-13 16:00:58.261249','2025-12-20 16:00:58.000000',NULL,'145d71aea9164718a5a3771adf65a1be'),
	(90,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMTMwNywiaWF0IjoxNzY1Njk2NTA3LCJqdGkiOiJlMzRmNTc5YzM3OTE0Y2MwYmU2OGUwMmE2MGFmMWEzNSIsInVzZXJfaWQiOjV9.S12qK81JwBgwttiHdIt2r1ytdDJxMzETwTsFZzFBtlg','2025-12-14 07:15:07.983826','2025-12-21 07:15:07.000000',NULL,'e34f579c37914cc0be68e02a60af1a35'),
	(91,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMjA0OCwiaWF0IjoxNzY1Njk3MjQ4LCJqdGkiOiJmN2VkMTFlZDQ0OTg0N2UxYjZjNWQ3ZmZjNWI4ZTU2MSIsInVzZXJfaWQiOjV9.TBPKaLhWSGrLmi43-Cc99Hn8HalPLd7lglu_itrl15g','2025-12-14 07:27:28.225422','2025-12-21 07:27:28.000000',NULL,'f7ed11ed449847e1b6c5d7ffc5b8e561'),
	(92,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMjIyOSwiaWF0IjoxNzY1Njk3NDI5LCJqdGkiOiI5MTBiNTRmZjBmYjI0MGZjYTFmMjg5NGJlNjBhMjMyMSIsInVzZXJfaWQiOjV9.9vuKiEVgord45MoY5GxXD92u9qKdBXlmz3ZgJzWJHw4','2025-12-14 07:30:29.799379','2025-12-21 07:30:29.000000',NULL,'910b54ff0fb240fca1f2894be60a2321'),
	(93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMjQ5NCwiaWF0IjoxNzY1Njk3Njk0LCJqdGkiOiJmN2NhNzBlM2I4MmU0MThkYTMwZjY2OTJjNDRlNGVhOCIsInVzZXJfaWQiOjJ9.vh8RVbVE6jDHT4iEAX7bu48NBS8bIYQzPD-saJz_N8g','2025-12-14 07:34:54.267735','2025-12-21 07:34:54.000000',NULL,'f7ca70e3b82e418da30f6692c44e4ea8'),
	(94,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMjY1OSwiaWF0IjoxNzY1Njk3ODU5LCJqdGkiOiJlNDQwOGJlOTAzNjQ0OWNmYTRhMWQ1NWY1ZmYxMDY3MSIsInVzZXJfaWQiOjd9.s2bZNlHsEk6idE4DIfpnAkkozHdoJGCOqoXMYBQOo0U','2025-12-14 07:37:39.312759','2025-12-21 07:37:39.000000',NULL,'e4408be9036449cfa4a1d55f5ff10671'),
	(95,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMjgwMSwiaWF0IjoxNzY1Njk4MDAxLCJqdGkiOiI0OWNmMTYwZGNiM2M0YmZlYmRkYzAwYTQ2NmU1Y2M1NiIsInVzZXJfaWQiOjV9.76qm6iTQ6o28MSZ-3T6k9fyRMD04nENEW0TJ0Cegv2Y','2025-12-14 07:40:01.351461','2025-12-21 07:40:01.000000',NULL,'49cf160dcb3c4bfebddc00a466e5cc56'),
	(96,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMzA2MywiaWF0IjoxNzY1Njk4MjYzLCJqdGkiOiJlMTNiODdjNGMyNTQ0MjNmOGRmN2M3ZDQzNzAwMzY4OCIsInVzZXJfaWQiOjJ9.vnVGvttCi8S91nJreF2SDKTQRMCzorUSP2LHdwGtTwE','2025-12-14 07:44:23.557524','2025-12-21 07:44:23.000000',NULL,'e13b87c4c254423f8df7c7d437003688'),
	(97,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMzA2OSwiaWF0IjoxNzY1Njk4MjY5LCJqdGkiOiJmYjAxZjA0NzZiZTA0ODdjYWZkMmRmYTVkZGU4YTY3YSIsInVzZXJfaWQiOjV9.rUJdviO5Oaqn_B4qSWMUd-iA9J3x-fzxoFHQ2BhCecg','2025-12-14 07:44:29.132129','2025-12-21 07:44:29.000000',NULL,'fb01f0476be0487cafd2dfa5dde8a67a'),
	(98,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMwMzIxNiwiaWF0IjoxNzY1Njk4NDE2LCJqdGkiOiIyNWU2Y2Y0M2JlZTQ0MzI1OWQyYjc4NTgwZGNlNDAxZCIsInVzZXJfaWQiOjJ9.hXdbBJsBT7gf-vipUuM6x9gDidnrKiMDJMiA4e3iLMk','2025-12-14 07:46:56.830597','2025-12-21 07:46:56.000000',NULL,'25e6cf43bee443259d2b78580dce401d'),
	(99,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjMxODQxMCwiaWF0IjoxNzY1NzEzNjEwLCJqdGkiOiJiNWVlMjNkZjI3MjY0NjQwYjVlMjVjNzVhZTdkNmRlZSIsInVzZXJfaWQiOjV9.eemXFtcsDCOjWujRXOExDTMY0O2nfJbsswS0Dco3OU8','2025-12-14 12:00:10.199898','2025-12-21 12:00:10.000000',NULL,'b5ee23df27264640b5e25c75ae7d6dee'),
	(100,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc1NDY4MywiaWF0IjoxNzY2MTQ5ODgzLCJqdGkiOiJmMjYxMGVlN2I1NjY0ZWU0YTNiOGI0NTM3NjFkYTFiYyIsInVzZXJfaWQiOjV9.lLw5aIuIyIKzaeEeXWDjPu62Y0F3qx5db-9e9MmAsFU','2025-12-19 13:11:23.804025','2025-12-26 13:11:23.000000',NULL,'f2610ee7b5664ee4a3b8b453761da1bc'),
	(101,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc1NTg0MCwiaWF0IjoxNzY2MTUxMDQwLCJqdGkiOiI2NTk4NWJhNjA5NzY0ZDAzODAzMjM1NDFiYjgyYmI4MiIsInVzZXJfaWQiOjJ9.09gkPAgUxmOnIuB2q-qUpkoyiHmc7wFfsZjfyGHfR-M','2025-12-19 13:30:40.330674','2025-12-26 13:30:40.000000',NULL,'65985ba609764d0380323541bb82bb82'),
	(102,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc1NjE2MCwiaWF0IjoxNzY2MTUxMzYwLCJqdGkiOiJmYmZlODU1Yjk3NTg0NGVhYmFlZGJlN2UxZDVkMTdkYiIsInVzZXJfaWQiOjJ9.Fb89CJykjCAkEGnwFfXjVxPaljjlxThxEwaQ3HPKpoQ','2025-12-19 13:36:00.197431','2025-12-26 13:36:00.000000',NULL,'fbfe855b975844eabaedbe7e1d5d17db'),
	(103,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NTgxMSwiaWF0IjoxNzY2MTYxMDExLCJqdGkiOiIwOWM0MTcyNmVmZGY0MzQyOGM5MWFlNjRiMGFjOTI0MiIsInVzZXJfaWQiOjV9.FNJKa_zcEUPHtAnBZy26auir8f5wpqDpH3Rck7Mgor4','2025-12-19 16:16:51.199219','2025-12-26 16:16:51.000000',NULL,'09c41726efdf43428c91ae64b0ac9242'),
	(104,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NjI1MSwiaWF0IjoxNzY2MTYxNDUxLCJqdGkiOiJjMDJmNGU1ODZlNDU0Yjk0OWU2N2NkYmRjOWJlYWM3OSIsInVzZXJfaWQiOjV9.uBH8MxL_v5gCBRbPHDLybFIvINRLAdD-aUUEkxbmQq4','2025-12-19 16:24:11.808113','2025-12-26 16:24:11.000000',NULL,'c02f4e586e454b949e67cdbdc9beac79'),
	(105,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NjQ4MywiaWF0IjoxNzY2MTYxNjgzLCJqdGkiOiI2OWE4Y2JlMThmYjE0Y2ZmYmEyZjc5NGVjN2E0ZjhhYyIsInVzZXJfaWQiOjV9.Ws23fEbtFUSnhQEbQRsu5plo4W5YNg3iAA4tJxfDcTE','2025-12-19 16:28:03.275631','2025-12-26 16:28:03.000000',NULL,'69a8cbe18fb14cffba2f794ec7a4f8ac'),
	(106,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NjY1MSwiaWF0IjoxNzY2MTYxODUxLCJqdGkiOiJjNmM4YTM1MWM0OGM0ZTlkOTdmMzAyMzE3NmU4NjIyOCIsInVzZXJfaWQiOjh9.NVJTl-Ah7XDKt-T5aHbSI7ujd-7DC5mgVc4_vM5ow8g','2025-12-19 16:30:51.647920','2025-12-26 16:30:51.000000',NULL,'c6c8a351c48c4e9d97f3023176e86228'),
	(107,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NzIyNCwiaWF0IjoxNzY2MTYyNDI0LCJqdGkiOiI5ZjZlMTVmYzY0MTY0YzBlOGJhYmY3YzY1YWFlMmNlYiIsInVzZXJfaWQiOjV9.fbTrR9s2hPIEMgnzWFkX6fMHuIOv7kZy3pJjkwyz7_s','2025-12-19 16:40:24.047612','2025-12-26 16:40:24.000000',NULL,'9f6e15fc64164c0e8babf7c65aae2ceb'),
	(108,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NzMyNSwiaWF0IjoxNzY2MTYyNTI1LCJqdGkiOiI5OTE4NDlkOGVhNGM0OWNmYmIwNzUyNDc5M2Q2OWFjNiIsInVzZXJfaWQiOjh9.gMjqld_nOn_HBDeM8LvnjOD0kTe0zzPR4I0hN41y_TU','2025-12-19 16:42:05.772145','2025-12-26 16:42:05.000000',NULL,'991849d8ea4c49cfbb07524793d69ac6'),
	(109,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NzQ2MSwiaWF0IjoxNzY2MTYyNjYxLCJqdGkiOiJmNDlmZTg5MTVkMGY0M2YzOGRiNWYyZDNmYTA2MzZmNiIsInVzZXJfaWQiOjV9.xsBvvt-hve1Kf__2tTHCN7VnfA_5ap0cDE2__jxVJ58','2025-12-19 16:44:21.046129','2025-12-26 16:44:21.000000',NULL,'f49fe8915d0f43f38db5f2d3fa0636f6'),
	(110,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc2NzQ5NSwiaWF0IjoxNzY2MTYyNjk1LCJqdGkiOiI1YTRhNDAyYjY3ODc0NzAwOTAwZTlkZmJlYmEyNTU4YiIsInVzZXJfaWQiOjh9.v31vcrqlmRDpSOA3twKxYEtmQY599_jlfzQFdZ7ZOGQ','2025-12-19 16:44:55.996149','2025-12-26 16:44:55.000000',NULL,'5a4a402b67874700900e9dfbeba2558b'),
	(111,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc3OTk3NiwiaWF0IjoxNzY2MTc1MTc2LCJqdGkiOiI1MWMzMTA1NjViNjY0OGUzOTRmMTAwMmQyZWI1YTFjYyIsInVzZXJfaWQiOjV9.hEsCE5AZdcFOHiAUUJ7faJESywddZOEFiNfq-nqu6JY','2025-12-19 20:12:56.302696','2025-12-26 20:12:56.000000',NULL,'51c310565b6648e394f1002d2eb5a1cc'),
	(112,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4MDIxMSwiaWF0IjoxNzY2MTc1NDExLCJqdGkiOiJmOTM5YTJiMjkzYTM0Y2Y1YmE3NjkzYTIyMWExNjM5NiIsInVzZXJfaWQiOjV9.TchMf2u5tC4u31iZH5i36q4Rp16ngABteN0b0ZIp_M0','2025-12-19 20:16:51.167223','2025-12-26 20:16:51.000000',NULL,'f939a2b293a34cf5ba7693a221a16396'),
	(113,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4NjY2MCwiaWF0IjoxNzY2MTgxODYwLCJqdGkiOiJiNmE5Y2U2OTYyNTM0MTQ4YTQ2NTYyN2RkZWVlOTM2ZSIsInVzZXJfaWQiOjV9.bVTAZ6Baa1mWpGyvGqB3KdOXexj8HVngx8dBraFbHrY','2025-12-19 22:04:20.810508','2025-12-26 22:04:20.000000',NULL,'b6a9ce6962534148a465627ddeee936e'),
	(114,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4NzMzNCwiaWF0IjoxNzY2MTgyNTM0LCJqdGkiOiI2ZjYzYWY0ZjI4ZDg0ZjljOTM5ZjQ5YjBiYTlmNDIyZiIsInVzZXJfaWQiOjl9.O3c3VSgEYOeEe26AqCnfYqpSFEGNWlYhePX4UIOrcuM','2025-12-19 22:15:34.053120','2025-12-26 22:15:34.000000',NULL,'6f63af4f28d84f9c939f49b0ba9f422f'),
	(115,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4NzM0NSwiaWF0IjoxNzY2MTgyNTQ1LCJqdGkiOiJlMTYzMjRmYTY5NjE0Y2QxYWVmZWJjMDY5NDU3ZTc0ZiIsInVzZXJfaWQiOjV9.Bapkf6hjtRUkvEdpulcRfJPb_KezbBL0cJ7qgwk-K6I','2025-12-19 22:15:45.484466','2025-12-26 22:15:45.000000',NULL,'e16324fa69614cd1aefebc069457e74f'),
	(116,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4NzQwMCwiaWF0IjoxNzY2MTgyNjAwLCJqdGkiOiJkYzFkYWZiMGE0MmM0Y2MxOTU0ZTRlZmYzM2VkOTJmMiIsInVzZXJfaWQiOjl9.CIdaV-yImbMoSFXl8xWxDry8FQEGnHUQOhaauKuJN9E','2025-12-19 22:16:40.646442','2025-12-26 22:16:40.000000',NULL,'dc1dafb0a42c4cc1954e4eff33ed92f2'),
	(117,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4NzQ3NywiaWF0IjoxNzY2MTgyNjc3LCJqdGkiOiI5ZWY3NmQ3ZGUwNmQ0NWYzYjE0MDI3MzM3YjA2MzM4MiIsInVzZXJfaWQiOjV9.2BXNHcqbNUU0iP7Z4xeExivJW7dMbs95n5V7kmYEmOw','2025-12-19 22:17:57.965793','2025-12-26 22:17:57.000000',NULL,'9ef76d7de06d45f3b14027337b063382'),
	(118,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2Njc4ODI2MywiaWF0IjoxNzY2MTgzNDYzLCJqdGkiOiJhN2ZmYzdhNDk4NGU0NGRjYmRlMDgxMjI4NjJiZTRlZCIsInVzZXJfaWQiOjl9.GpZrJWeuyyhykHmEDFkaX8zUfdAss3hK0ylX4vZl80g','2025-12-19 22:31:03.270053','2025-12-26 22:31:03.000000',NULL,'a7ffc7a4984e44dcbde08122862be4ed'),
	(119,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjgwMTc0NSwiaWF0IjoxNzY2MTk2OTQ1LCJqdGkiOiIwZTRjN2QxZGU3MmY0MjdhODQ3NmM4OWNmYzE1OTgwZCIsInVzZXJfaWQiOjV9.gMJrHaP3mDFEaFx_neH8RfZf5m0uxFprDtMsQ1Tbguo','2025-12-20 02:15:45.851944','2025-12-27 02:15:45.000000',NULL,'0e4c7d1de72f427a8476c89cfc15980d'),
	(120,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjgwMjI2NywiaWF0IjoxNzY2MTk3NDY3LCJqdGkiOiJjMjdmYmI4ZTU2M2Y0ODU5Yjg3ODQ0MDY3MjgyOWNhMyIsInVzZXJfaWQiOjEwfQ.thEFtoakXC4nqD2azdtA63IJey1ZAcrsFAif33q6Eak','2025-12-20 02:24:27.814458','2025-12-27 02:24:27.000000',NULL,'c27fbb8e563f4859b878440672829ca3'),
	(121,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzAzNTEyNiwiaWF0IjoxNzY2NDMwMzI2LCJqdGkiOiJiMjYzNzQ1MGQyMjI0ZTE5OWNiZmQ0MzQ2Zjc5NzA3NSIsInVzZXJfaWQiOjV9.6zp93x4_y-EIJNM9RvT2yYA0RT3JOIDEm6YyeHyYFEE','2025-12-22 19:05:26.792872','2025-12-29 19:05:26.000000',NULL,'b2637450d2224e199cbfd4346f797075'),
	(122,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzAzNTU0NSwiaWF0IjoxNzY2NDMwNzQ1LCJqdGkiOiI0NjEwYmRiN2NmNzg0YjVlYjc3NDE3ZTg1MTBhMTkzNCIsInVzZXJfaWQiOjV9.dpdLcEVLwtWlgNxcPP5jKQuNHZUk9Q9W2rg5SfbTzi8','2025-12-22 19:12:25.509876','2025-12-29 19:12:25.000000',NULL,'4610bdb7cf784b5eb77417e8510a1934'),
	(123,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzAzNjQzNywiaWF0IjoxNzY2NDMxNjM3LCJqdGkiOiJlNDZjNTg3Zjc3OTU0ZDA4YjA1ZTE4OTlmMTg5NjkxNiIsInVzZXJfaWQiOjV9.FVZVNczI9cpU1L6eoeFaYkQcKyzJHIkfkf1KNS66u6o','2025-12-22 19:27:17.314143','2025-12-29 19:27:17.000000',NULL,'e46c587f77954d08b05e1899f1896916'),
	(124,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA3NzkxOSwiaWF0IjoxNzY2NDczMTE5LCJqdGkiOiI0Y2M3YzdjY2RlZTc0MjNhYjdmODJmM2Y3NjgyM2RjNiIsInVzZXJfaWQiOjV9.f1YLPlqalrYYkX6oK_25_Nx50gWI9lhrditpq5TJhow','2025-12-23 06:58:39.668334','2025-12-30 06:58:39.000000',NULL,'4cc7c7ccdee7423ab7f82f3f76823dc6'),
	(125,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MTYxOCwiaWF0IjoxNzY2NDg2ODE4LCJqdGkiOiI3NTE2MGJlNDE3NWQ0M2I3OWE1YjU2MGIzN2U5MmViNCIsInVzZXJfaWQiOjV9.4hAoZgZZxQxusy-IsWh7LZCivbuuI3Mkoin3lL2-UeU','2025-12-23 10:46:58.427367','2025-12-30 10:46:58.000000',NULL,'75160be4175d43b79a5b560b37e92eb4'),
	(126,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MjIyNCwiaWF0IjoxNzY2NDg3NDI0LCJqdGkiOiJlMzQyYTQ4OGRkOWQ0MGI3YTljNzY4NDAzMmJiZjZmZCIsInVzZXJfaWQiOjV9.6D1Ffu2QwHYTYx_o7obpBkwVERG0a-qmrXxSfUci-5Q','2025-12-23 10:57:04.771982','2025-12-30 10:57:04.000000',NULL,'e342a488dd9d40b7a9c7684032bbf6fd'),
	(127,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MjI0NywiaWF0IjoxNzY2NDg3NDQ3LCJqdGkiOiI1NDFmYWI4MzgxZmQ0Y2I1YTU2ZDYxOTgxMzU4MzAxMSIsInVzZXJfaWQiOjl9.SXTYbOO7pdTJhbrkZG2Xf9-y-pfRlZGREPDBpKp6TKg','2025-12-23 10:57:27.075631','2025-12-30 10:57:27.000000',NULL,'541fab8381fd4cb5a56d619813583011'),
	(128,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MjI1NiwiaWF0IjoxNzY2NDg3NDU2LCJqdGkiOiIwZTQwYWNjN2E0M2M0MTU2ODc2OWQ3ODNkODhhNWFhZiIsInVzZXJfaWQiOjV9.U_mgPRrUHxRlOlNlP88Iqyq6IzCjN2a10zAvygqyKVk','2025-12-23 10:57:36.256470','2025-12-30 10:57:36.000000',NULL,'0e40acc7a43c41568769d783d88a5aaf'),
	(129,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MjI3NywiaWF0IjoxNzY2NDg3NDc3LCJqdGkiOiI2MzhlNDMxZmQyZjc0Mzc5YWIzZWYyNzM2YzlmMWNiYiIsInVzZXJfaWQiOjl9.cIBGuGc3YDXghUZOFCoT9JL1aPd3TDQLrU9Y6KyUhCg','2025-12-23 10:57:57.527608','2025-12-30 10:57:57.000000',NULL,'638e431fd2f74379ab3ef2736c9f1cbb'),
	(130,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MjM4OSwiaWF0IjoxNzY2NDg3NTg5LCJqdGkiOiJlZGJlNDA5OGYwNzA0NGMwYjAwZWE4NGRhMDQ1ODI3ZCIsInVzZXJfaWQiOjV9.-JejftENKCMTvIWCN1pSpR4MPITeMlGrdw6D0KOJNoQ','2025-12-23 10:59:49.128159','2025-12-30 10:59:49.000000',NULL,'edbe4098f07044c0b00ea84da045827d'),
	(131,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5MzQ3NywiaWF0IjoxNzY2NDg4Njc3LCJqdGkiOiJlMTY4ODIzMzE4YzM0MjZjOWMzY2FmYzAzYTgyNDU0NiIsInVzZXJfaWQiOjl9.1vqps0BApkF3VKBnDeCCIEGeic2bNrLGqb73Pu3RfvI','2025-12-23 11:17:57.343816','2025-12-30 11:17:57.000000',NULL,'e168823318c3426c9c3cafc03a824546'),
	(132,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5Mzk5NiwiaWF0IjoxNzY2NDg5MTk2LCJqdGkiOiI2ZTlkNDU4M2U2NTc0ZmY3YjQ3ZjA0Y2JjNTZlMDY5NyIsInVzZXJfaWQiOjl9.f7OyNs9AwqMPORI_b9o8Czwe9xcMKBMUgEuICVybcqU','2025-12-23 11:26:36.986901','2025-12-30 11:26:36.000000',NULL,'6e9d4583e6574ff7b47f04cbc56e0697'),
	(133,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzA5NDAyOSwiaWF0IjoxNzY2NDg5MjI5LCJqdGkiOiIxMDkyNzI0OWUyZDM0NDIzOWNlY2Q3NWU1NjcxZGNkMSIsInVzZXJfaWQiOjV9.f8s4xcNEr4kPgeSFAiYtFr2NQaed1DSe_QHimQXy2-I','2025-12-23 11:27:09.975909','2025-12-30 11:27:09.000000',NULL,'10927249e2d344239cecd75e5671dcd1'),
	(134,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzMTkyNywiaWF0IjoxNzY2NTI3MTI3LCJqdGkiOiI5MGIzZDBhODU4NTY0YzE5OGM0NzJiY2YyMDE0YjlmZiIsInVzZXJfaWQiOjV9.UbbfCckBZay_ebvSJtVwkRAMttTlzyVJY4E71C-YL9A','2025-12-23 21:58:47.944120','2025-12-30 21:58:47.000000',NULL,'90b3d0a858564c198c472bcf2014b9ff'),
	(135,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzMjY0MSwiaWF0IjoxNzY2NTI3ODQxLCJqdGkiOiJlYzRlNGJhOWFkNmY0ZTk2YWQxZGMzNWQ0Mjg5MzlhYiIsInVzZXJfaWQiOjV9.Oe-hc3_-yYz181lHV6EJd8bZeAeJQ3_JFiFl8sjGF4I','2025-12-23 22:10:41.617045','2025-12-30 22:10:41.000000',NULL,'ec4e4ba9ad6f4e96ad1dc35d428939ab'),
	(136,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzMjk5NSwiaWF0IjoxNzY2NTI4MTk1LCJqdGkiOiIzMjhjNDE3MmM4MTE0ZGI1YTEyYmQyOTMzMWQ0NGI4OSIsInVzZXJfaWQiOjE0fQ.LbCYRcz_zVAIPQGIvtSGjXNOKkgm2wrLNmMuGnFC1QA','2025-12-23 22:16:35.176986','2025-12-30 22:16:35.000000',NULL,'328c4172c8114db5a12bd29331d44b89'),
	(137,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzMzQzNiwiaWF0IjoxNzY2NTI4NjM2LCJqdGkiOiI0N2Y0OTg0OWVhODU0YmIxODE1ZWQ4ZWM1NzAxM2RiNSIsInVzZXJfaWQiOjE0fQ.GSE_ULRrZFKgjEK_AKWpHZ62K7gUD6fFF7JTQx-t9_Q','2025-12-23 22:23:56.939205','2025-12-30 22:23:56.000000',NULL,'47f49849ea854bb1815ed8ec57013db5'),
	(138,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzMzg3NiwiaWF0IjoxNzY2NTI5MDc2LCJqdGkiOiIwNjM1ZDdkM2Y2MWM0ZWJjYjUxYzM1ZWJlMDJmNzY5ZiIsInVzZXJfaWQiOjE0fQ.d4A7F4BSOa-uopaPmy7g38Tl4IxGoAHxn-828eo1iHc','2025-12-23 22:31:16.273909','2025-12-30 22:31:16.000000',NULL,'0635d7d3f61c4ebcb51c35ebe02f769f'),
	(139,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNDQ3MiwiaWF0IjoxNzY2NTI5NjcyLCJqdGkiOiI1NGFjYmFiNWZlYWE0NDU4OTg5MWMxOGVmYzA5Y2E4YyIsInVzZXJfaWQiOjV9.-K8C4VonG_CYVqWWsqlJW1NbjDni_BFc-WzlNLrozs8','2025-12-23 22:41:12.670385','2025-12-30 22:41:12.000000',NULL,'54acbab5feaa44589891c18efc09ca8c'),
	(140,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNDQ3NCwiaWF0IjoxNzY2NTI5Njc0LCJqdGkiOiJjMTlhNWRhMDExYWU0MGFmYWQ5ZWY5NzRkYzhkYjdjOCIsInVzZXJfaWQiOjV9.tgjxw8-2DcQc0hZB1AJ4XKCD5_GE7peXqeCUpfTRgEE','2025-12-23 22:41:14.137334','2025-12-30 22:41:14.000000',NULL,'c19a5da011ae40afad9ef974dc8db7c8'),
	(141,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNDczNCwiaWF0IjoxNzY2NTI5OTM0LCJqdGkiOiIxOTNjOWU0MTA4YWM0YTIyODEyNzJhMzk0YTgyMzg1NyIsInVzZXJfaWQiOjEzfQ.ptvRoiJfnS8GKTAg3enkvmX-Tzo_uTdYxmEvPoQxqpY','2025-12-23 22:45:34.442177','2025-12-30 22:45:34.000000',NULL,'193c9e4108ac4a2281272a394a823857'),
	(142,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNTQyNSwiaWF0IjoxNzY2NTMwNjI1LCJqdGkiOiI0MThhNWI5NWMxNDM0ZGMyYTEzYWYwNmE2ZWJjMmFhNCIsInVzZXJfaWQiOjEzfQ.xddGn0zwl93lpguNe6H6m4br3AP1NUeW36XswpjUx1o','2025-12-23 22:57:05.986797','2025-12-30 22:57:05.000000',NULL,'418a5b95c1434dc2a13af06a6ebc2aa4'),
	(143,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNTg4MSwiaWF0IjoxNzY2NTMxMDgxLCJqdGkiOiJmNjgxNDJlZjE5YzA0NDg5YTFhMmRhZjBjYjBkMzRhNyIsInVzZXJfaWQiOjE0fQ.MxFN1sr66IYnM1e3FmthoWRH-wnPKYCnmbxcwmNcmN4','2025-12-23 23:04:41.644191','2025-12-30 23:04:41.000000',NULL,'f68142ef19c04489a1a2daf0cb0d34a7'),
	(144,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNjI2MywiaWF0IjoxNzY2NTMxNDYzLCJqdGkiOiJlMjk2NjAzNGRmMzg0MDUyYjdmMmZlM2UxYzUwOWJhMyIsInVzZXJfaWQiOjV9.lzNUPeP9xkikWEIFzjh5Yrcf3udVpbfTfrSlwzQVjz0','2025-12-23 23:11:03.011288','2025-12-30 23:11:03.000000',NULL,'e2966034df384052b7f2fe3e1c509ba3'),
	(145,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNjM5NywiaWF0IjoxNzY2NTMxNTk3LCJqdGkiOiJlOTVkODBhYzY4MWU0ZTJjYTYxZGVjYjRjMDc4MTljMSIsInVzZXJfaWQiOjE0fQ.zaQZzU2f8nPvZCRqiJkQxqNsslIMJlQAI6l-FU16WFY','2025-12-23 23:13:17.390457','2025-12-30 23:13:17.000000',NULL,'e95d80ac681e4e2ca61decb4c07819c1'),
	(146,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNjQ0MCwiaWF0IjoxNzY2NTMxNjQwLCJqdGkiOiI3N2YzYWQ5NTI5Yjk0NjM0OGNjN2Y2YjJiY2NkNmMxMSIsInVzZXJfaWQiOjV9.trKG-P5C-7bNixybHSQpUY87Ejlq-4hFofo62gYO6XA','2025-12-23 23:14:00.082503','2025-12-30 23:14:00.000000',NULL,'77f3ad9529b946348cc7f6b2bccd6c11'),
	(147,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNjQ3MCwiaWF0IjoxNzY2NTMxNjcwLCJqdGkiOiIwZjdmMmQ4ZGUzZWQ0Mzk1YmZiMzlmYWFmNDhhMzZjMSIsInVzZXJfaWQiOjE0fQ.I7rUIOo__HP9sQeIl1aQyIRNTpnWYj_fnFUx4mQwVNU','2025-12-23 23:14:30.930612','2025-12-30 23:14:30.000000',NULL,'0f7f2d8de3ed4395bfb39faaf48a36c1'),
	(148,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNjk1NSwiaWF0IjoxNzY2NTMyMTU1LCJqdGkiOiIyYmMwNWRhMGZmMjc0NGY4YTFkMjkwNGJjN2Q4YWMyNyIsInVzZXJfaWQiOjV9.9ku8-DqmYPIz9OKCCipo-ZlbaCHYgRoS2p7Fg5D0TrQ','2025-12-23 23:22:35.423386','2025-12-30 23:22:35.000000',NULL,'2bc05da0ff2744f8a1d2904bc7d8ac27'),
	(149,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNzAwOCwiaWF0IjoxNzY2NTMyMjA4LCJqdGkiOiJhY2ZkZjEyYmUwNTk0NzQ2OTc3MmRhYWI4MTNiOWI4ZSIsInVzZXJfaWQiOjEzfQ.9b2zehPB_vZqQ2Ua_mrwq3GSkd7Sax0yO0vZIzjTTZw','2025-12-23 23:23:28.396508','2025-12-30 23:23:28.000000',NULL,'acfdf12be05947469772daab813b9b8e'),
	(150,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNzA5MiwiaWF0IjoxNzY2NTMyMjkyLCJqdGkiOiIyNjM5YWViOWQ4YTM0NzQ1ODliMGQzM2M1NDE0MmNkYyIsInVzZXJfaWQiOjV9.eHn4gJhEE-4ospRD3RmUu4QRdXlBlmxjNcH42WDgbgg','2025-12-23 23:24:52.556246','2025-12-30 23:24:52.000000',NULL,'2639aeb9d8a3474589b0d33c54142cdc'),
	(151,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzNzc3NywiaWF0IjoxNzY2NTMyOTc3LCJqdGkiOiIzZjg4MDRlODcyOTM0YTQxYWU2NTU4MTQyMDgyYjM5NCIsInVzZXJfaWQiOjE0fQ.32S3t6XvNsImBoB5fZVuFgJj2clJkTkyBhRgHm6w1RE','2025-12-23 23:36:17.423694','2025-12-30 23:36:17.000000',NULL,'3f8804e872934a41ae6558142082b394'),
	(152,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzODAyNCwiaWF0IjoxNzY2NTMzMjI0LCJqdGkiOiI3OWI2YTVlNDJjZDM0ZTQxYmIwMjliODY1NjZjNmYxYyIsInVzZXJfaWQiOjV9.t43FHtBi5lhVcOvQAa8BtBuiahCTqJX7L9AhDippWuw','2025-12-23 23:40:24.928711','2025-12-30 23:40:24.000000',NULL,'79b6a5e42cd34e41bb029b86566c6f1c'),
	(153,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzODQwNSwiaWF0IjoxNzY2NTMzNjA1LCJqdGkiOiIzZWNmMTY3ZjllOTI0NTI2ODY5Nzc4ZWMzZjk0NDAwNCIsInVzZXJfaWQiOjV9.DDXuVSy2ZQTdei64MCDOAkdUW_hL3UX1UoGIrajp6WE','2025-12-23 23:46:45.810184','2025-12-30 23:46:45.000000',NULL,'3ecf167f9e924526869778ec3f944004'),
	(154,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzOTAxNiwiaWF0IjoxNzY2NTM0MjE2LCJqdGkiOiI1NDZiZjhkNWU1MTc0MWQ5YjM5YTgyYTQ4ZWI0MDJiNiIsInVzZXJfaWQiOjEzfQ.DjwmRGPcILCvQvHNv5D8jsIB9OCtGPN0X9KBtTEK0hg','2025-12-23 23:56:56.799520','2025-12-30 23:56:56.000000',NULL,'546bf8d5e51741d9b39a82a48eb402b6'),
	(155,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzOTE3NCwiaWF0IjoxNzY2NTM0Mzc0LCJqdGkiOiJjNDQ4ZGViZjZlN2Q0ZGY3ODcyNWZiYjg2MjM2NzFkOCIsInVzZXJfaWQiOjEzfQ.csyX6SomGxqDfY93uEFkIPZvUda6futl4qb8oso5lGU','2025-12-23 23:59:34.193536','2025-12-30 23:59:34.000000',NULL,'c448debf6e7d4df78725fbb8623671d8'),
	(156,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzOTU3MywiaWF0IjoxNzY2NTM0NzczLCJqdGkiOiI5MjI1YTZiNTU1NzI0ODg5YTRlMDM2NzEyMmY2NWVkMCIsInVzZXJfaWQiOjEzfQ.KnCzmC6oWCOrRJz75XbHCSdUXGBIt5A8WlDoCN8mcOo','2025-12-24 00:06:13.293479','2025-12-31 00:06:13.000000',NULL,'9225a6b555724889a4e0367122f65ed0'),
	(157,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzOTc1MiwiaWF0IjoxNzY2NTM0OTUyLCJqdGkiOiI5ZTZlZGVlODAxODY0NjYwOTJmMjE0YTc3YmRjMjIyMiIsInVzZXJfaWQiOjEzfQ.-PQY_SbROr8HFeiVtfDBR3SMeoQb-rv9wBxeKrtdDS4','2025-12-24 00:09:12.742809','2025-12-31 00:09:12.000000',NULL,'9e6edee80186466092f214a77bdc2222'),
	(158,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzEzOTg5NCwiaWF0IjoxNzY2NTM1MDk0LCJqdGkiOiIwZmY4YWI0ZDYyMzk0NTA4YTVmNjJmNzcxMjhhNzg3MCIsInVzZXJfaWQiOjE0fQ.b7DR8XuW0p1I5wPOsvmgzmtXbl4zuFsTvbGFrMIygCg','2025-12-24 00:11:34.934091','2025-12-31 00:11:34.000000',NULL,'0ff8ab4d62394508a5f62f77128a7870'),
	(159,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MDA3MiwiaWF0IjoxNzY2NTM1MjcyLCJqdGkiOiI5NTEzZGUwOTYxNjM0OWI4OGEwMzg4Y2Q1MzU1OTAwNSIsInVzZXJfaWQiOjEzfQ.z8Nnrwha4yDnpifVKxEFBBBK_D6KYrLCnxhvFlaqziI','2025-12-24 00:14:32.797509','2025-12-31 00:14:32.000000',NULL,'9513de09616349b88a0388cd53559005'),
	(160,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MDMxMiwiaWF0IjoxNzY2NTM1NTEyLCJqdGkiOiI2YTIzODgxYzM3ZjM0YTQ1YTU0ZDI4ZjQzNmM2YTlhZSIsInVzZXJfaWQiOjEzfQ.4eoyB_YdpY6G7zIbUClJ_N0PyzH80ii4dlC-kcfH2zQ','2025-12-24 00:18:32.032673','2025-12-31 00:18:32.000000',NULL,'6a23881c37f34a45a54d28f436c6a9ae'),
	(161,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MTAyMywiaWF0IjoxNzY2NTM2MjIzLCJqdGkiOiIyZDNmMDE5YWM3MzM0OWE2ODUyNDBjNzg4ZGQ4NjkyMyIsInVzZXJfaWQiOjV9.FkXXxABz2eIZrv1UJdGb-Ph2XmCWEGYsbsZFKlN1iAY','2025-12-24 00:30:23.724495','2025-12-31 00:30:23.000000',NULL,'2d3f019ac73349a685240c788dd86923'),
	(162,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MTk4MiwiaWF0IjoxNzY2NTM3MTgyLCJqdGkiOiI5YTNjYjYzZDlkYTA0MDUyYWZmNjVjNGZjYjVkMjEzNCIsInVzZXJfaWQiOjE1fQ.KofDh1KX2zVmeyM4RooCHA1hCxwRVNEBld3ZIE5N8tE','2025-12-24 00:46:22.907010','2025-12-31 00:46:22.000000',NULL,'9a3cb63d9da04052aff65c4fcb5d2134'),
	(163,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MjAyMSwiaWF0IjoxNzY2NTM3MjIxLCJqdGkiOiIwZDY0NGUxOGVhY2Y0OTA3YmY1MzcyOWMzM2UwYTAzMiIsInVzZXJfaWQiOjV9.r86AmwsfHUNYUsuIo5_juKXNeGnphrz8MdypDpZclgo','2025-12-24 00:47:01.254992','2025-12-31 00:47:01.000000',NULL,'0d644e18eacf4907bf53729c33e0a032'),
	(164,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MjMwMywiaWF0IjoxNzY2NTM3NTAzLCJqdGkiOiJiMzNiYzBkNWMyNjA0NTc3ODU0MjI4NGYwYjBjOTEzNSIsInVzZXJfaWQiOjE2fQ.X_bFjSBIkjBhNR3GnVcVf8rvf3HH9NnnhmGrUs5L9xo','2025-12-24 00:51:43.470822','2025-12-31 00:51:43.000000',NULL,'b33bc0d5c26045778542284f0b0c9135'),
	(165,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MjUxMywiaWF0IjoxNzY2NTM3NzEzLCJqdGkiOiJhNWY3ZWM0ODA0ODY0MGVlOGNlOTc0YmUwZjI4OWNhOSIsInVzZXJfaWQiOjV9.x3koya7bLjEwRMSYQW5z24jyli1NfDWZnu5UaYo-sGc','2025-12-24 00:55:13.167488','2025-12-31 00:55:13.000000',NULL,'a5f7ec48048640ee8ce974be0f289ca9'),
	(166,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MjY4NiwiaWF0IjoxNzY2NTM3ODg2LCJqdGkiOiI5YjdlOGY3MGYzMzg0NzRiYTAxNjBjNTY4MGM5NWZmNiIsInVzZXJfaWQiOjE3fQ.ANloiSBVjXnvSGSuy3dJyrhrt08tI6GZu1EsG7kpbUg','2025-12-24 00:58:06.496204','2025-12-31 00:58:06.000000',NULL,'9b7e8f70f338474ba0160c5680c95ff6'),
	(167,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0MzAyMCwiaWF0IjoxNzY2NTM4MjIwLCJqdGkiOiJiYWE5NTAyYTRhNGU0MmM5OWM4YTgyNzAxNDk2MmFlNyIsInVzZXJfaWQiOjV9.gvtd4nMn2EDOLOFdSxovtpb7qdhIeSFVCsjaJ2DK_98','2025-12-24 01:03:40.021380','2025-12-31 01:03:40.000000',NULL,'baa9502a4a4e42c99c8a827014962ae7'),
	(168,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NDA3NiwiaWF0IjoxNzY2NTM5Mjc2LCJqdGkiOiI4N2VhMWJmYzFkZWM0MjA3YjFjNTRjMmQ5ZjEwODNiYiIsInVzZXJfaWQiOjE4fQ.tVy2-XLUhOC8JL74spgofJqj_8Cq4v8-CHbROdKK9mw','2025-12-24 01:21:16.071482','2025-12-31 01:21:16.000000',18,'87ea1bfc1dec4207b1c54c2d9f1083bb'),
	(169,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NDU1MSwiaWF0IjoxNzY2NTM5NzUxLCJqdGkiOiI1NTA3ODEyNGFkNGM0OTRmYjNkNzY2MmYzNDk1ZGU3MSIsInVzZXJfaWQiOjE5fQ.JrpidJZPIoE-SmKurHP2wghqYMOJEx-Ra85ErdR9q8o','2025-12-24 01:29:11.915462','2025-12-31 01:29:11.000000',NULL,'55078124ad4c494fb3d7662f3495de71'),
	(170,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NDc5MSwiaWF0IjoxNzY2NTM5OTkxLCJqdGkiOiI2ZmFhNzA5ZjMwMTM0ZmMwOGE5ZmU0ZWY1ZWZjMDc3NCIsInVzZXJfaWQiOjE4fQ.QSs5QOlWTWhqx5RZ4gjwT8VdZzO-h2Bi5Bmz9CspqyE','2025-12-24 01:33:11.104139','2025-12-31 01:33:11.000000',18,'6faa709f30134fc08a9fe4ef5efc0774'),
	(171,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NDgxMiwiaWF0IjoxNzY2NTQwMDEyLCJqdGkiOiI0MTBmYmU5YjMwZGE0NDQzYjNmYThhMDgzZGY0ZjU1NyIsInVzZXJfaWQiOjE5fQ.DBMhs5-0bzdFN0LNHfV1HN7hiOw_d9AuBR_P6iz6-SQ','2025-12-24 01:33:32.267846','2025-12-31 01:33:32.000000',NULL,'410fbe9b30da4443b3fa8a083df4f557'),
	(172,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NTA1MSwiaWF0IjoxNzY2NTQwMjUxLCJqdGkiOiJlMzQwN2ViNjE4ZTg0NDZmYTEzYjAwYTQzZDIxMjAxYiIsInVzZXJfaWQiOjE5fQ.bvi4rvKyos03RmdiK-KB_j6R8_284dgva18yopuIGZk','2025-12-24 01:37:31.534719','2025-12-31 01:37:31.000000',NULL,'e3407eb618e8446fa13b00a43d21201b'),
	(173,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NTA2NSwiaWF0IjoxNzY2NTQwMjY1LCJqdGkiOiI5OWVlN2VkMGU4Y2E0NGU5OGQ4YTM2NjI1MTYxMWM1OCIsInVzZXJfaWQiOjE4fQ.sw7FbdQ4FC3ruhy_pZ5jWHOF5HI9Nqnp_Spyw8xwoKw','2025-12-24 01:37:45.181895','2025-12-31 01:37:45.000000',18,'99ee7ed0e8ca44e98d8a366251611c58'),
	(174,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NzQwOCwiaWF0IjoxNzY2NTQyNjA4LCJqdGkiOiI0ODlkNzJhNjViNDY0ODg2YTRhODQyZmE4MGRjMGZiZSIsInVzZXJfaWQiOjE4fQ.dgiuDaP5fGTz3J2dvP_hVJz7ktpAQiVPUE9-ArjR6C4','2025-12-24 02:16:48.077424','2025-12-31 02:16:48.000000',18,'489d72a65b464886a4a842fa80dc0fbe'),
	(175,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE0NzcxNCwiaWF0IjoxNzY2NTQyOTE0LCJqdGkiOiI5NzcyZDBjMTBhYzg0MGZkOWU4YmNlZWJmYTE4Nzc0YSIsInVzZXJfaWQiOjIwfQ.UNHApi-YNU7D5xOd1RT50m9meWJQaUAPwnqQm1NBjz0','2025-12-24 02:21:54.328617','2025-12-31 02:21:54.000000',NULL,'9772d0c10ac840fd9e8bceebfa18774a'),
	(176,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MDA3MSwiaWF0IjoxNzY2NTQ1MjcxLCJqdGkiOiI0MmIxY2Y4MWU1ZDc0MWNjYTcxMmE1NjU3ZjEyM2IzMCIsInVzZXJfaWQiOjIwfQ.aYSNW4zuxM5XForhNT1ISOAeTsCXhCnLV0aVev5pkGA','2025-12-24 03:01:11.668211','2025-12-31 03:01:11.000000',NULL,'42b1cf81e5d741cca712a5657f123b30'),
	(177,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MDE0MCwiaWF0IjoxNzY2NTQ1MzQwLCJqdGkiOiJlNTZjYTA4ZDlmODk0MmY1YjY1MWJlNTExMDJjNmJmYiIsInVzZXJfaWQiOjE4fQ.-jeDKfG4v21jMbblzUOUJHxomAuZ4V8xNiSD5bLAO-s','2025-12-24 03:02:20.916937','2025-12-31 03:02:20.000000',18,'e56ca08d9f8942f5b651be51102c6bfb'),
	(178,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MDQ2OCwiaWF0IjoxNzY2NTQ1NjY4LCJqdGkiOiJhZjJmYmQ0YWU4YTQ0NDI5YWRjNzRjY2FlYTU1MmEwNiIsInVzZXJfaWQiOjIyfQ.DlLdWOB1vpwCADHO0yI2OS2SSrdSdLRZrAcULkkrzZ8','2025-12-24 03:07:48.826313','2025-12-31 03:07:48.000000',22,'af2fbd4ae8a44429adc74ccaea552a06'),
	(179,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MDk4MSwiaWF0IjoxNzY2NTQ2MTgxLCJqdGkiOiI4MmI5YWZjZTE4MmY0ODBkYTVmOWEzM2IwMDA0MDZkMSIsInVzZXJfaWQiOjE4fQ.vELqoZCmj3q6KDkfUd8iw0roEVBVfN5kynrSHz7uDlQ','2025-12-24 03:16:21.977230','2025-12-31 03:16:21.000000',18,'82b9afce182f480da5f9a33b000406d1'),
	(180,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MTA2MiwiaWF0IjoxNzY2NTQ2MjYyLCJqdGkiOiIxYmU3Njc2OWQwNjc0MzZiYjUzYzk3ZTM2ZjM0NmE4MCIsInVzZXJfaWQiOjIyfQ.QK3A77nMnmVx2xTs4fG1g9-1GdepFjGhy-QD49Ds36o','2025-12-24 03:17:42.728644','2025-12-31 03:17:42.000000',22,'1be76769d067436bb53c97e36f346a80'),
	(181,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MTE3OCwiaWF0IjoxNzY2NTQ2Mzc4LCJqdGkiOiIyN2UxNjVlNDNkOTE0MmY3YmNiYzhlMDM1NGY0YjcwYSIsInVzZXJfaWQiOjE4fQ.TzJ8keCHy8qYHl_Y2AgKjW7x8Msn3PXoPBxDcTE3cuI','2025-12-24 03:19:38.586196','2025-12-31 03:19:38.000000',18,'27e165e43d9142f7bcbc8e0354f4b70a'),
	(182,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MTIzOSwiaWF0IjoxNzY2NTQ2NDM5LCJqdGkiOiI3NDU4MmExNjgxZTU0Mzg0OTAzZGUyOGFiMzBhZDNkMyIsInVzZXJfaWQiOjIyfQ.hg8PKtOKonDLKWIUIrQWaUAtjIUR201TF2vA2iOQUIk','2025-12-24 03:20:39.903566','2025-12-31 03:20:39.000000',22,'74582a1681e54384903de28ab30ad3d3'),
	(183,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MTI1OSwiaWF0IjoxNzY2NTQ2NDU5LCJqdGkiOiJjZWMwNjgxZTIyNDA0YTg3YjdjNjczZDVhZmI3NjQ1ZSIsInVzZXJfaWQiOjE4fQ.2CrvchJAvTXweWT0_MPGv0VPQK7VpMSh3QyPGsswd1w','2025-12-24 03:20:59.078997','2025-12-31 03:20:59.000000',18,'cec0681e22404a87b7c673d5afb7645e'),
	(184,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MTI5NCwiaWF0IjoxNzY2NTQ2NDk0LCJqdGkiOiI0Mjg2NWVkM2JjNWU0NGZhYmRkZDY2YTg2MmNhY2QxMiIsInVzZXJfaWQiOjIyfQ.g7YWO2qRtEHD4mzx3h_w-yfdDDsTuw41MeTUSvuW-Ws','2025-12-24 03:21:34.417057','2025-12-31 03:21:34.000000',22,'42865ed3bc5e44fabddd66a862cacd12'),
	(185,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjA1NiwiaWF0IjoxNzY2NTQ3MjU2LCJqdGkiOiIxYzgwYjgxNzYwNDI0ZjIzODIyNDRiNjMwZWY4ZDg4MSIsInVzZXJfaWQiOjE4fQ.XE_pfq35GyQuPHbkc4Ac3BLoehaTgYCENZqqgUB_LcA','2025-12-24 03:34:16.944738','2025-12-31 03:34:16.000000',18,'1c80b81760424f2382244b630ef8d881'),
	(186,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjI1NiwiaWF0IjoxNzY2NTQ3NDU2LCJqdGkiOiJiMDY5Mjg4YTk3Yjk0MDZmYTNhNDFkMDllODY4Yjk0NCIsInVzZXJfaWQiOjIzfQ.uw-HYg_4-EFHoyxkfhpmTLqsBwC9OEIcwM185piE6jU','2025-12-24 03:37:36.326358','2025-12-31 03:37:36.000000',NULL,'b069288a97b9406fa3a41d09e868b944'),
	(187,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjM1MiwiaWF0IjoxNzY2NTQ3NTUyLCJqdGkiOiIzOGU5YzhjMDU1Yzg0NDRlOGFjNzlmODBlYWE0MGI4OCIsInVzZXJfaWQiOjE4fQ.yPBdQr40Loc6koh_cibxKp0N4c5pPduuTh6wSE5ivi0','2025-12-24 03:39:12.531297','2025-12-31 03:39:12.000000',18,'38e9c8c055c8444e8ac79f80eaa40b88'),
	(188,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjQ5NiwiaWF0IjoxNzY2NTQ3Njk2LCJqdGkiOiI0YWZiNTA0MmIzZjI0YTcxYWZlNDI2N2I1OTg4MWNhMyIsInVzZXJfaWQiOjE4fQ.whC3cQ4XLQdPYupsd5PCNNbhAtzADoRBPBygDVTMr5E','2025-12-24 03:41:36.106744','2025-12-31 03:41:36.000000',18,'4afb5042b3f24a71afe4267b59881ca3'),
	(189,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjU2MCwiaWF0IjoxNzY2NTQ3NzYwLCJqdGkiOiI5M2FiOTNiNmM0ZTM0NjAyYmYzMjQ4MDRhNzkwODYzYyIsInVzZXJfaWQiOjIzfQ.Q3O1zCtBFo6H3sNABVdP_xGn3d8iZ5Ftd2fY1MfkODs','2025-12-24 03:42:40.046845','2025-12-31 03:42:40.000000',NULL,'93ab93b6c4e34602bf324804a790863c'),
	(190,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1MjYwMywiaWF0IjoxNzY2NTQ3ODAzLCJqdGkiOiI3NDhlNzZlNjYyYmM0YTRmYTE2ZmRhYTM4MGIwYjg4MCIsInVzZXJfaWQiOjE4fQ.SH7lKjh4-wstaVafQnnkOZCVDaN_0WRGTkjbnAkjXv8','2025-12-24 03:43:23.812697','2025-12-31 03:43:23.000000',18,'748e76e662bc4a4fa16fdaa380b0b880'),
	(191,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzE1NDIwNSwiaWF0IjoxNzY2NTQ5NDA1LCJqdGkiOiI1NTBiOTA3ZDYzODU0NTk0ODcwNDcyN2E2YzY5ZGM4YiIsInVzZXJfaWQiOjIyfQ.tR_tH-IdtN1-4qKXw-AsOBhxatuGOKLVlH3meqZRofk','2025-12-24 04:10:05.731751','2025-12-31 04:10:05.000000',22,'550b907d638545948704727a6c69dc8b'),
	(192,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMDA2MiwiaWF0IjoxNzY2NzA1MjYyLCJqdGkiOiI0MzZkMjg1NDQ4ZDM0NjE4YmYzZjg5YTcyNjhhMTQzOSIsInVzZXJfaWQiOjIyfQ.7bYMykjioKoBIn57EjZ7i4kowUJlkXJakA6mTwoRlc0','2025-12-25 23:27:42.456011','2026-01-01 23:27:42.000000',22,'436d285448d34618bf3f89a7268a1439'),
	(193,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMDA3MiwiaWF0IjoxNzY2NzA1MjcyLCJqdGkiOiJiNDJmMGNmYzY1Y2E0NGZkYTIyZWE0OTI4OTk0MGYwNiIsInVzZXJfaWQiOjE4fQ.fH7REZSRnQ12YotY3Ch9Vxm_x2Bd5cODdlNUb1HHXDk','2025-12-25 23:27:52.743248','2026-01-01 23:27:52.000000',18,'b42f0cfc65ca44fda22ea49289940f06'),
	(194,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMDMwOCwiaWF0IjoxNzY2NzA1NTA4LCJqdGkiOiJmMDIwNmUyNTVkNDI0ZjZmODYwYzhhMTg1MGU4ZDBmOSIsInVzZXJfaWQiOjI0fQ.R44sTjCaydaj77__aNQTN608DGmnjKcKLyfw4XLD0J4','2025-12-25 23:31:48.243818','2026-01-01 23:31:48.000000',24,'f0206e255d424f6f860c8a1850e8d0f9'),
	(195,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMTc0MywiaWF0IjoxNzY2NzA2OTQzLCJqdGkiOiI1MzE0ZTc3YWFlMjk0YTFlODY3MzhhM2I0MTk0NmQ4ZiIsInVzZXJfaWQiOjE4fQ.gxk15YQbZcJD3Nb3xzXF9h9W1A9vRs3XbaUPYovn3ug','2025-12-25 23:55:43.210982','2026-01-01 23:55:43.000000',18,'5314e77aae294a1e86738a3b41946d8f'),
	(196,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMjQzMCwiaWF0IjoxNzY2NzA3NjMwLCJqdGkiOiJhOTkwODdjMmQ1MTQ0OTJmYjZlMGYwNzk1ZjM1OTk0MCIsInVzZXJfaWQiOjIyfQ.dRW9l5ZOqduKUFrd9fdu5p5oQmAhKu8bpoWJz6JDIfk','2025-12-26 00:07:10.751880','2026-01-02 00:07:10.000000',22,'a99087c2d514492fb6e0f0795f359940'),
	(197,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMjcxNywiaWF0IjoxNzY2NzA3OTE3LCJqdGkiOiIwYWNhZjY2MDJiNTA0MjIxOGE5Y2M0N2UzZWRkNjc1MSIsInVzZXJfaWQiOjE4fQ.Kss9T1v_WV4XT6u3NPrfz5mraYSbDTjjQaNC0fbj9Ak','2025-12-26 00:11:57.236272','2026-01-02 00:11:57.000000',18,'0acaf6602b5042218a9cc47e3edd6751'),
	(198,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzMxMjc3NywiaWF0IjoxNzY2NzA3OTc3LCJqdGkiOiIwZTA1NGZjNmVhNWI0YjMxYjIxMjg4OTU1NDhmM2RjNiIsInVzZXJfaWQiOjIyfQ.lTcqOHL6jUKlNIR1ovmIvxvBuYeeeznMcWsHFRk6VvU','2025-12-26 00:12:57.012567','2026-01-02 00:12:57.000000',22,'0e054fc6ea5b4b31b2128895548f3dc6');

/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_picture` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `role`, `phone_number`, `profile_picture`, `created_at`, `updated_at`)
VALUES
	(18,'pbkdf2_sha256$720000$akVaihcq6hRFtIEVEUZpzc$N/mQCD8PdUVz+Vq9QW8GW38A+54kx1ijw06OoUHLpoM=',NULL,1,'admin','','','admin@gmail.com',1,1,'2025-12-24 01:05:11.019392','admin',NULL,'','2025-12-24 01:05:11.131140','2025-12-24 01:05:11.131150'),
	(22,'pbkdf2_sha256$720000$GErb5gEuXLIeswHQWN6JL0$kR3qHRtM2ceHc289nL60P44KIjdP192I7/RHluAXC38=',NULL,0,'Cipto','Cipto','Hadi','cip@gmail.com',0,1,'2025-12-24 03:05:09.233506','penyewa','085155222792','','2025-12-24 03:05:09.348063','2025-12-24 03:05:09.348071'),
	(24,'pbkdf2_sha256$720000$1ilrM99QL3Ywr4JTtKxRPV$x/xrrkqOeJUQm5ZNo67RfY/coYSlHJIfLdOlC6jyeu4=',NULL,0,'Ghozy','Ghozy','Hernandez','ghozy@gmail.com',0,1,'2025-12-25 23:28:40.979419','penyewa','0851241231','','2025-12-25 23:28:41.098464','2025-12-25 23:28:41.098474');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_groups`;

CREATE TABLE `users_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_groups_user_id_group_id_fc7788e8_uniq` (`user_id`,`group_id`),
  KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_groups_user_id_f500bee5_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table users_user_permissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_user_permissions`;

CREATE TABLE `users_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_permissions_user_id_permission_id_3b86cbdf_uniq` (`user_id`,`permission_id`),
  KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_permissions_user_id_92473840_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
