<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
function editProfile() {
    Swal.fire({
        title: 'Edit Profil',
        html: `
            <input id="swal-name" class="swal2-input" placeholder="Nama" value="{{ $participant->name }}">
            <input id="swal-phone" class="swal2-input" placeholder="No HP" value="{{ $participant->phone }}">
            <input id="swal-institution" class="swal2-input" placeholder="Asal Institusi" value="{{ $participant->institution }}">
            <input id="swal-division" class="swal2-input" placeholder="Divisi" value="{{ $participant->division }}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const phone = document.getElementById('swal-phone').value;
            const institution = document.getElementById('swal-institution').value;
            const division = document.getElementById('swal-division').value;

            if (!name || !phone) {
                Swal.showValidationMessage('Nama dan No HP wajib diisi');
                return false;
            }

            return fetch(`{{ route('participant.updateProfileParticipant') }}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone, institution, division })
            }).then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Gagal update');
                return data;
            }).catch(err => {
                Swal.showValidationMessage(`Gagal: ${err.message}`);
            });
        }
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Tersimpan!', 'Profil berhasil diperbarui.', 'success').then(() => location.reload());
        }
    });
}
</script>
