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
                            <td>No</td>
                            <td>Nama Mahasiswa</td>
                            <td>NIM</td>
                            <td>Instansi</td>
                            <td>Pembimbing</td>
                            <td>Aksi</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($td as $index => $a)
                            <tr class="unread">
                                <td>
                                    {{ $index + 1 }}
                                </td>
                                <td>
                                    {{ $a->user->name }}
                                </td>
                                <td>
                                    {{ $a->student_number }}
                                </td>
                                <td>
                                    {{ $a->company_name }}
                                </td>
                                <td>{{ optional($a->mentor?->user)->name ?? 'Belum ditugaskan' }}</td>
                                <td>
                                    <select id="mentor_{{ $a->id }}" onchange="assignment({{ $a->id }})"
                                        class="border p-1 rounded">
                                        <option value="">-- Pilih Pembimbing --</option>
                                        @foreach ($mentorOptions as $mentor)
                                            <option value="{{ $mentor['id'] }}">{{ $mentor['name'] }}</option>
                                        @endforeach
                                    </select>
                                </td>
                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
