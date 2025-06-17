<div class="col-span-12">
    <div class="card p-6">
        <div class="card-header mb-4">
            <h5>Daftar Peserta Bimbingan</h5>
        </div>
        <div class="table-responsive">
            <table class="table display" id="myTable">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>NIM</th>
                        <th>Jurusan</th>
                        <th>Perusahaan</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($td as $i => $p)
                        <tr>
                            <td>{{ $i + 1 }}</td>
                            <td>{{ $p->user->name }}</td>
                            <td>{{ $p->student_number }}</td>
                            <td>{{ $p->major }}</td>
                            <td>{{ $p->company_name }}</td>
                            <td>{{ $p->user->email }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
