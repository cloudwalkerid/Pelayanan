$(document).ready(function () {
    $('.ungguh_app').on('click', function(){
        var uuid = $(this).data('uuid');
        var nama = $(this).data('nama');
        $('.namaKegiatanAktive').text(nama);
        $('#uuid_kegiatan_update_aplikasi').val(uuid);
        $('#addNewVersiAplikasi').modal();
    });
    $('.unduh_app').on('click', function(){
        var url = $(this).data('url');
        window.location.href = url;
    });
    $('.ungguh_basisdata').on('click', function(){
        var uuid = $(this).data('uuid');
        var nama = $(this).data('nama');
        $('.namaKegiatanAktive').text(nama);
        $('#uuid_kegiatan_update_basis_data').val(uuid);
        $('#addNewBasisDataVersi').modal();
    });
    $('.unduh_basisdata').on('click', function(){
        var url = $(this).data('url');
        window.location.href = url;
    });
    $('.hapus_kegiatan').on('click', function(){
        var uuid = $(this).data('uuid');
        var nama = $(this).data('nama');
        $('.namaKegiatanAktive').text(nama);
        $('#delete_kegiatan_uuid').val(uuid);
        $('#hapusKegiatanModal').modal();
    });
});