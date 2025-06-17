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
</script>
