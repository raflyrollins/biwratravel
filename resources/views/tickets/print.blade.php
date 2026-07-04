<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cetak Tiket - {{ $booking->booking_code }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Gabarito', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f5f5;
            color: #1a1a1a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
            display: flex;
            gap: 8px;
        }

        .btn-print {
            padding: 10px 24px;
            background: #0066cc;
            color: white;
            border: none;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.15s;
        }

        .btn-print:hover { background: #0052a3; }

        .btn-close {
            padding: 10px 24px;
            background: white;
            color: #1a1a1a;
            border: 1px solid #ddd;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.15s;
        }

        .btn-close:hover { background: #f0f0f0; }

        .ticket-container {
            max-width: 800px;
            margin: 80px auto 40px;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .ticket-header {
            padding: 32px 40px;
            border-bottom: 3px solid #0066cc;
            text-align: center;
        }

        .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #0066cc;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .company-tagline {
            font-size: 12px;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .company-info {
            font-size: 12px;
            color: #888;
            line-height: 1.6;
        }

        .ticket-body { padding: 32px 40px; }

        .booking-code-bar {
            background: #0066cc;
            color: white;
            padding: 16px 24px;
            text-align: center;
            margin-bottom: 24px;
        }

        .booking-code-bar .label {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 4px;
        }

        .booking-code-bar .code {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 3px;
        }

        .section {
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 600;
            color: #888;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }

        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .detail-item .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .detail-item .value {
            font-size: 15px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .route-display {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8f9fa;
            margin-bottom: 16px;
        }

        .route-city {
            font-size: 18px;
            font-weight: 700;
            color: #0066cc;
        }

        .route-arrow {
            font-size: 20px;
            color: #888;
        }

        .segments-list {
            border: 1px solid #eee;
        }

        .segment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            border-bottom: 1px solid #eee;
        }

        .segment-row:last-child { border-bottom: none; }

        .segment-cities {
            font-size: 14px;
            font-weight: 500;
        }

        .segment-order {
            font-size: 12px;
            color: #888;
        }

        .passengers-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .passengers-table th {
            text-align: left;
            padding: 10px 12px;
            background: #f8f9fa;
            font-size: 11px;
            font-weight: 600;
            color: #888;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-bottom: 2px solid #eee;
        }

        .passengers-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
        }

        .passengers-table tr:last-child td { border-bottom: none; }

        .time-highlight {
            display: flex;
            gap: 24px;
            padding: 20px;
            background: #f8f9fa;
            text-align: center;
        }

        .time-box {
            flex: 1;
        }

        .time-box .time-label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
        }

        .time-box .time-value {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
        }

        .time-box .time-sub {
            font-size: 12px;
            color: #888;
            margin-top: 2px;
        }

        .time-separator {
            display: flex;
            align-items: center;
            font-size: 20px;
            color: #888;
        }

        .ticket-footer {
            padding: 24px 40px;
            border-top: 1px solid #eee;
            background: #f8f9fa;
        }

        .ticket-footer p {
            font-size: 11px;
            color: #888;
            line-height: 1.6;
        }

        .qr-placeholder {
            width: 100px;
            height: 100px;
            border: 2px dashed #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #aaa;
            margin: 0 auto;
        }

        @media print {
            body { background: white; }
            .page-controls { display: none !important; }
            .ticket-container {
                margin: 0;
                box-shadow: none;
                max-width: 100%;
            }
        }

        @page {
            size: A4;
            margin: 15mm;
        }
    </style>
</head>
<body>
    <div class="page-controls">
        <button class="btn-print" onclick="window.print()">Cetak Tiket</button>
        <button class="btn-close" onclick="window.close()">Tutup</button>
    </div>

    <div class="ticket-container">
        <div class="ticket-header">
            <div class="company-name">Biwratravel</div>
            <div class="company-tagline">Bus Ticket Booking Platform</div>
            <div class="company-info">
                Jl. Contoh Alamat No. 123, Kota, Provinsi, Indonesia<br>
                Telp: (021) 1234-5678 | Email: info@biwratravel.id
            </div>
        </div>

        <div class="ticket-body">
            <div class="booking-code-bar">
                <div class="label">Kode Booking</div>
                <div class="code">{{ $booking->booking_code }}</div>
            </div>

            <div class="section">
                <div class="section-title">Detail Perjalanan</div>
                <div class="route-display">
                    <span class="route-city">{{ $originCity->name }}</span>
                    <span class="route-arrow">→</span>
                    <span class="route-city">{{ $destinationCity->name }}</span>
                </div>

                @if($segments->count() > 0)
                <div class="segments-list">
                    @foreach($segments as $seg)
                    <div class="segment-row">
                        <span class="segment-cities">
                            {{ $seg->originCity->name }} → {{ $seg->destinationCity->name }}
                        </span>
                        <span class="segment-order">Segmen {{ $seg->order }}</span>
                    </div>
                    @endforeach
                </div>
                @endif
            </div>

            <div class="time-highlight">
                <div class="time-box">
                    <div class="time-label">Tanggal</div>
                    <div class="time-value">{{ \Carbon\Carbon::parse($trip->departure_date)->translatedFormat('d M Y') }}</div>
                </div>
                <div class="time-separator">|</div>
                <div class="time-box">
                    <div class="time-label">Berangkat</div>
                    <div class="time-value">{{ $trip->departure_time }}</div>
                </div>
                <div class="time-separator">|</div>
                <div class="time-box">
                    <div class="time-label">Estimasi Tiba</div>
                    <div class="time-value">{{ $trip->estimated_arrival ?? '-' }}</div>
                </div>
            </div>

            <div class="section" style="margin-top: 24px;">
                <div class="section-title">Armada</div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="label">Nama Bus</div>
                        <div class="value">{{ $bus->name }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Nomor Polisi</div>
                        <div class="value">{{ $bus->plate_number }}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Data Penumpang ({{ $passengers->count() }})</div>
                <table class="passengers-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIK</th>
                            <th>Nama</th>
                            <th>JK</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($passengers as $i => $p)
                        <tr>
                            <td>{{ $i + 1 }}</td>
                            <td>{{ $p->nik }}</td>
                            <td>{{ $p->name }}</td>
                            <td>{{ $p->gender === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="section">
                <div class="section-title">Total Pembayaran</div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f8f9fa;">
                    <div>
                        <div style="font-size: 12px; color: #888;">
                            {{ $passengers->count() }} penumpang
                        </div>
                    </div>
                    <div style="font-size: 24px; font-weight: 700; color: #0066cc;">
                        Rp {{ number_format($booking->total_price, 0, ',', '.') }}
                    </div>
                </div>
            </div>
        </div>

        <div class="ticket-footer">
            <p>
                Simpan tiket ini dan tunjukkan saat naik bus. Tiket ini merupakan bukti pemesanan yang sah.
                Hubungi customer service kami jika membutuhkan bantuan.
            </p>
        </div>
    </div>
</body>
</html>
