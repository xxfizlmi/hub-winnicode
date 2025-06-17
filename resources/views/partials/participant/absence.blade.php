{{-- Tombol hanya muncul jika belum absen hari ini --}}
@if (!$absenHariIni)
    <button onclick="openCheckInForm()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        Isi Jam Masuk
    </button>
@endif

{{-- Tombol Jam Keluar muncul jika sudah absen masuk dan sekarang >= 16:00 --}}
@if ($absenHariIni && $absenHariIni->check_out == null && now()->format('H:i') >= '12:00')
    <button onclick="openCheckOutForm()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
        Isi Jam Keluar
    </button>
@endif


{{-- @endif --}}
@if ($absenHariIni)
    <div class="mt-6 bg-white border border-green-200 rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
            <i class="ti ti-info-circle text-green-600 text-xl"></i>
            <h5 class="text-green-700 font-semibold text-base">
                Kamu sudah mengisi absensi hari ini
            </h5>
        </div>
        <ul class="text-sm text-gray-700 pl-4 list-disc space-y-1">
            <li><strong>Tanggal:</strong> {{ $absenHariIni->date }}</li>
            <li><strong>Jam Masuk:</strong> {{ $absenHariIni->check_in ?? '-' }}</li>
            <li><strong>Jam Keluar:</strong> {{ $absenHariIni->check_out ?? '-' }}</li>
            <li><strong>Status:</strong>
                <span class="capitalize font-medium text-green-600">
                    {{ ucfirst($statusMap[$absenHariIni->status] ?? $absenHariIni->status) }}
                </span>
            </li>
        </ul>
    </div>
@endif



<div class="col-span-12 xl:col-span-8 md:col-span-6 mt-5">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover display border border-amber-900" id="myTable">
                    <thead>
                        <tr>
                            <th class="border px-4 py-2">Tanggal</th>
                            <th class="border px-4 py-2">Tanggal</th>
                            <th class="border px-4 py-2">Masuk</th>
                            <th class="border px-4 py-2">Keluar</th>
                            <th class="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($recentAbsences as $index => $a)
                            <tr>
                                <td class="border px-4 py-2 text-lg">{{ $index + 1 }}</td>
                                <td class="border px-4 py-2 text-lg">{{ $a->date }}</td>
                                <td class="border px-4 py-2 text-lg">{{ $a->check_in ?? '-' }}</td>
                                <td class="border px-4 py-2 text-lg">{{ $a->check_out ?? '-' }}</td>
                                <td class="border px-4 py-2 capitalize text-lg">
                                    @php
                                        // Default label dan warna dari status DB
                                        $originalStatus = $a->status;
                                        $checkIn = $a->check_in ?? '00:00';
                                        $isLateVisual = $originalStatus === 'present' && $checkIn > '08:00';

                                        $statusLabel = $isLateVisual
                                            ? 'Terlambat'
                                            : $statusMap[$originalStatus] ?? ucfirst($originalStatus);
                                        $statusColor = match (true) {
                                            $isLateVisual => 'bg-orange-100 text-orange-800',
                                            $originalStatus === 'present' => 'bg-green-100 text-green-800',
                                            $originalStatus === 'excused' => 'bg-yellow-100 text-yellow-800',
                                            $originalStatus === 'sick' => 'bg-blue-100 text-blue-800',
                                            $originalStatus === 'absent' => 'bg-red-100 text-red-800',
                                            default => 'bg-gray-100 text-gray-800',
                                        };
                                    @endphp
                                    <span class="px-3 py-1 rounded-full text-sm font-semibold {{ $statusColor }}">
                                        {{ $statusLabel }}
                                    </span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
