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
                            <th class="px-4 py-2 border">Verifikasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $m)
                            <tr class="unread">
                                <td>
                                    {{ \Carbon\Carbon::parse($m->absence->date) }}
                                </td>
                                <td>
                                    {{ $m->absence->participant->user->name }}
                                </td>
                                <td>
                                    {{ $m->absence->status }}
                                </td>
                                <td>
                                    {{ $m->absence->activity }}
                                </td>
                                <td>
                                    @if (in_array($m->absence->status, ['excused', 'sick']))
                                        <select class="border px-2 py-1 rounded text-sm w-full"
                                            onchange="verifikasi({{ $m->id }}, this.value)">
                                            <option value='pending' @selected($m->status === 'pending')>Perlu konfirmasi
                                            </option>
                                            <option value="approved" @selected($m->status === 'approved')>Disetujui</option>
                                            <option value="rejected" @selected($m->status === 'rejected')>Ditolak</option>
                                        </select>
                                    @else
                                        <span class="italic text-gray-500">Tidak perlu verifikasi</span>
                                    @endif

                                </td>
                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
