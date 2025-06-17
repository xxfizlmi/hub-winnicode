    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <script src="https://cdn.datatables.net/2.3.1/js/dataTables.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- DataTables Buttons JS -->
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>

    <!-- FileSaver & JSZip untuk Excel/PDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>


    <script>
        $(document).ready(function() {
            $('#myTable').DataTable({
                dom: '<"flex flex-wrap justify-between items-center mb-4"lBf>rt<"flex justify-between items-center mt-4"ip>',
                buttons: [{
                        extend: 'copy',
                        text: '<i class="fas fa-copy"></i> Salin'
                    },
                    {
                        extend: 'csv',
                        text: '<i class="fas fa-file-csv"></i> CSV'
                    },
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel'
                    },
                    {
                        extend: 'pdf',
                        text: '<i class="fas fa-file-pdf"></i> PDF'
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i> Cetak'
                    }
                ],

                initComplete: function() {
                    // Tombol export styling
                    $('.dt-button').addClass(
                        'bg-blue-500 text-white px-4 py-2 rounded-md text-sm mr-2 hover:bg-blue-600'
                    );
                    // Search input styling
                    $('.dataTables_filter input').addClass(
                        'border border-gray-300 rounded px-3 py-1 ml-2');
                    // Dropdown page length styling
                    $('.dataTables_length select').addClass('border border-gray-300 rounded px-2 py-1');
                    // Info text styling
                    $('.dataTables_info').addClass('text-sm text-gray-600');
                    // Pagination styling
                    $('.dataTables_paginate').addClass('space-x-2');
                    $('.paginate_button').addClass(
                        'px-3 py-1 rounded border border-gray-300 hover:bg-gray-200');
                }
            });
            $('#myTable thead tr:eq(1) th').each(function(i) {
                $('input', this).on('keyup change', function() {
                    if ($('#myTable').DataTable().column(i).search() !== this.value) {
                        $('#myTable').DataTable().column(i).search(this.value).draw();
                    }
                });
            });
        });



        function showTambahMentor() {
            Swal.fire({
                title: 'Tambah Mentor',
                html: `
                @php
                    $labelMap = collect($form)->pluck(0, 2);
                @endphp

                {!! collect($form)->map(function ($f) {
                        $label = $f[0];
                        $type = $f[1];
                        $name = $f[2];
                        return "
                                                                                <div class='text-left m-3 flex flex-col gap-3'>
                                                                                <label for='{$name}' class='block text-lg font-medium'>{$label}</label>
                                                                                <input type='{$type}' id='{$name}' class='form-control p-3' placeholder='{$label}'>
                                                                                </div>";
                    })->implode('') !!}`,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                focusConfirm: false,
                preConfirm: () => {
                    const data = {};
                    @foreach ($form as $f)
                        data["{{ $f[2] }}"] = document.getElementById("{{ $f[2] }}").value
                            .trim();
                    @endforeach

                    const kosong = Object.entries(data).find(([key, val]) => !val);
                    if (kosong) {
                        const labels = @json($labelMap);
                        Swal.showValidationMessage(`Field "${labels[kosong[0]]}" harus diisi.`);
                        return false;
                    }

                    return data;
                }

            }).then((result) => {
                if (result.isConfirmed) {
                    saveMentor(result.value);
                }
            });
        }

        function saveMentor(data) {
            Swal.fire({
                title: 'Menyimpan...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            fetch("{{ route('admin.createMentor') }}", {
                    method: "POST",
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    if (!res.ok) throw res;
                    return res.json();
                })
                .then(data => {
                    Swal.close();
                    Swal.fire('Berhasil!', data.message, 'success').then(() => location.reload());
                })
                .catch(async err => {
                    Swal.close();
                    if (err.status === 422) {
                        const errorData = await err.json();
                        Swal.fire('Gagal!', Object.values(errorData.errors).join('<br>'), 'error');
                    } else {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menyimpan data.', 'error');
                    }
                });
        }

        function showEditMentor(id, data) {
            const form = @json($form);
            const labelMap = Object.fromEntries(form.map(([label, _, name]) => [name, label]));

            let html = form.map(([label, type, name]) => {
                return `
            <div class="text-left m-3 flex flex-col gap-2">
                <label for="${name}" class="block text-base font-medium">${label}</label>
                <input type="${type}" id="${name}" class="form-control p-2 border rounded"
                       value="${data[name] ?? ''}" placeholder="${label}">
            </div>
        `;
            }).join('');

            html += `
        <div class="text-left m-3 flex flex-col gap-2">
            <label for="password" class="block text-sm font-medium">Password (opsional)</label>
            <input type="password" id="password" class="form-control p-2 border rounded" placeholder="Password baru jika ingin diganti">
        </div>
    `;

            Swal.fire({
                title: 'Edit Mentor',
                html: html,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                focusConfirm: false,
                preConfirm: () => {
                    const formData = {};
                    form.forEach(([_, __, name]) => {
                        formData[name] = document.getElementById(name).value.trim();
                    });
                    formData["password"] = document.getElementById("password").value.trim();

                    const kosong = Object.entries(formData).find(([key, val]) => !val && key !== 'password');
                    if (kosong) {
                        Swal.showValidationMessage(`Field "${labelMap[kosong[0]]}" harus diisi.`);
                        return false;
                    }

                    return formData;
                }
            }).then(result => {
                if (result.isConfirmed) {
                    updateMentor(id, result.value);
                }
            });
        }

        function updateMentor(id, data) {
            Swal.fire({
                title: 'Menyimpan...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            fetch(`/admin/mentor/${id}`, {
                    method: 'PUT',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    if (!res.ok) throw res;
                    return res.json();
                })
                .then(res => {
                    Swal.close();
                    Swal.fire('Berhasil!', res.message, 'success').then(() => location.reload());
                })
                .catch(async err => {
                    Swal.close();
                    if (err.status === 422) {
                        const errorData = await err.json();
                        Swal.fire('Gagal!', Object.values(errorData.errors).join('<br>'), 'error');
                    } else {
                        Swal.fire('Error!', 'Terjadi kesalahan saat memperbarui data.', 'error');
                    }
                });
        }

        function deleteMentor(id) {
            Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: "Data Mentor akan dihapus permanen!",
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

                    fetch(`/admin/mentor/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')
                                    .getAttribute(
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
