<div class="col-span-12 xl:col-span-8 md:col-span-6">
    <div class="card table-card p-10">
        <div class="card-header">
            <h5>Data {{ $name }}</h5>
        </div>
        <button data-modal-target="modal-mahasiswa" data-modal-toggle="modal-mahasiswa" class="rounded-lg">
            <div class="bg-teal-600 hover:bg-teal-400 text-white font-semibold px-4 py-2 rounded-lg duration-500">
                + Tambah Mahasiswa
            </div>
        </button>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover display" id="myTable">
                    <thead>
                        <tr>
                            <td>No</td>
                            <td>Nama Mahasiswa</td>
                            <td>NIM</td>
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
                                    {{ $s->nim }}
                                </td>
                                <td>
                                    {{ $s->jurusan }}
                                </td>
                                <td>
                                    {{ $s->perusahaan }}
                                </td>
                                <td>
                                    {{ $s->user->email }}
                                </td>
                                <td>
                                    <a href="javascript:void(0)"
                                        class="badge bg-blue-600 hover:bg-blue-400 duration-500 text-white text-base mx-2"
                                        onclick="openEditModal({{ $s->id }}, '{{ $s->user->name }}', '{{ $s->nim }}', '{{ $s->jurusan }}', '{{ $s->perusahaan }}','{{ $s->user->email }}')">
                                        Edit
                                    </a>
                                    <a href="javascript:void(0)" onclick="deleteMahasiswa({{ $s->id }})"
                                        class="badge bg-red-600 hover:bg-red-400 duration-500 text-white text-base">
                                        Hapus
                                    </a>
                                </td>
                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

{{-- @include('admin.partials.mahasiswa.form')
@include('admin.partials.mahasiswa.edit') --}}

<script>
    function deleteMahasiswa(id) {
        Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: "Data mahasiswa akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Menghapus...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                fetch(`/admin/mahasiswa/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute(
                                'content'),
                            'Accept': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        Swal.close();
                        if (data.status === 'success') {
                            Swal.fire('Berhasil!', data.message, 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Gagal!', data.message, 'error');
                        }
                    })
                    .catch(() => {
                        Swal.close();
                        Swal.fire('Error', 'Terjadi kesalahan saat menghapus.', 'error');
                    });
            }
        });
    }
</script>
