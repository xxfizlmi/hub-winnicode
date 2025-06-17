<div class="col-span-12 xl:col-span-8 md:col-span-6">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>
        <button onclick="showTambahMentor()">
            <div class="bg-teal-600 hover:bg-teal-400 text-white font-semibold px-4 py-2 rounded-lg duration-500">
                + Tambah {{ $name }}
            </div>
        </button>

        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover display border border-amber-900" id="myTable">
                    <thead>
                        <tr>
                            <td>No</td>
                            <td>Nama Mentor</td>
                            <td>Instansi</td>
                            <td>Email</td>
                            <td>Aksi</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $m)
                            <tr class="unread">
                                <td>
                                    {{ $index + 1 }}
                                </td>
                                <td>
                                    {{ $m->user->name }}
                                </td>
                                <td>
                                    {{ $m->organization_name }}
                                </td>
                                <td>
                                    {{ $m->user->email }}
                                </td>
                                <td>
                                    <button
                                        onclick="showEditMentor({{ $m->id }}, { name: '{{ $m->user->name }}', organization_name: '{{ $m->organization_name }}', email: '{{ $m->user->email }}'})"
                                        class="badge btn-primary text-white text-base">
                                        Edit
                                    </button>


                                    <button onclick="deleteMentor({{ $m->id }})"
                                        class="badge btn-danger text-white text-base">
                                        Hapus
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
