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
});