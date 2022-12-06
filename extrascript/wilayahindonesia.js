$(document).ready(function () {
    $('body').on("change", "#id_provinsi", function () {
        var id_provinsi = $(this).val();
        var nama_provinsi = $(this).find("option:selected").text();
        $.ajax({
            type: 'GET',
            url: window.location.origin + '/registrasi/daerah?id_provinsi=' + id_provinsi,
            dataType: 'JSON',
            success: function (hasil) {
                var html = "<option value='all'>Pilih Kabupaten/Kota</option>";
                hasil.forEach(function (item, index) {
                    html += "<option value=" + item['kode'] + ">" + item['nama'] + "</option>";
                });
                $('#id_kabupaten').html(html);
            }
        });
        $('#nama_provinsi').val(nama_provinsi);

    });

    $('body').on("change", "#id_kabupaten", function () {
        var nama_kabupaten = $(this).find("option:selected").text();
        $('#nama_kabupaten').val(nama_kabupaten);
    });
});