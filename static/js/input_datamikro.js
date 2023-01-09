$(".download_data" ).on( 'click', function(){
    window.location.href = $(this).data('url');
});

$(".edit_data" ).on( 'click', function(){
    var uuid = $(this).data('uuid');
    var data = findData(uuid);

    $('#uuid_edit').val(data.uuid);
    $('#edit-data-nama').val(data.nama);
    $('#edit-data-deskripsi').val(data.deskripsi);
    $('#seksi-edit').val(data.seksi);
    $('#file-lama').attr("href", $(this).data('url'));
    
    $('#editDataMikro').modal();
});

$(".hapus_data" ).on( 'click', function(){
    var uuid = $(this).data('uuid');
    var data = findData(uuid);
    $('#uuid_hapus').val(uuid);
    $('#nama_hapus').text(data.nama);
    $('#hapusDataMikro').modal();
});

function findData(uuid){
    return data_list.filter(item => item.uuid == uuid)[0];
}
