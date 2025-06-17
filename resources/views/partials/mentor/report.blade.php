<div class="col-span-12 xl:col-span-8 md:col-span-6">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>

        <div class="card-body">
            <div class="table-responsive">
                <table class="table border w-full" id="myTable">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>NIM</th>
                            <th>Hadir</th>
                            <th>Izin</th>
                            <th>Sakit</th>
                            <th>Alfa</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $r)
                            <tr>
                                <td>{{ $r->user->name }}</td>
                                <td>{{ $r->student_number }}</td>
                                <td>{{ $r->absences['hadir'] }}</td>
                                <td>{{ $r->absences['izin'] }}</td>
                                <td>{{ $r->absences['sakit'] }}</td>
                                <td>{{ $r->absences['alfa'] }}</td>
                                <td>
                                    <button onclick="showDetailSwal({{ $r->user->id }}, '{{ $r->user->name }}')"
                                        class="bg-blue-500 text-white px-2 py-1 rounded">
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
