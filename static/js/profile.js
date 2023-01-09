$(document).ready(function () {
    $("#seksi-01" ).val('lainnya');
    $("#jabatan-01" ).val('ksk');
    $(".yess-opt").hide();
    $("#seksi-01" ).on( 'change', function(){
        if($("#seksi-01" ).val()=="lainnya"){
            $("#jabatan-01").find('option')
                .remove();
            $("#jabatan-01").append($("<option></option>")
                .attr("value","ksk")
                .attr("class","lainnya-opt")
                .text("KSK"));
            $("#jabatan-01").append($("<option></option>")
                .attr("value","kepala")
                .attr("class","lainnya-opt")
                .text("Kepala"));
        }else{
            $("#jabatan-01").find('option')
                .remove();
            $("#jabatan-01").append($("<option></option>")
                .attr("value","staf")
                .attr("class","yess-opt")
                .text("Staff"));
            $("#jabatan-01").append($("<option></option>")
                .attr("value","kasi")
                .attr("class","yess-opt")
                .text("KASI"));
        }
    });

    $("#type_password" ).on( 'change', function(){
        if($("#type_password" ).val()=="tidak"){
            $("#passwordWrapp").removeClass('d-none');
            $("#passwordWrapp").addClass('d-none');
            $("#passwordID").val('');
            $("#passwordID").prop('required',false);
        }else if($("#type_password" ).val()=="ya"){
            $("#passwordWrapp").removeClass('d-none');
            $("#passwordID").val('');
            $("#passwordID").prop('required',true);
        }
    });

    $("#usernameID" ).val(nama);
    $("#namaLengkapID" ).val(namaLengkap);
    $("#seksi-01" ).val(seksi).change();
    $("#jabatan-01" ).val(jabatan).change();
    $("#type_password").val('tidak').change();
});