<div class="col-span-12 xl:col-span-8 md:col-span-6">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>
        <button onclick="showTambahPeserta()">
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
                            <td>Nama Peserta</td>
                            <td>Nomor Peserta</td>
                            <td>Jurusan</td>
                            <td>Perusahaan</td>
                            <td>Email</td>
                            <td>Aksi</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $s)
                            <tr class="unread">
                                <td>
                                    {{ $index + 1 }}
                                </td>
                                <td>
                                    {{ $s->user->name }}
                                </td>
                                <td>
                                    {{ $s->student_number }}
                                </td>
                                <td>
                                    {{ $s->major }}
                                </td>
                                <td>
                                    {{ $s->company_name }}
                                </td>
                                <td>
                                    {{ $s->user->email }}
                                </td>
                                <td>
                                    <button
                                        onclick="showEditPeserta({{ $s->id }}, { name: '{{ $s->user->name }}', student_number: '{{ $s->student_number }}', major: '{{ $s->major }}', company_name: '{{ $s->company_name }}', email: '{{ $s->user->email }}' })"
                                        class="badge btn-primary text-white text-base">
                                        Edit
                                    </button>


                                    <button href="javascript:void(0)" onclick="deleteParticipant({{ $s->id }})"
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
