let data_pendaftar = {
    tanggal: [],
    jumlah_pendaftar: []
};



$(document).ready(function () {

    $.ajax({
        url: base_url + '/admin/dashboard/trend-pendaftar-olimpiade',
        async : false,
        type: 'GET',
        data: {
            param: param
        },
        success: function (response) {
            $.each(response, function (key, value) {
                data_pendaftar['tanggal'].push(value.tanggal_mendaftar);
                data_pendaftar['jumlah_pendaftar'].push(parseInt(value.jumlah_peserta));
            })
            loadChart();
        }
    });

    setTotalPeserta();
})

function loadChart() {
    let ctx = document.getElementById("trend-pendaftar-olimpiade").getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data_pendaftar['tanggal'],
            datasets: [{
                label: 'Jumlah Pendaftar', // Name the series
                data: data_pendaftar['jumlah_pendaftar'], // Specify the data values array
                fill: false,
                borderColor: '#2196f3', // Add custom color border (Line)
                backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        autoSkip: true,
                        maxTicksLimit: 4,
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        }
    });
}

function setTotalPeserta()
{
    $.ajax({
        url: base_url + '/admin/dashboard/total_peserta',
        async : false,
        type: 'GET',
        data: {
            param: param
        },
        success: function (response) {
            console.log(response);
            $('#section1_total_peserta').text(response.total_peserta);
            $('#section1_total_mapel').text(response.total_mapel);
            $('#section3_mapel_lolos').text(response.mapel_lolos);
            $('#section3_mapel_tidak_lolos').text(response.mapel_tidak_lolos);
            let jumlah_mapel = response.jumlah_mapel+1;
            loadPesertaPerMapel(response.total_peserta_per_mapel, jumlah_mapel)
            loadPieChartMapelLolos(response.mapel_lolos, response.mapel_tidak_lolos)
        }
    });
}

function loadPesertaPerMapel(data_peserta_per_mapel, jumlah_mapel)
{
    if ($('.container-circle').length) {
        let html = "";
        $.each(data_peserta_per_mapel, function (index, value) {
            html += "<div class='col-sm-"+jumlah_mapel+"'>" +
                "<div class='box'>" +
                "<div class='chart-mapel' data-percent='" + value + "'></div><br>" +
                "<div class='centered-element'><p>" + value + "</p></div>" +
                "<h4>" + index + "</h4>" +
                "</div>" +
                "</div>";
        })
        $('.container-circle').append(html);

        $('.chart-mapel').easyPieChart({
            size: 100,
            barColor: "#36e617",
            scaleLength: 0,
            lineWidth: 15,
            trackColor: "#525151",
            lineCap: "circle",
            animate: 2000,
        });
    }
}

function loadPieChartMapelLolos(lolos,tidak_lolos)
{
    if ($("#prosentase-lolos-chart").length) {
        var oilCanvas = document.getElementById("prosentase-lolos-chart");

        var oilData = {
            labels: [
                "Lolos",
                "Tidak Lolos",
            ],
            datasets: [
                {
                    data: [lolos, tidak_lolos],
                    backgroundColor: [
                        "#63FF84",
                        "#FF6384"
                    ]
                }]
        };

        var oilDataOptions = {
            legend: {
                display: true,
                fontSize: true
            },
            plugins: {
                labels: {
                    render: 'value'
                }
            }
        }

        new Chart(oilCanvas, {
            type: 'pie',
            data: oilData,
            options: oilDataOptions
        });
    }
}