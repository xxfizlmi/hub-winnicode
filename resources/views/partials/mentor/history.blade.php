<div class="col-span-12 xl:col-span-8 md:col-span-6">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>

        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover display border border-amber-900" id="myTable">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 border">Tanggal</th>
                            <th class="px-4 py-2 border">Nama</th>
                            <th class="px-4 py-2 border">Status Absen</th>
                            <th class="px-4 py-2 border">Aktivitas</th>
                            <th class="px-4 py-2 border">Status Verifikasi</th>
                            <th class="px-4 py-2 border">Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $v)
                            <tr>
                                <td class="px-4 py-2 border">{{ $v->absence->date }}</td>
                                <td class="px-4 py-2 border">{{ $v->absence->participant->user->name }}</td>
                                <td class="px-4 py-2 border">{{ ucfirst($v->absence->status) }}</td>
                                <td class="px-4 py-2 border">{{ $v->absence->activity }}</td>
                                <td class="px-4 py-2 border">
                                    @php
                                        $badgeClass =
                                            [
                                                'approved' => 'bg-green-500 text-white',
                                                'rejected' => 'bg-red-500 text-white',
                                                'pending' => 'bg-yellow-400 text-black',
                                            ][$v->status] ?? 'bg-gray-300';

                                        $label =
                                            [
                                                'approved' => 'Disetujui',
                                                'rejected' => 'Ditolak',
                                                'pending' => 'Menunggu',
                                            ][$v->status] ?? ucfirst($v->status);
                                    @endphp

                                    <span class="px-2 py-1 rounded {{ $badgeClass }}">{{ $label }}</span>

                                </td>
                                <td class="px-4 py-2 border">{{ $v->note ?? '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
