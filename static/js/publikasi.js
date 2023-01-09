$(".download_pub" ).on( 'click', function(){
    window.location.href = $(this).data('url');
});

$(".edit_pub" ).on( 'click', function(){
    var uuid = $(this).data('pub');
    var data = findData(uuid);

    $('#uuid_edit').val(data.uuid);
    $('#judul-edit').val(data.judul);
    $('#deskripsi-edit').val(data.deskripsi);
    $('#seksi-edit').val(data.seksi);
    $('#tanggal_terbit-edit').val(data.tanggal_terbit);
    $('#data_tahun-edit').val(data.data_tahun);
    $('#tags-edit').val(data.tag);
    $('#file-lama').attr("href", $(this).data('url'));
    
    $('#editPublikasi').modal();
});

$(".hapus_pub" ).on( 'click', function(){
    var uuid = $(this).data('pub');
    var data = findData(uuid);
    $('#uuid_hapus').val(uuid);
    $('#nama_hapus').text(data.judul);
    $('#hapusPublikasi').modal();
});

function findData(uuid){
    return publikasi_list.filter(item => item.uuid == uuid)[0];
}
