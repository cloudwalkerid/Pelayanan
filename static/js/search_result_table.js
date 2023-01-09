$(document).ready(function () {
    $('.salin_button').on('click',function(){
        var uuid = $(this).data('uuid');
        window.location.href = buat_tabel_URL+'?uuid='+uuid;
    });
    $('.run_button').on('click',function(){
        var uuid = $(this).data('uuid');
        window.location.href = hasilTabelURL+'?uuid='+uuid;
    });
    $('.download_button').on('click',function(){
        var uuid = $(this).data('uuid');
    });
    $('.delete_button').on('click',function(){
        var uuid = $(this).data('uuid');
        window.location.href = koleksi_tabel_URL+'?action=hapus&uuid='+uuid;
    });
});