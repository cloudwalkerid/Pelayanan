$("#banyak_kjd").text(hasil.length);
$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        margin: 10,
        autoWidth: true,
        items: 4
    });
    $(".item-pub").hover(
        function () {
            $(this).find(".image_pub").removeAttr("style");
            $(this).find(".image_pub").attr("style", "width:12rem; opacity: 0.1;");
            $(this).find(".middle").removeAttr("style");
            $(this).find(".middle").attr("style", "opacity: 1;");
        },
        function () {
            $(this).find(".image_pub").removeAttr("style");
            $(this).find(".image_pub").attr("style", "width:12rem; opacity: 1;");
            $(this).find(".middle").removeAttr("style");
            $(this).find(".middle").attr("style", "opacity: 0;");
        }
    );
    $(".preview-image").on('click', function () {
        $('#imagepreview').attr('src', $(this).data('image'));
        if( hasil.filter(item => item['halaman_url'] == $(this).data('image')).length == 0){
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').data('halamanimage',$(this).data('image'));
            $('#add_from_preview').data('uuid',$(this).data('uuid'));
            $('#add_from_preview').data('halaman',$(this).data('halaman'));
        }else{
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').addClass('d-none');
        }

        var dataWillShow = data_hal.filter(item => item['halaman_image'] ==  $(this).data('image'))[0];

        if(dataWillShow['halaman_image'] == halaman_image_pertama){
            $('#preview_previous').removeClass('d-none');
            $('#preview_previous').addClass('d-none');
        }else{
            $('#preview_previous').removeClass('d-none');
        }

        if(dataWillShow['halaman_image'] == halaman_image_terakhir){
            $('#preview_next').removeClass('d-none');
            $('#preview_next').addClass('d-none');
        }else{
            $('#preview_next').removeClass('d-none');
        }

        $('#imagepreview').attr('src',dataWillShow['halaman_image']);
        $('#judul_review').text(dataWillShow['judul']);
        $('#halaman_review').text(dataWillShow['halaman']);

        $('#imagemodal').modal();
    });
    $("#preview_previous").on('click', function () {
        var nowImageShowing = $('#imagepreview').attr("src");
        var nowImageShowingIndex= 0;
        for (i=0; i<data_hal.length; i++ ){
            if(data_hal[i]['halaman_image'] == nowImageShowing){
                nowImageShowingIndex = i;
                break;
            }
        }

        var dataWillShow = data_hal[nowImageShowingIndex-1];

        if( hasil.filter(item => item['halaman_url'] == dataWillShow['halaman_image']).length == 0){
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').data('halamanimage', dataWillShow['halaman_image']);
            $('#add_from_preview').data('uuid', dataWillShow['uuid_publikasi']);
            $('#add_from_preview').data('halaman', dataWillShow['halaman']);
        }else{
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').addClass('d-none');
        }

        if(dataWillShow['halaman_image'] == halaman_image_pertama){
            $('#preview_previous').removeClass('d-none');
            $('#preview_previous').addClass('d-none');
        }else{
            $('#preview_previous').removeClass('d-none');
        }

        if(dataWillShow['halaman_image'] == halaman_image_terakhir){
            $('#preview_next').removeClass('d-none');
            $('#preview_next').addClass('d-none');
        }else{
            $('#preview_next').removeClass('d-none');
        }

        $('#imagepreview').attr('src',dataWillShow['halaman_image']);
        $('#judul_review').text(dataWillShow['judul']);
        $('#halaman_review').text(dataWillShow['halaman']);
    });
    $("#preview_next").on('click', function () {
        var nowImageShowing = $('#imagepreview').attr("src");
        var nowImageShowingIndex= 0;
        for (i=0; i<data_hal.length; i++ ){
            if(data_hal[i]['halaman_image'] == nowImageShowing){
                nowImageShowingIndex = i;
                break;
            }
        }

        var dataWillShow = data_hal[nowImageShowingIndex+1];

        if( hasil.filter(item => item['halaman_url'] == dataWillShow['halaman_image']).length == 0){
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').data('halamanimage', dataWillShow['halaman_image']);
            $('#add_from_preview').data('uuid', dataWillShow['uuid_publikasi']);
            $('#add_from_preview').data('halaman', dataWillShow['halaman']);
        }else{
            $('#add_from_preview').removeClass('d-none');
            $('#add_from_preview').addClass('d-none');
        }

        if(dataWillShow['halaman_image'] == halaman_image_pertama){
            $('#preview_previous').removeClass('d-none');
            $('#preview_previous').addClass('d-none');
        }else{
            $('#preview_previous').removeClass('d-none');
        }

        if(dataWillShow['halaman_image'] == halaman_image_terakhir){
            $('#preview_next').removeClass('d-none');
            $('#preview_next').addClass('d-none');
        }else{
            $('#preview_next').removeClass('d-none');
        }

        $('#imagepreview').attr('src',dataWillShow['halaman_image']);
        $('#judul_review').text(dataWillShow['judul']);
        $('#halaman_review').text(dataWillShow['halaman']);
    });
    $(".tambah_result").on('click', function () {
        var uuid = $(this).data('uuid');
        var halaman = $(this).data('halaman');
        var halamanImage = $(this).data('halamanimage');
        //alert(halamanImage);
        if( hasil.filter(item => item['halaman_url'] == halamanImage).length == 0){
            hasil.push({
                'uuid': uuid,
                'halaman': halaman,
                'halaman_url': halamanImage
            });
            $("#banyak_kjd").text(hasil.length);
            $('#add_from_preview').addClass('d-none');
        }else{
            $.notify({
                message: 'Sudah ada dalam kumpulan hasil'
            }, {
                type: 'danger'
            });
        }
    });
    $("#body_hasil_pdf").on('click', '.hapus_result',function () {
        //alert($(this).data('halamanimage'));
        var halamanImageDelete = $(this).data('halamanimage');
        hasil = hasil.filter(item => item['halaman_url'] != halamanImageDelete);
        var html = "";
        for (i = 0; i < hasil.length; i++) {
            html = '<div class="image_preview_result_body" style = "margin-top:10px;"><hr><img src="' + hasil[i]['halaman_url'] + '">'+
            '<hr><div class="upper_left">'+
            '<button type="reset" class="btn btn-danger btn-sm hapus_result" data-toggle="tooltip" data-placement="top"'+
                'title="Hapus hasil" data-halamanimage="'+ hasil[i]['halaman_url'] +'">'+
                '<i class="fas fa-trash-alt"></i>'+
            '</button>'+
            '</div></div>'+html;
        }
        $("#body_hasil_pdf").html(html);
        $("#banyak_kjd").text(hasil.length);
    });
});


