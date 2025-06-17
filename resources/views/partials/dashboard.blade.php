@if($notifCount > 0)
    <span class="badge">{{ $notifCount }}</span>
@endif


<div class="grid grid-cols-12 gap-x-6">
    @foreach ($total as $index => $i)
        <div class="col-span-12 xl:col-span-4 md:col-span-6">
            <div class="card shadow-md hover:shadow-lg transition duration-300">
                <div class="card-header text-center !pb-0 !border-b-0">
                    <h5>{{ $i[0] }}</h5>
                </div>
                <div class="card-body text-center">
                    <div class="flex justify-center items-center gap-4">
                        <i class="{{ $icons[$index] }} text-4xl text-teal-500"></i>
                        <h3 class="text-3xl font-bold">{{ $i[1] }}</h3>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
</div>


<div class="grid grid-cols-12 gap-x-6">
    <div class="col-span-12 xl:col-span-4 md:col-span-6">
        <div class="card p-6">
            <h5 class="text-center text-lg font-semibold mb-4">Visualisasi Ringkasan</h5>
            <canvas id="summaryChart" height="100"></canvas>
        </div>
    </div>

    <div class="col-span-12 xl:col-span-8 md:col-span-6">
        <div class="card p-6">
            <h5 class="text-center text-lg font-semibold mb-4">Grafik Kehadiran Mingguan</h5>
            <canvas id="weeklyBarChart" height="100"></canvas>
        </div>
    </div>
</div>

