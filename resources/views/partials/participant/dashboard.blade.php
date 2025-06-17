@php
    $labels = [
        'hadir' => 'Hadir',
        'izin' => 'Izin',
        'sakit' => 'Sakit',
        'alfa' => 'Alfa',
    ];
    $colors = [
        'hadir' => 'bg-green-100 text-green-800',
        'izin' => 'bg-yellow-100 text-yellow-800',
        'sakit' => 'bg-blue-100 text-blue-800',
        'alfa' => 'bg-red-100 text-red-800',
    ];

    $icons = [
        'hadir' => 'ti ti-check',
        'izin' => 'ti ti-alert-circle',
        'sakit' => 'ti ti-plus',
        'alfa' => 'ti ti-x',
    ];
    $statusMap = [
        'present' => 'Hadir',
        'excused' => 'Izin',
        'sick' => 'Sakit',
        'absent' => 'Alfa',
    ];
@endphp

<div class="grid grid-cols-12 gap-x-6">
    @foreach ($total as $key => $value)
        <div class="col-span-12 xl:col-span-4 md:col-span-6 ">
            <div class="card shadow-md hover:shadow-lg transition duration-300">
                <div class="card-header text-center !pb-0 !border-b-0">
                    <h5>{{ $labels[$key] }}</h5>
                </div>
                <div class="card-body text-center">
                    <div class="flex justify-center items-center gap-4">
                        <i class="{{ $icons[$key] }} text-4xl  {{ $colors[$key] }}"></i>
                        <h3 class="text-3xl font-bold">{{ $value }}</h3>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
</div>

