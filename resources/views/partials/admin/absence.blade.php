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
                            <td>No</td>
                            <td>Nama Mahasiswa</td>
                            <td>Tanggal</td>
                            <td>Jam Masuk</td>
                            <td>Jam Keluar</td>
                            <td>Aktivitas</td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $a)
                            <tr class="unread">
                                <td>
                                    {{ $index + 1 }}
                                </td>
                                <td>
                                    {{ $a->participant->user->name }}
                                </td>
                                <td>
                                    {{ $a->date }}
                                </td>
                                <td>
                                    {{ $a->check_in }}
                                </td>
                                <td>
                                    {{ $a->check_out }}
                                </td>
                                <td>
                                    {{ $a->activity }}
                                </td>
                                <td>
                                    @php $status = optional($a->verification)->status; @endphp

                                    @if (in_array($a->status, ['excused', 'sick']))
                                        <select class="border px-2 py-1 rounded text-sm w-full"
                                            onchange="verifyAbsence({{ $a->id }}, this.value)">
                                            <option value="pending" @selected($status === 'pending')>Perlu Konfirmasi
                                            </option>
                                            <option value="approved" @selected($status === 'approved')>Disetujui</option>
                                            <option value="rejected" @selected($status === 'rejected')>Ditolak</option>
                                        </select>
                                    @else
                                        <span class="italic text-gray-500">Tidak Perlu Verifikasi</span>
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
