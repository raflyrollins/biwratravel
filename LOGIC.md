# Logika Bisnis — Sistem Penjualan Tiket Bus biwratravel (lowercase di UI, di Head Title Browser "Biwratravel")

## 1. Gambaran Umum

Sistem ini adalah platform penjualan tiket bus yang dikelola oleh kantor utama di Medan, dengan jaringan stasiun/loket di berbagai kota. Setiap kota bisa menjadi titik keberangkatan (bukan hanya Medan), dan setiap bis memiliki rutenya masing-masing yang independen satu sama lain.

Sistem mendukung dua jalur penjualan tiket reguler (online & offline/loket), serta satu jalur khusus untuk penyewaan bis secara charter/grup.

---

## 2. Rute, Segmen, dan Kapasitas

### 2.1 Rute

- Setiap bis memiliki rute sendiri: urutan kota yang dilewati secara berurutan.
- Contoh: Bis A memiliki rute A → B → C → D → E → F.
- Rute antar bis tidak saling berhubungan — masing-masing bis punya rute independen.

### 2.2 Segmen

- Segmen adalah potongan terkecil antar dua kota berdekatan dalam satu rute (contoh: A-B, B-C, C-D).
- Segmen menjadi satuan dasar untuk perhitungan kapasitas dan harga.

### 2.3 Pembelian Sub-Rute

- Customer tidak harus membeli tiket dari titik awal sampai akhir rute.
- Customer bisa membeli tiket untuk sub-rentang tertentu saja (misalnya D → F dari rute A-B-C-D-E-F), selama titik-titik tersebut berurutan sesuai arah rute.
- Rute multi-segmen tetap ditempuh dengan **satu bis yang sama** — tidak ada mekanisme transit/pindah bis dalam satu tiket.

### 2.4 Kapasitas Berbasis Overlap Segmen

- Kapasitas bis (misal 60 kursi) berlaku untuk keseluruhan trip, tetapi dihitung ulang **per segmen** berdasarkan booking yang melewati (overlap) segmen tersebut.
- Contoh: jika 35 orang membeli tiket A→F (full route), maka 35 kursi tersebut terpakai di **semua segmen** yang dilewati — bukan hanya di titik A dan F.
- Sisa kursi yang bisa dijual di segmen lain = kapasitas total − jumlah booking yang overlap dengan segmen tersebut.
- Kursi yang "kosong" di satu bagian rute tetap bisa dijual ke penumpang lain yang naik-turun di titik berbeda, selama tidak overlap secara segmen dengan booking yang sudah ada.

### 2.5 Cakupan Saat Ini

- Untuk tahap ini, sistem hanya menangani **rute yang selesai dalam satu hari** (tidak overnight/multi-hari). Skema rute multi-hari direncanakan untuk fase berikutnya.

---

## 3. Trip (Jadwal Keberangkatan)

- Trip adalah instance konkret dari sebuah rute pada tanggal dan jam tertentu — inilah yang benar-benar dijual ke customer.
- Alur konseptual: Rute terdiri dari Segmen-segmen → Trip adalah Rute pada tanggal/jam tertentu → Booking mengambil satu atau lebih segmen berurutan dari Trip.

### 3.1 Perjalanan Pulang (Return Leg)

Status "beroperasi" suatu bis pada perjalanan pulang ditentukan oleh ada/tidaknya rute yang menempel ke perjalanan tersebut:

- Jika bis pulang ke titik awal **tanpa rute** yang menempel → dianggap deadhead/repositioning, tidak tercatat sebagai trip yang bisa dibeli.
- Jika bis pulang dengan **rute** yang menempel (mirror dari rute berangkat atau rute lain) → dianggap trip resmi yang punya segmen dan kapasitas sendiri, bisa dijual ke customer.

### 3.2 Ketersediaan Bis

Ketersediaan bis memiliki dua makna berbeda tergantung konteks penggunaannya — tidak bisa disamakan begitu saja.

**Untuk tiket reguler (pencarian & pembelian customer):**

