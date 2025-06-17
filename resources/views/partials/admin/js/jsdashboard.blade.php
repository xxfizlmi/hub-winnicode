<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    new Chart(document.getElementById('summaryChart'), {
        type: 'doughnut',
        data: {
            labels: {!! json_encode(array_column($total ?? [], 0)) !!},
            datasets: [{
                data: {!! json_encode(array_column($total ?? [], 1)) !!},
                backgroundColor: ['#14b8a6', '#60a5fa', '#facc15', '#f87171'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    fetch('/admin/weekly-summary')
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                document.getElementById('weeklyBarChart').replaceWith("Belum ada data absensi mingguan.");
                return;
            }

            new Chart(document.getElementById('weeklyBarChart'), {
                type: 'bar',
                data: {
                    labels: data.map(d => d.week),
                    datasets: [{
                            label: 'Hadir',
                            data: data.map(d => d.present),
                            backgroundColor: '#14b8a6'
                        },
                        {
                            label: 'Izin',
                            data: data.map(d => d.excused),
                            backgroundColor: '#60a5fa'
                        },
                        {
                            label: 'Sakit',
                            data: data.map(d => d.sick),
                            backgroundColor: '#facc15'
                        },
                        {
                            label: 'Alfa',
                            data: data.map(d => d.absent),
                            backgroundColor: '#f87171'
                        },
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} hari`
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            });
        })
        .catch(() => {
            document.getElementById('weeklyBarChart').replaceWith("Gagal memuat data.");
        });
</script>