$("#preview_hasil").on('click', function () {
    $("#body_hasil_pdf").html("");
    var html = "";
    for (i = 0; i < hasil.length; i++) {
        html = html + '<div class="image_preview_result_body" style = "margin-top:10px;"><hr><img src="' + hasil[i]['halaman_url'] + '">'+
            '<hr><div class="upper_left">'+
            '<button type="reset" class="btn btn-danger btn-sm hapus_result" data-toggle="tooltip" data-placement="top"'+
                'title="Hapus hasil" data-halamanimage="'+ hasil[i]['halaman_url'] +'">'+
                '<i class="fas fa-trash-alt"></i>'+
            '</button>'+
            '</div></div>';
    }
    $("#body_hasil_pdf").html(html);
    $("#privew_modal_hasil").modal();
});

$("#download_hasil").on('click', function () {
    getHasil(function (url) {
        window.location.href = url;
    }, function () {});
});

// berikutnya
$("#pub_previus_xx").on('click', function () {
    $('#pub_previus_xx_hasil').val(JSON.stringify(hasil));
    $('#pub_previus_xx_form').submit();
});
$("#pub_next_xx").on('click', function () {
    $('#pub_next_xx_hasil').val(JSON.stringify(hasil));
    $('#pub_next_xx_form').submit();
});
$("#hal_previus_xx").on('click', function () {
    $('#hal_previus_xx_hasil').val(JSON.stringify(hasil));
    $('#hal_previus_xx_form').submit();
});
$("#hal_next_xx").on('click', function () {
    $('#hal_next_xx_hasil').val(JSON.stringify(hasil));
    $('#hal_next_xx_form').submit();
});
// berikutnya



var token = jQuery("[name=csrfmiddlewaretoken]").val();
//alert(token);
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", token);
        }
    }
});


function getHasil(callbackBagus, callbackGagal) {
    if (hasil.length > 0) {
        // alert(token);
        //alert(urlCreteasil);
        $.ajax({
            type: 'POST',
            url: urlCreteasil,
            data: {
                'hasil': JSON.stringify(hasil)
            },
            timeout: 100000,
            success: function (data) {
                //alert(data);
                if (data != '0' && data != '1') {
                    $.notify({
                        message: 'Berhasil membuat dokumen hasil'
                    }, {
                        type: 'success'
                    });
                    callbackBagus(data);
                } else {
                    $.notify({
                        message: 'Gagal membuat dokumen hasil'
                    }, {
                        type: 'danger'
                    });
                    callbackGagal();
                }
            },
            error: function (data) {
                //alert("E " + JSON.stringify(data));
                $.notify({
                    message: 'Gagal membuat dokumen hasil'
                }, {
                    type: 'danger'
                });
                callbackGagal();
            }
        });

    } else {
        $.notify({
            message: 'Hasil harus lebih dari 0 halaman'
        }, {
            type: 'danger'
        });
    }
}