- Bis dianggap tersedia selama trip/jadwalnya **ada** dan masih memiliki **sisa kapasitas** di segmen yang diminta (dihitung dari overlap booking yang sudah terjual, lihat bagian 2.4).
- Trip tetap muncul sebagai opsi selama kapasitasnya belum penuh, meskipun sudah ada sebagian kursi yang terjual.

**Untuk charter (pengajuan sewa bis utuh):**

- Bis dianggap tersedia hanya jika **belum ada booking apapun** (baik tiket reguler maupun charter lain) yang overlap dengan tanggal dan rentang rute yang diminta.
- Karena charter menyewa seluruh bis, begitu ada satu kursi saja yang sudah terjual ke customer reguler pada trip tersebut, bis itu otomatis **tidak bisa** dicharter penuh di rentang tanggal/rute yang sama — walaupun trip itu masih dianggap "tersedia" dari sudut pandang tiket reguler.
- Jadwal/rute yang ter-set sifatnya hanya "rencana"; yang menentukan bisa/tidaknya dicharter adalah ada/tidaknya transaksi nyata (booking) yang sudah melekat pada trip tersebut.

### 3.3 Status Perjalanan per Segmen

Status perjalanan dicatat **per segmen**, bukan per trip secara keseluruhan — karena satu trip bisa memiliki beberapa segmen dengan status berbeda secara bersamaan.

Siklus status per segmen:

```
SCHEDULED → IN_TRANSIT → COMPLETED
```

- **SCHEDULED** — segmen belum mulai berjalan, masih dalam tahap terjadwal.
- **IN_TRANSIT** — bis sedang menempuh segmen tersebut.
- **COMPLETED** — segmen sudah selesai ditempuh.

Contoh pada satu trip yang sedang berjalan (rute A-B-C-D-E-F):

| Segmen | Status     |
| ------ | ---------- |
| A→B    | IN_TRANSIT |
| B→C    | SCHEDULED  |
| C→D    | SCHEDULED  |
| D→E    | SCHEDULED  |
| E→F    | SCHEDULED  |

---

## 4. Harga dan Promo

### 4.1 Harga Dasar

- Harga ditetapkan **per segmen**, bukan per rute secara keseluruhan.

### 4.2 Promo

| Aspek      | Ketentuan                                                            |
| ---------- | -------------------------------------------------------------------- |
| Cakupan    | Per segmen spesifik (bukan general per rute/trip)                    |
| Bentuk     | Diskon persentase                                                    |
| Periode    | Ada tanggal mulai & selesai (otomatis aktif/nonaktif sesuai tanggal) |
| Pencabutan | Bisa dicabut manual oleh admin sebelum periode berakhir              |

---

## 5. Booking dan Payment — Dua Entitas Terpisah

Booking dan payment sengaja dipisah, bukan digabung jadi satu, karena keduanya punya siklus hidup dan tanggung jawab yang berbeda.

### 5.1 Alasan Pemisahan

- Satu booking bisa memiliki **lebih dari satu percobaan pembayaran** (payment attempt). Jika bukti bayar ditolak, customer mengunggah ulang — ini tercatat sebagai percobaan baru, bukan menimpa data sebelumnya, sehingga riwayat penolakan tetap ada.
- Booking menyimpan data yang tidak berubah meski pembayaran gagal berkali-kali: data trip, segmen, dan penumpang yang dipesan.
- Payment menyimpan detail yang berbeda sifatnya: nominal, bukti transfer, waktu unggah, status validasi, dan siapa yang memvalidasi.
- Booking offline (loket) tetap memiliki payment (dicatat sebagai tunai, langsung disetujui), tetapi tidak melalui alur validasi seperti booking online. Pemisahan ini membuat kedua pola tersebut bisa direpresentasikan secara konsisten.

### 5.2 Hubungan Konseptual

