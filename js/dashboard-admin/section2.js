let data_pendaftar_per_kelas = {
    kelas: ['1 SD', '2 SD', '3 SD', '1 SMP', '2 SMP', '3 SMP', '1 SMA', '2 SMA', '3 SMA'],
    jumlah_pendaftar: [10, 23, 14, 30, 24, 25, 70, 85, 33]
};

$(document).ready(function () {
    loadPendaftarPerKelas();
    
})

function loadPendaftarPerKelas()
{
    $.ajax({
        url: base_url + '/admin/dashboard/total_peserta_per_kelas',
        type : 'GET',
        data : {
            param : param,
        },
        success : function (response) {
            if ($("#marketingOverview").length) {
                var marketingOverviewChart = document.getElementById("marketingOverview").getContext('2d');
                var marketingOverviewData = {
                    labels: response.kelas,
                    datasets: [{
                        label: 'Jumlah Pendaftar',
                        data: response.jumlah_pendaftar,
                        backgroundColor: "#52CDFF",
                        borderColor: [
                            '#52CDFF',
                        ],
                        borderWidth: 0,
                        fill: true, // 3: no fill

                    }]
                };

                var marketingOverviewOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: true,
                                drawBorder: false,
                                color: "#F0F0F0",
                                zeroLineColor: '#F0F0F0',
                            },
                            ticks: {
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 5,
                                fontSize: 10,
                                color: "#6B778C"
                            }
                        }],
                        xAxes: [{
                            stacked: true,
                            barPercentage: 0.35,
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                beginAtZero: false,
                                autoSkip: true,
                                maxTicksLimit: 12,
                                fontSize: 10,
                                color: "#6B778C"
                            }
                        }],
                    },
                    legend: false,

                    elements: {
                        line: {
                            tension: 0.4,
                        }
                    },
                    tooltips: {
                        backgroundColor: 'rgba(31, 59, 179, 1)',
                    }
                }
                new Chart(marketingOverviewChart, {
                    type: 'bar',
                    data: marketingOverviewData,
                    options: marketingOverviewOptions
                });
            }
        }
    });
}