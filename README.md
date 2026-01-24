# 🏢 Employee Management System

Aplikasi manajemen data karyawan terintegrasi. Menggunakan **React Native** (Mobile), **Node.js & Express** (Backend), dan **MySQL** (Database).

---

## 📋 Requirements
Sebelum menjalankan, pastikan perangkat sudah terinstall:
* **Node.js** (LTS) & NPM
* **XAMPP** (MySQL & Apache)
* **Java JDK 17** & **Android Studio**
* **Android Emulator** atau HP Fisik (Debug Mode ON)

---

## 🚀 Getting Started (Langkah Menjalankan)

### 1. Database & XAMPP
1. Buka **XAMPP Control Panel**.
2. Klik **Start** pada **Apache** dan **MySQL**.
3. Buka browser ke `http://localhost/phpmyadmin`.
4. Buat database baru dan import file `hrd.sql`

### 2. Jalankan Backend Server
Buka terminal baru di dalam folder backend:
```bash
cd be
npm install
npm start
3. Jalankan Mobile App (React Native)
Butuh dua terminal terpisah:

Terminal A (Metro Bundler):

Bash
cd /fe
npx react-native start
Terminal B (Run Android):

Bash
cd /fe
npx react-native run-android
⚙️ Konfigurasi Koneksi (PENTING)

Connection aplikasi dengan database, ganti URL API di kode Frontend:
Emulator Android: Gunakan IP http://10.0.2.2:PORT

HP Fisik: Gunakan IP Laptop  Contoh: http://192.168.1.5:3000

📁 Struktur Folder Proyek
Plaintext
├── frontend/           # React Native App (Mobile)
└──── backend/            # Node.js API (Server)
└────── database/           # File SQL