```
BOOKING (satu kode booking)
   ├─ Data trip, segmen, dan penumpang
   ├─ Status booking: AWAITING_PAYMENT → CONFIRMED / EXPIRED
   │
   └─ Memiliki satu atau lebih PAYMENT ATTEMPT
         ├─ Percobaan pertama: bukti diunggah → PAYMENT_REJECTED
         ├─ Percobaan berikutnya: bukti diunggah → disetujui
         └─ Untuk booking offline: satu payment attempt, langsung disetujui (tunai)
```

- Status booking merupakan ringkasan dari riwayat payment attempt di dalamnya. Begitu ada satu payment attempt yang disetujui, status booking otomatis berubah menjadi `CONFIRMED`.
- Pola yang sama berlaku untuk charter — setelah disetujui Admin Charter, charter diteruskan ke tahap `AWAITING_PAYMENT` yang juga menghasilkan payment attempt tersendiri, terpisah dari data pengajuan charternya (rute custom, jumlah bis, harga hasil quotation, dll).

---

## 6. Alur Pembelian Tiket Reguler — Online

```
1. PENCARIAN
   Customer memilih Kota Asal, Kota Tujuan, dan Tanggal → Cari
        ↓
2. HASIL PENCARIAN
   Sistem menampilkan daftar bis yang sesuai (termasuk rute multi-segmen),
   untuk tanggal yang dipilih hingga akhir bulan
        ↓
3. PILIH TRIP
   Customer memilih salah satu bis/jadwal
        ↓
4. INPUT DATA PENUMPANG
   Bisa lebih dari satu penumpang dalam satu booking
   Data: NIK, Nama, Jenis Kelamin, Tanggal Lahir
   Data tersimpan (berbasis NIK) untuk transaksi berikutnya
        ↓
5. HALAMAN PEMBAYARAN
   Transfer bank atau scan QRIS (statis)
   Customer memasukkan nominal yang ditransfer
   Timer 30 menit mulai berjalan sejak status AWAITING_PAYMENT dibuat
        ↓
6. UPLOAD BUKTI PEMBAYARAN
   Customer mengunggah bukti transfer (tercatat sebagai satu payment attempt)
        ↓
7. VALIDASI ADMIN PENJUALAN
   Admin mencocokkan manual: bukti yang diunggah, nominal di sistem,
   dan mutasi rekening yang benar-benar masuk (tidak ada validasi otomatis oleh sistem)
        ↓
8a. Disetujui → booking CONFIRMED, kode booking siap ditukarkan ke loket mana saja
8b. Ditolak (PAYMENT_REJECTED) → customer dapat mengunggah ulang bukti pembayaran
    dengan tambahan waktu, tercatat sebagai payment attempt baru
8c. Lewat 30 menit tanpa validasi/tanpa unggah bukti → booking EXPIRED
```

---

## 7. Alur Pembelian Tiket Reguler — Offline (Loket)

```
1. Petugas loket memilih Kota Asal, Kota Tujuan, Tanggal, dan Bis
        ↓
2. Input data penumpang
   → Cari berdasarkan NIK terlebih dahulu
   → Jika data sudah ada → gunakan data tersebut (auto-fill)
   → Jika belum ada → input data baru → tersimpan untuk transaksi berikutnya
        ↓
3. Customer membayar langsung di tempat (tercatat sebagai satu payment attempt, langsung disetujui)
        ↓
4. Tiket fisik langsung tercetak
   (tidak memerlukan validasi Admin Penjualan)
```

**Catatan penting:**

- Petugas loket dapat melayani dan mencetak tiket untuk **rute/stasiun mana saja**, tidak dibatasi cakupan wilayah tertentu.
- Petugas loket juga dapat mencetak tiket fisik dari kode booking milik customer yang memesan secara online (setelah booking tersebut berstatus CONFIRMED).
- Satu kode booking, baik online maupun offline, dapat mencakup banyak penumpang sekaligus.

---

## 8. Status Booking

