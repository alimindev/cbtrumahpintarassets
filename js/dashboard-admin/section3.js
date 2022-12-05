function formatNumber(param) {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(param)
}

$(document).ready(function () {
    if ($("#prosentase-omzet").length) {
        var omzetCanvas = document.getElementById("prosentase-omzet");

        var omzetData = {
            labels: [
                "Target",
                "Omzet",
            ],
            datasets: [
                {
                    data: [target_omzet, omzet],
                    backgroundColor: [
                        "#63FF84",
                        "#FF6384"
                    ]
                }]
        };

        var omzetDataOptions = {
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

        new Chart(omzetCanvas, {
            type: 'pie',
            data: omzetData,
            options: omzetDataOptions
        });
    }
})