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
                            <th>No</th>
                            <th>Nama Mahasiswa</th>
                            <th>NIM</th>
                            <th>Jurusan</th>
                            <th>Perusahaan</th>
                            <th>Hadir</th>
                            <th>Izin</th>
                            <th>Sakit</th>
                            <th>Alfa</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $s)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $s->user->name }}</td>
                                <td>{{ $s->student_number }}</td>
                                <td>{{ $s->major }}</td>
                                <td>{{ $s->company_name }}</td>
                                <td>{{ $s->rekap['present'] ?? 0 }}</td>
                                <td>{{ $s->rekap['excused'] ?? 0 }}</td>
                                <td>{{ $s->rekap['sick'] ?? 0 }}</td>
                                <td>{{ $s->rekap['absent'] ?? 0 }}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary"
                                        onclick="showDetailSwal({{ $s->user->id }}, '{{ $s->user->name }}')">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