```
AWAITING_PAYMENT (dibuat saat transaksi dimulai, timer 30 menit berjalan)
   ├─ Payment attempt diajukan → tetap AWAITING_PAYMENT sampai divalidasi
   │      ├─ Admin Penjualan menyetujui → CONFIRMED
   │      └─ Admin Penjualan menolak (PAYMENT_REJECTED) → kembali ke AWAITING_PAYMENT
   │           (bisa unggah ulang bukti sebagai payment attempt baru, mendapat waktu tambahan)
   └─ 30 menit lewat tanpa validasi/tanpa unggah bukti → EXPIRED
```

- Booking offline (loket) langsung berstatus **CONFIRMED** tanpa melalui tahap `AWAITING_PAYMENT` dan validasi Admin Penjualan.
- Semua booking online, tanpa terkecuali, memiliki batas waktu pembayaran 30 menit.

---

## 9. Identitas Penumpang

- Data penumpang adalah entitas independen dengan **NIK sebagai identitas utama**, terpisah dari akun login customer.
- Konsep ini memungkinkan satu orang yang pernah membeli tiket secara offline (tanpa akun) untuk tetap dikenali datanya ketika suatu saat membeli secara online (dengan akun), maupun sebaliknya — riwayat perjalanan tetap utuh walau kadang beli online, kadang offline.
- Akun login (customer account) berfungsi sebagai "pintu akses" opsional untuk pembelian online, bukan pemilik tunggal data penumpang.
- Data yang dikumpulkan per penumpang: NIK, Nama, Jenis Kelamin, Tanggal Lahir.

---

## 10. Charter / Sewa Bis Grup

### 10.1 Perbedaan dengan Tiket Reguler

| Aspek       | Tiket Reguler                                     | Booking Charter                                 |
| ----------- | ------------------------------------------------- | ----------------------------------------------- |
| Unit jual   | Per kursi, per segmen                             | Per bis utuh (bisa lebih dari satu bis)         |
| Rute        | Tetap, sudah ditentukan operator                  | Custom, sesuai permintaan customer              |
| Kapasitas   | Dihitung per segmen (overlap)                     | Tidak relevan, bis disewa penuh                 |
| Durasi      | Selesai dalam satu hari (saat ini)                | Bisa multi-hari, pulang-pergi, atau multi-titik |
| Harga       | Per segmen, fixed                                 | Quotation manual oleh admin                     |
| Persetujuan | Otomatis (offline) / validasi pembayaran (online) | Melalui pengajuan dan approval bertingkat       |

### 10.2 Alur Pengajuan Charter

```
1. CUSTOMER mengajukan permintaan (status: SUBMITTED)
   ├─ Tanggal & durasi (jumlah hari sewa)
   ├─ Jumlah penumpang → sistem menghitung kebutuhan jumlah bis
   ├─ Rute/tujuan yang diinginkan (custom, bebas)
   └─ Informasi tambahan lainnya
        ↓
2. SISTEM membantu Admin Charter mengecek ketersediaan (status: UNDER_REVIEW)
   → Bis dianggap available jika belum ada booking (reguler maupun charter lain)
     yang overlap pada tanggal & rute yang diminta
   → Untuk pengajuan multi-hari, sistem membantu cek ketersediaan di
     hari-hari berikutnya juga
   → Prinsip first come first served: siapa yang lebih dulu closing booking,
     dialah yang mendapatkan slot tersebut
        ↓
3. ADMIN CHARTER melakukan review
   → APPROVED: menentukan harga (manual quote)
   → REJECTED: pengajuan ditolak (misal bis tidak tersedia)
        ↓
4. Jika disetujui, status otomatis berubah: AWAITING_PAYMENT
   → Otomatis diteruskan ke antrian Admin Penjualan
        ↓
5. ADMIN PENJUALAN memvalidasi payment attempt
   (menggunakan alur validasi yang sama dengan tiket reguler online)
        ↓
6a. Disetujui → CONFIRMED (bis resmi terkunci untuk charter ini)
6b. Tidak dibayar dalam batas waktu → slot kembali available untuk pengajuan lain
```

**Catatan penting:**

