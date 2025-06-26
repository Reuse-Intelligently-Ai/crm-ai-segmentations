# 🧠 CRM Cerdas: Analisis Pelanggan dengan AI

Sebuah prototipe aplikasi CRM modern yang memanfaatkan kekuatan AI generatif (Google Gemini) untuk memberikan insight mendalam tentang data pelanggan. Aplikasi ini dibangun dengan **Next.js** dan dirancang untuk menjadi alat analisis yang interaktif dan intuitif bagi tim bisnis.

> **🎥 Disarankan**: Tambahkan screenshot atau GIF singkat dari aplikasi di bagian ini.

---

## ✨ Fitur Utama

- 🤖 **Segmentasi Pelanggan Otomatis**
  Dengan satu klik, AI akan menganalisis seluruh data pelanggan dan mengelompokkannya ke dalam segmen yang relevan (misalnya: VIP, Berisiko, Reguler).

- 🎛️ **Tabel Data Dinamis**
  Atur tampilan data sesuai kebutuhan Anda. Tampilkan atau sembunyikan kolom tabel dengan mudah melalui menu pengaturan.

- 👆 **Analisis Kustom Drag-and-Drop**
  Dapatkan insight spesifik dengan menarik header kolom ke _Area Analisis AI_ dan berikan instruksi dalam bahasa natural. AI akan memberikan jawaban sesuai konteks yang Anda berikan.

- ⚡ **Antarmuka Responsif**
  Dibangun dengan Tailwind CSS untuk pengalaman pengguna yang optimal di berbagai perangkat.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi         | Deskripsi                                                                   |
| ----------------- | --------------------------------------------------------------------------- |
| **Next.js 14**    | Framework React untuk aplikasi full-stack dengan App Router.                |
| **React 18**      | Library utama untuk membangun antarmuka pengguna (UI).                      |
| **TypeScript**    | Menambahkan tipe data statis untuk kode yang lebih aman dan mudah dikelola. |
| **Tailwind CSS**  | Framework CSS utility-first untuk styling yang cepat dan modern.            |
| **Vercel AI SDK** | Toolkit untuk mempermudah integrasi dengan model AI seperti Gemini.         |
| **Google Gemini** | Model AI generatif yang menjadi "otak" di balik fitur analisis.             |
| **Dnd Kit**       | Library drag-and-drop modern, ringan, dan aksesibel untuk React.            |
| **Headless UI**   | Komponen UI yang tidak memiliki style bawaan dan aksesibel (dropdown, dll). |

---

## 🚀 Instalasi & Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat

- Node.js (v18.0 atau lebih baru)
- npm / yarn / pnpm

### 2. Kloning Repositori

```bash
git clone https://github.com/Reuse-Intelligently-Ai/crm-ai-segmentations.git
cd crm-ai-segmentations
```

### 3. Instalasi Dependensi

```bash
npm install
```

### 4. Konfigurasi Environment Variable

Dapatkan API Key Anda dari Google AI Studio. Lalu, buat file `.env.local`:

```env
GOOGLE_API_KEY="MASUKKAN_API_KEY_GEMINI_ANDA_DI_SINI"
```

### 5. Menjalankan Server Development

```bash
npm run dev
```

Buka `http://localhost:3000` di browser Anda untuk melihat aplikasi.

---

## 🗺️ Rencana Pengembangan (Roadmap)

### 🔧 Peningkatan UI/UX

- [ ] **Simpan Preferensi Tampilan**: Simpan konfigurasi kolom (visibilitas & urutan) di localStorage atau database.
- [ ] **Ubah Urutan Kolom**: Implementasikan drag-and-drop untuk header kolom.
- [ ] **Animasi & Transisi**: Tambahkan transisi halus untuk AI response dan perubahan UI.
- [ ] **Mode Gelap (Dark Mode)**: Dukungan tema gelap.

### ⚙️ Fungsionalitas Inti

- [ ] **Koneksi Database Nyata**: Ganti `dummyCustomers` dengan koneksi ke PostgreSQL, MongoDB, atau Supabase.
- [ ] **Pagination & Pencarian**: Untuk ribuan data dan pencarian cepat.
- [ ] **Edit Data Langsung**: Inline editing langsung di tabel.
- [ ] **Manajemen Prompt**: Simpan template prompt analisis AI yang sering digunakan.

### 🧠 AI Insight Proaktif

- [ ] **Tombol "Sarankan Insight"**: AI menyarankan kolom analisis baru.
- [ ] **Eksekusi Saran AI**: Tambahkan kolom baru ke tabel berdasarkan saran AI + server action untuk menghitung nilainya.

### 📊 Analisis & Visualisasi Lanjutan

- [ ] **Visualisasi Data**: Gunakan Chart.js / Recharts untuk grafik analisis.
- [ ] **Riwayat Analisis**: Simpan dan tampilkan hasil analisis sebelumnya.
- [ ] **Ekspor Data**: Ekspor tabel + segmentasi ke CSV / Excel.

---

## 🤝 Kontribusi

Kontribusi sangat kami hargai! Jika Anda punya ide untuk meningkatkan proyek ini, silakan buat _issue_ atau kirimkan _pull request_.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

---

> Dibuat dengan ❤️ oleh tim [Reuse Intelligently AI](https://github.com/Reuse-Intelligently-Ai)
