<div class="grid grid-cols-5 gap-4 mb-6">
    @foreach ($summary as $key => $count)
        <div class="bg-white p-4 rounded shadow text-center">
            <h4 class="text-lg font-bold">{{ ucfirst($key) }}</h4>
            <p class="text-2xl">{{ $count }}</p>
        </div>
    @endforeach
</div>


<div class="col-span-12 xl:col-span-8 md:col-span-6 mt-5">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5 class="text-xl font-bold mb-4">Laporan Absensi</h5>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover display border border-amber-900" id="myTable">
                    <thead>
                        <tr>
                            <th class="border px-4 py-2">No</th>
                            <th class="border px-4 py-2">Tanggal</th>
                            <th class="border px-4 py-2">Masuk</th>
                            <th class="border px-4 py-2">Keluar</th>
                            <th class="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($absences as $i => $a)
                            <tr>
                                <td class="border px-4 py-2">{{ $i + 1 }}</td>
                                <td class="border px-4 py-2">{{ $a->date }}</td>
                                <td class="border px-4 py-2">{{ $a->check_in ?? '-' }}</td>
                                <td class="border px-4 py-2">{{ $a->check_out ?? '-' }}</td>
                                <td class="border px-4 py-2 capitalize">{{ ucfirst($a->status) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