- Jumlah penumpang pada pengajuan charter digunakan untuk menghitung **kebutuhan jumlah armada**, bukan untuk alokasi kursi seperti tiket reguler.
- Validasi pembayaran charter menggunakan jalur yang sama dengan validasi tiket reguler online, yaitu ditangani oleh Admin Penjualan — Admin Charter hanya bertanggung jawab pada tahap approval dan penentuan harga.

---

## 11. Role Pengguna Sistem

| Role                | Fungsi Utama                                                                                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Superadmin**      | Mengelola seluruh data master sistem: rute, bis, kota/stasiun, harga, serta manajemen role/user lain                                                                                         |
| **Admin Penjualan** | Memvalidasi payment attempt tiket online (reguler maupun charter) — satu pintu untuk semua validasi pembayaran                                                                               |
| **Admin Charter**   | Mengelola seluruh alur pengajuan charter: review permintaan, cek ketersediaan, approval, dan penentuan harga                                                                                 |
| **Driver**          | Memperbarui status keberangkatan, ketibaan, dan hal lain terkait perjalanan (per segmen)                                                                                                     |
| **Petugas Loket**   | Menjual tiket secara offline (tanpa perlu validasi Admin Penjualan), serta mencetak tiket dari kode booking customer yang memesan online. Dapat melayani semua stasiun tanpa batasan wilayah |
| **Customer**        | Membeli tiket secara online, mengunggah bukti pembayaran, mendapatkan kode booking                                                                                                           |

---

## 12. Jadwal Driver

### 12.1 Prinsip Umum

- Satu bis dapat memiliki dua driver, dan keduanya berkedudukan setara — tidak ada peran "utama" atau "cadangan/co-driver".
- Driver dapat saling membackup ke bis lain, sehingga penugasan driver bersifat **per-trip**, bukan melekat permanen pada satu bis.
- Kedua driver dalam satu bis sama-sama dapat memperbarui status perjalanan (tidak perlu logika "siapa yang sedang menyetir").

### 12.2 Pola Jadwal: Hybrid (Default Berulang + Override Manual)

```
Driver memiliki POLA DASAR (default recurring)
   Contoh: libur setiap Senin & Kamis
        ↓
Pola ini otomatis ter-generate ke kalender tiap minggu
        ↓
Admin dapat melakukan OVERRIDE manual kapan saja:
   - Mengubah hari libur menjadi hari kerja (jika butuh driver tambahan)
   - Mengubah hari kerja menjadi hari libur (tukar jadwal)
   - Menambahkan Cuti (melalui pengajuan formal)
        ↓
Kalender aktual driver = pola dasar + override + cuti
```

- **Cuti** memerlukan pengajuan formal dari driver, yang kemudian di-set oleh admin sebagai status libur pada periode tersebut.
- Pendekatan hybrid ini dipilih agar admin tidak perlu menyusun jadwal dari nol setiap minggu, namun tetap fleksibel untuk menyesuaikan kebutuhan trip mendadak (misalnya charter) atau pertukaran jadwal antar driver.

---

## 13. Ringkasan Alur Data Utama

```
RUTE (milik satu bis)
  └─ SEGMEN (potongan antar kota berdekatan)
       └─ TRIP (rute + tanggal/jam tertentu)
            ├─ Status per segmen: SCHEDULED → IN_TRANSIT → COMPLETED
            ├─ Kapasitas per segmen: dihitung berdasarkan overlap booking
            └─ BOOKING (satu kode, dapat mencakup banyak penumpang)
                 ├─ Sumber: ONLINE atau OFFLINE
                 ├─ Status: AWAITING_PAYMENT → CONFIRMED / EXPIRED
                 ├─ Memiliki satu atau lebih PAYMENT ATTEMPT
                 └─ PENUMPANG (identitas berbasis NIK, lintas channel)

CHARTER (jalur terpisah dari tiket reguler)
  └─ SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED →
     AWAITING_PAYMENT → Validasi Admin Penjualan → CONFIRMED
```
