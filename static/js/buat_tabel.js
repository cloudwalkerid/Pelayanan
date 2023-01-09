if (uuid_use_datasource != '') {
    getAllVar(function () {
        processVar();
        bisaLanjutSatu = true;
        $('.sw-btn-next').trigger("click");
    }, function () {

    });
}
$(document).ready(function () {
    $('#smartwizard').smartWizard({
        selected: 0, // Initial selected step, 0 = first step 
        keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
        autoAdjustHeight: true, // Automatically adjust content height
        cycleSteps: false, // Allows to cycle the navigation of steps
        backButtonSupport: true, // Enable the back button support
        useURLhash: true, // Enable selection of the step based on url hash
        lang: { // Language variables
            next: 'Next',
            previous: 'Previous'
        },
        toolbarSettings: {
            toolbarPosition: 'bottom', // none, top, bottom, both
            toolbarButtonPosition: 'right', // left, right
            showNextButton: true, // show/hide a Next button
            showPreviousButton: true, // show/hide a Previous button
            toolbarExtraButtons: [
                $('<button></button>').text('Cancel')
                .addClass('btn btn-danger')
                .attr('id', 'cancelh'),
                $('<button></button>').text('Simpan')
                .addClass('btn btn-info disabled')
                .attr('id', 'finish')
            ]
        },
        anchorSettings: {
            anchorClickable: true, // Enable/Disable anchor navigation
            enableAllAnchors: false, // Activates all anchors clickable all times
            markDoneStep: true, // add done css
            enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
        },
        contentURL: null, // content url, Enables Ajax content loading. can set as data data-content-url on anchor
        disabledSteps: [], // Array Steps disabled
        errorSteps: [], // Highlight step with errors
        theme: 'arrows',
        transitionEffect: 'fade', // Effect on navigation, none/slide/fade
        transitionSpeed: '400'
    });

    $("#smartwizard").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
        if (stepNumber == 0 && stepDirection == 'forward') {
            if (bisaLanjutSatu) {
                bisaLanjutSatu = false
            } else {
                e.preventDefault();
                getAllVar(function (data) {
                    allVar = JSON.parse(data);
                    processVar();
                    bisaLanjutSatu = true;
                    $('.sw-btn-next').trigger("click");
                }, function () {

                });
            }
        }else  if (stepNumber == 1 && stepDirection == 'forward') {
            if(rowCategory.length==0&columnCategory.length==0){
                e.preventDefault();
                alert('Colum dan baris minimal terisi satu');
            }
        }
    });
    $("#smartwizard").on("showStep", function (e, anchorObject, stepNumber, stepDirection) {
        if (stepNumber == 3) {
            $("#finish").show();
        } else {
            $("#finish").hide();
        }
        if (stepNumber == 0) {
            $("#step2Header").removeClass('done');
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');

            $("#step2Header").removeClass('disabled');
            $("#step3Header").removeClass('disabled');
            $("#step4Header").removeClass('disabled');
        } else if (stepNumber == 1) {
            alreadyProcessPdf = false;
            $("#step2Header").removeClass('done');
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');
        } else if (stepNumber == 2) {
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');
        } else if (stepNumber == 3) {
            $("#step4Header").removeClass('done');
        }
    });

    $('#smartwizard').smartWizard("reset"); 

    $('#finish').on('click', function(){
        //alert('Nama dan desk');
        if($('#nama-tabel').val()==''||$('#deskripsi-tabel').val()==''){
            alert('Nama dan deskripsi harus terisi');
        }else{
            saveTabel(function(uuid){
                window.location.href = hasilTabelURL+'?uuid='+uuid;
            }, function(){
    
            });
        }
    });
    
});

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

function getAllVar(callbackBagus, callbackGagal) {
    $.ajax({
        type: 'POST',
        url: urlGetListVar,
        data: {
            'uuid_source': $('#datasource').val()
        },
        timeout: 60000,
        success: function (data) {
            if (data != '0') {
                $.notify({
                    message: 'Berhasil mendapatkan variabel'
                }, {
                    type: 'success'
                });
                callbackBagus(data);
            } else {
                $.notify({
                    message: 'Gagal mendapatkan variabel'
                }, {
                    type: 'danger'
                });
                callbackGagal();
            }
        },
        error: function (data) {
            //alert("E " + JSON.stringify(data));
            $.notify({
                message: 'Gagal mendapatkan variabel'
            }, {
                type: 'danger'
            });
            callbackGagal();
        }
    });
}


function saveTabel(callbackBagus, callbackGagal) {
    $.ajax({
        type: 'POST',
        url: simpanTableURL,
        data: {
            'nama': $('#nama-tabel').val(),
            'deskripsi': $('#deskripsi-tabel').val(),
            'uuidDatasource': $('#datasource').val(),
            'weight': $('#weight').val(),
            'rowCategory': JSON.stringify(rowCategory),
            'columnCategory': JSON.stringify(columnCategory),
            'filters': JSON.stringify(filters),
            'values' : JSON.stringify(values)

        },
        timeout: 60000,
        success: function (data) {
            if (data != '0') {
                $.notify({
                    message: 'Berhasil menyimpan tabel'
                }, {
                    type: 'success'
                });
                callbackBagus(data);
            } else {
                $.notify({
                    message: 'Gagal menyimpan tabel'
                }, {
                    type: 'danger'
                });
                callbackGagal();
            }
        },
        error: function (data) {
            //alert("E " + JSON.stringify(data));
            $.notify({
                message: 'Gagal menyimpan tabel'
            }, {
                type: 'danger'
            });
            callbackGagal();
        }
    });
}


function processVar() {
    var uuidBaru = $('#datasource').val();
    $('#listVarAll').html('');
    $('.allVar').html('');
    $('#weight').append('<option value="">Tidak Ada</option>')
    for (var i = 0; i < allVar.length; i++) {
        $('#listVarAll').append('<li class="list-group-item drag-drop" data-namaVar="' + allVar[i]['nama'] +
            '" data-typeVar="' + allVar[i]['type'] + '" draggable="true"'+
            'ondragstart="drag(event, this)" >' + allVar[i]['nama'] + '</li>');
        $('.allVar').append('<option value="' + allVar[i]['nama'] + '">' + allVar[i]['nama'] + '</option>')
    }
}

$('#form_filter').submit(function (e) {
    //alert('masuk');
    e.preventDefault();
    addFilter($('#filter-variabel').val(), $('#filter-operasi').val(), $('#filter-pembanding').val());
    $('#tambahFilter').modal('hide');
    $('#filter-variabel').val('');
    $('#filter-operasi').val('');
    $('#filter-pembanding').val('');
});

$('#filterData').on('click', '.hapus_filter', function () {
    removeFilter($(this).data('id'));
});

function addFilter(namaVar, operasi, pembanding) {
    // alert(namaVar);
    // alert(operasi);
    // alert(pembanding);
    filters.push({
        'id': filters.length,
        'namaVar': namaVar,
        'operasi': operasi,
        'pembanding': pembanding
    });
    //alert(filters);
    refreshFilter();
}

function removeFilter(id) {
    filters = filters.filter(item => item['id'] != id);
    refreshFilter();
}

function refreshFilter() {
    $('#filterData').html('');
    for (var i = 0; i < filters.length; i++) {
        $('#filterData').append('<tr>' +
            '<th scope="row">' + (filters[i]['id'] + 1) + '</th>' +
            '<td>' + filters[i]['namaVar'] + '</td>' +
            '<td>' + filters[i]['operasi'] + '</td>' +
            '<td>' + filters[i]['pembanding'] + '</td>' +
            '<td><button class="btn btn-danger item hapus_filter" type="button"  data-toggle="tooltip" data-placement="top" title="Hapus" data-id="' + filters[i]['id'] + '">' +
            '<i class="zmdi zmdi-delete"></i>' +
            '</button></td>' +
            '</tr>')
    }
}

function allowDrop(ev, idAct) {
    ev.preventDefault();
}

function drag(ev, data) {
    //console.log(data.getAttribute("data-namaVar"));
    
    ev.dataTransfer.setData("namaVar", data.getAttribute("data-namaVar"));
    ev.dataTransfer.setData("typeVar", data.getAttribute("data-typeVar"));
}

function drop(ev, idAct, data) {
    ev.preventDefault();
    var namaVar = ev.dataTransfer.getData("namaVar");
    var typeVar = ev.dataTransfer.getData("typeVar");
    if(idAct==1){
        //column
        var uuidAct = 'c_'+guid();
        columnCategory.push({'namaVar' : namaVar, 'namaMask' : namaVar, 'typeVar': typeVar, 'uuid' : uuidAct, 'typeRecode' : 'none', 'kolom_type' : 'normal'});
        loadRecode_2(uuidAct);
    }else if(idAct == 2){
        //row
        var uuidAct = 'r_'+guid();
        rowCategory.push({'namaVar' : namaVar, 'namaMask' : namaVar, 'typeVar': typeVar, 'uuid' : uuidAct, 'typeRecode' : 'none', 'kolom_type' : 'normal'});
        loadRecode_2(uuidAct);
    }else if(idAct == 3){
        var uuidParent  = data.getAttribute('data-uuid');
        console.log(uuidParent);
        var uuidAct = guid();
        var isRow = findParent(rowCategory, uuidParent, typeVar, namaVar, 'r_', uuidAct);
        if(isRow){
            loadRecode_2('r_'+uuidAct);
            console.log(JSON.stringify(rowCategory));
        }
        var isColumn = findParent(columnCategory, uuidParent, typeVar, namaVar, 'c_', uuidAct);
        if(isColumn){
            loadRecode_2('c_'+uuidAct);
            console.log(JSON.stringify(columnCategory));
        }
    }else if(idAct==7){
        var uuidAct = 'v_'+guid();
        values.push({'operasi':'count', 'namaVar' : namaVar, 'namaMask' : namaVar, 'uuid':uuidAct});
    }
    redraw();
}

function findParent(listCategory, uuidParent, type, namaVar, typeUUID, uuidAct){
    for (var i=0; i<listCategory.length; i++){
        if(listCategory[i]['uuid']==uuidParent){
            if('childrens' in listCategory[i]){
                listCategory[i]['childrens'].push({'namaVar' : namaVar, 'namaMask' : namaVar, 'typeVar': type, 'uuid' : typeUUID+ uuidAct, 'typeRecode' : 'none'});
            }else{
                listCategory[i]['childrens'] = [];
                listCategory[i]['childrens'].push({'namaVar' : namaVar, 'namaMask' : namaVar, 'typeVar': type, 'uuid' : typeUUID+ uuidAct, 'typeRecode' : 'none'});
            }
            return true;
        }else{
            if('childrens' in listCategory[i]){
                nilai = findParent(listCategory[i]['childrens'], uuidParent, type, namaVar, typeUUID, uuidAct);
                if (nilai){
                    return true;
                }
            }
        }
    }
    return false;
}

function redraw(){
    $('#columnContainerDes').html('');
    $('#rowContainerDes').html('');
    if(columnCategory.length > 0){
        //console.log(JSON.stringify(columnCategory));
        $('#columnContainerDes').html('<div id="isiColumnCategory" style="height: '+(kedalamanList(columnCategory)*40)+'px">'+getHtmlCategoryColumn(columnCategory)+'</div>');
    }
    if(rowCategory.length >0 ){
        //console.log(JSON.stringify(rowCategory));
        //alert('<div style="width: '+(kedalamanList(rowCategory)*110)+'px">'+getHtmlCategoryRow(rowCategory)+'</div>');
        $('#rowContainerDes').html('<div id="isiRowCategory" style="width: '+(kedalamanList(rowCategory)*100)+'px">'+getHtmlCategoryRow(rowCategory)+'</div>');
    }
    if(values.length>0){
        $('#valueContainer').html('');
        for(var ival = 0; ival <values.length; ival++){
            if(values[ival]['operasi'] == 'count'){
                $('#valueContainer').append('<div class="p-2 bd-highlight" data-uuid="'+values[ival]['uuid']+'"  ondblclick="loadRecodeItemValue(this)">Hitung('+values[ival]['namaVar']+')</div>');
            }else if(values[ival]['operasi'] == 'sum'){
                $('#valueContainer').append('<div class="p-2 bd-highlight" data-uuid="'+values[ival]['uuid']+'"  ondblclick="loadRecodeItemValue(this)">Jumlah('+values[ival]['namaVar']+')</div>');
            }else if(values[ival]['operasi'] == 'average'){
                $('#valueContainer').append('<div class="p-2 bd-highlight" data-uuid="'+values[ival]['uuid']+'"  ondblclick="loadRecodeItemValue(this)">Rata-Rata('+values[ival]['namaVar']+')</div>');
            }
        }
    }else{
        $('#valueContainer').html('<p>Value</p>');
    }
    if(rowCategory.length>0 && columnCategory.length>0){
        //alert(80+ parseInt($('#rowContainerDes').width())+'px');
        $('#columnContainerDes').css({'margin-left':80+parseInt($('#isiisiRow').width())+'px'});
        $('#rowContainerDes').css({'margin-top':30+parseInt($('#isiisiColumn').height())+'px'});
    }
    if(values.length>0){
        $('#valueContainer').css({'margin-top':50+parseInt($('#isiisiColumn').height())+'px'
            ,'margin-left':100+parseInt($('#isiisiRow').width())+'px', 'height':(values.length*45)+'px'});
    }else{
        $('#valueContainer').css({'margin-top':50+parseInt($('#isiisiColumn').height())+'px'
            ,'margin-left':100+parseInt($('#isiisiRow').width())+'px', 'height':'50px'});
    }
}

function kedalamanList(listCategory){
    //console.log(JSON.stringify(listCategory));
    
    var terdalam = 0;
    if(listCategory.length>0){
        terdalam = 1;
    }
    for (var i=0; i<listCategory.length; i++){
        if('childrens' in listCategory[i]){
            var kedalamanDariItemChild  = kedalamanList(listCategory[i]['childrens']) +1;
            if(kedalamanDariItemChild>terdalam){
                terdalam = kedalamanDariItemChild;
            }
        }
    }
    return terdalam;
}

function getHtmlCategoryRow(listRow) {
    var html = '<div class="d-flex flex-column" id="isiisiRow">';
    for (var i = 0; i<listRow.length; i++){
        if('childrens' in listRow[i]){
            html = html + '<div class="p-2" style="border: 1px solid gray;">'+
                '<div class="d-flex flex-row">'+
                '<div class="p-2 center" style="border: 1px solid gray;margin: 0px" data-uuid="'+listRow[i]['uuid']+'" '+
                '  ondrop="drop(event, 3, this)" ondragover="allowDrop(event, 3)" ondblclick="loadRecode(this, 1)">'+listRow[i]['namaVar']+'</div>'+
                '<div class="p-2" style="margin: 0px">'+
                getHtmlCategoryRow(listRow[i]['childrens'])+
                '</div></div></div>';
        }else{
            html = html + '<div class="p-2" style="border: 1px solid gray;" data-uuid="'+listRow[i]['uuid']+'"'+
                ' ondrop="drop(event, 3, this)" ondragover="allowDrop(event, 3)" ondblclick="loadRecode(this, 1)">'+listRow[i]['namaVar']+'</div>';
        }
    }
    html = html +'</div>';
    return html;
}

function getHtmlCategoryColumn(listColumn) {
    var html = '<div class="d-flex flex-row" id="isiisiColumn">';
    for (var i = 0; i<listColumn.length; i++){
        if('childrens' in listColumn[i]){
            html = html + '<div class="p-2" style="border: 1px solid gray;">'+
                '<div class="d-flex flex-column">'+
                '<div class="p-2 center" style="border: 1px solid gray;margin: 0px" data-uuid="'+listColumn[i]['uuid']+'" '+
                '  ondrop="drop(event, 3, this)" ondragover="allowDrop(event, 3)" ondblclick="loadRecode(this, 2)">'+listColumn[i]['namaVar']+'</div>'+
                '<div class="p-2" style="margin: 0px">'+
                getHtmlCategoryColumn(listColumn[i]['childrens'])+
                '</div></div></div>';
        }else{
            html = html + '<div class="p-2" style="border: 1px solid gray;" data-uuid="'+listColumn[i]['uuid']+'"'+
                ' ondrop="drop(event, 3, this)" ondragover="allowDrop(event, 3)" ondblclick="loadRecode(this, 2)">'+listColumn[i]['namaVar']+'</div>';
        }
    }
    html = html +'</div>';
    return html;
}

$('#recode_type').on('change', function(){
    var recodeType = $('#recode_type').val();
    //alert(recodeType);
    $('#recode_items_string_items').html('');
    $('#recode_items_integer_items').html('');
    $('#recode_item_double_items').html('');
    if(recodeType=='none'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
    }else if(recodeType=='integer'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_items_integer').removeClass('d-none');
    }else if(recodeType=='double'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_item_double').removeClass('d-none');
    }else if(recodeType=='string'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_items_string').removeClass('d-none');
    }
});

function loadRecode_2(uuidAct){
    var dataRecode = findData(rowCategory,uuidAct);
    var topSelect = false;
    if(dataRecode==null){
        dataRecode = findData(columnCategory,uuidAct);
        for(var igh=0; igh<columnCategory.length; igh++){
            if(columnCategory[igh]['uuid']==uuidAct){
                topSelect = true;
            }
        }
    }else{
        for(var igh=0; igh<rowCategory.length; igh++){
            if(rowCategory[igh]['uuid']==uuidAct){
                topSelect = true;
            }
        }
    }
    if(topSelect){
        $('#kolom_type').val(dataRecode['kolom_type']).change();
        $('#onlyforTopSelect').removeClass('d-none');
    }else{
        $('#kolom_type').val('normal').change();
        $('#onlyforTopSelect').addClass('d-none');
    }
    //console.log(uuidAct);
    $('#rename_name_recode').val(dataRecode['namaMask']);
    $('#recode_type').val(dataRecode['typeRecode']).change();
        if(dataRecode['typeRecode']=='none'){
            $('#recode_items_integer').addClass('d-none');
            $('#recode_items_string').addClass('d-none');
            $('#recode_item_double').addClass('d-none');
        }else if(dataRecode['typeRecode']=='integer'){
            $('#recode_items_integer').addClass('d-none');
            $('#recode_items_string').addClass('d-none');
            $('#recode_item_double').addClass('d-none');
            $('#recode_items_integer').removeClass('d-none');
            $('#recode_items_integer_items').html('');
            if('itemsRecode' in dataRecode){
                for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                    $('#recode_items_integer_items').append('<tr>'+
                    '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah" value="'+dataRecode['itemsRecode'][ix]['bawah']+'"></td>'+
                    '<td nowrap> <= <span class="namaVariabelRecode">R102</span> <=</td>'+
                    '<td> <input type="number" class="form-control batas-atas" name="batas-atas" value="'+dataRecode['itemsRecode'][ix]['atas']+'"></td>'+
                    '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
                }
            }
        }else if(dataRecode['typeRecode']=='double'){
            $('#recode_items_integer').addClass('d-none');
            $('#recode_items_string').addClass('d-none');
            $('#recode_item_double').addClass('d-none');
            $('#recode_item_double').removeClass('d-none');
            $('#recode_item_double_items').html('');
            if('itemsRecode' in dataRecode){
                for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                    $('#recode_item_double_items').append('<tr>'+
                    '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah" value="'+dataRecode['itemsRecode'][ix]['bawah']+'"></td>'+
                    '<td nowrap> < <span class="namaVariabelRecode">R102</span> <=</td>'+
                    '<td> <input type="number" class="form-control batas-atas" name="batas-atas" value="'+dataRecode['itemsRecode'][ix]['atas']+'"></td>'+
                    '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
                }
            }
        }else if(dataRecode['typeRecode']=='string'){
            $('#recode_items_integer').addClass('d-none');
            $('#recode_items_string').addClass('d-none');
            $('#recode_item_double').addClass('d-none');
            $('#recode_items_string').removeClass('d-none');
            $('#recode_items_string_items').html('');
            if('itemsRecode' in dataRecode){
                for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                    for(var iy=0; iy<dataRecode['itemsRecode'][ix]['dari'].length; iy++){
                        $('#recode_items_string_items').append('<tr>'+
                        '<td> <input type="text" class="form-control dari" name="dari" value="'+dataRecode['itemsRecode'][ix]['dari'][iy]+'"></td>'+
                        '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                        '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                        '<i class="zmdi zmdi-delete"></i></button></td></tr>');
                    }
                }
            }
        }
    $('.namaVariabelRecode').html(dataRecode['namaVar']);
    $('#namaVariabelRecodeId').data('uuid', uuidAct);
    $('#recode_pop').modal();
}

function loadRecode(data, rowOrCol){
    var uuidAct = data.getAttribute("data-uuid");
    var dataRecode = findData(rowCategory,uuidAct);
    var topSelect = false;
    if(rowOrCol==1){
        dataRecode = findData(rowCategory,uuidAct);
        for(var igh=0; igh<rowCategory.length; igh++){
            if(rowCategory[igh]['uuid']==uuidAct){
                topSelect = true;
            }
        }
    }else if(rowOrCol==2){
        dataRecode = findData(columnCategory,uuidAct);
        for(var igh=0; igh<columnCategory.length; igh++){
            if(columnCategory[igh]['uuid']==uuidAct){
                topSelect = true;
            }
        }
    }

    if(topSelect){
        $('#kolom_type').val(dataRecode['kolom_type']).change();
        $('#onlyforTopSelect').removeClass('d-none');
    }else{
        $('#kolom_type').val('normal').change();
        $('#onlyforTopSelect').addClass('d-none');
    }
    
    $('#recode_type').val(dataRecode['typeRecode']).change();
    $('#rename_name_recode').val(dataRecode['namaMask']);
    if(dataRecode['typeRecode']=='none'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
    }else if(dataRecode['typeRecode']=='integer'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_items_integer').removeClass('d-none');
        $('#recode_items_integer_items').html('');
        if('itemsRecode' in dataRecode){
            for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                $('#recode_items_integer_items').append('<tr>'+
                '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah" value="'+dataRecode['itemsRecode'][ix]['bawah']+'"></td>'+
                '<td nowrap> <= <span class="namaVariabelRecode">R102</span> <=</td>'+
                '<td> <input type="number" class="form-control batas-atas" name="batas-atas" value="'+dataRecode['itemsRecode'][ix]['atas']+'"></td>'+
                '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                '<i class="zmdi zmdi-delete"></i></button></td></tr>');
            }
        }
    }else if(dataRecode['typeRecode']=='double'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_item_double').removeClass('d-none');
        $('#recode_item_double_items').html('');
        if('itemsRecode' in dataRecode){
            for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                $('#recode_item_double_items').append('<tr>'+
                '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah" value="'+dataRecode['itemsRecode'][ix]['bawah']+'"></td>'+
                '<td nowrap> < <span class="namaVariabelRecode">R102</span> <=</td>'+
                '<td> <input type="number" class="form-control batas-atas" name="batas-atas" value="'+dataRecode['itemsRecode'][ix]['atas']+'"></td>'+
                '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                '<i class="zmdi zmdi-delete"></i></button></td></tr>');
            }
        }
    }else if(dataRecode['typeRecode']=='string'){
        $('#recode_items_integer').addClass('d-none');
        $('#recode_items_string').addClass('d-none');
        $('#recode_item_double').addClass('d-none');
        $('#recode_items_string').removeClass('d-none');
        $('#recode_items_string_items').html('');
        if('itemsRecode' in dataRecode){
            for(var ix = 0; ix<dataRecode['itemsRecode'].length; ix++){
                for(var iy=0; iy<dataRecode['itemsRecode'][ix]['dari'].length; iy++){
                    $('#recode_items_string_items').append('<tr>'+
                    '<td> <input type="text" class="form-control dari" name="dari" value="'+dataRecode['itemsRecode'][ix]['dari'][iy]+'"></td>'+
                    '<td> <input type="text" class="form-control menjadi" name="menjadi" value="'+dataRecode['itemsRecode'][ix]['hasil']+'" required></td>'+
                    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
                    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
                }
            }
        }
    }
    $('.namaVariabelRecode').html(dataRecode['namaVar']);
    $('#namaVariabelRecodeId').data('uuid', uuidAct);
    $('#recode_pop').modal();
}
function loadRecodeItemValue(thisdata){
    var uuid = thisdata.getAttribute('data-uuid');
    var data = findData(values, uuid);
    $('#rename_name_recode_item_value').val(data['namaMask']);
    $('#operasi_item_value').val(data['operasi']).change();
    $('#namaVariabelRecodeValueId').text(data['namaVar']);
    $('#namaVariabelRecodeValueId').data('uuid', uuid);
    $('#recodeItemValuesPop').modal();
    
}
$('#form_recode_item_value').submit(function(e){
    e.preventDefault();
    var uuid =  $('#namaVariabelRecodeValueId').data('uuid');
    var namaMask = $('#rename_name_recode_item_value').val();
    var operasi = $('#operasi_item_value').val();
    var namaVar = $('#namaVariabelRecodeValueId').text();
    var valueBaru = {'operasi':operasi, 'namaVar' : namaVar, 'namaMask' : namaMask, 'uuid':uuid};
    findDataAndReplace(values,uuid, valueBaru);
    console.log(JSON.stringify(values));
    redraw();
    $('#recodeItemValuesPop').modal('hide');
});
$('#recode_pop').on('click','.deleteRow',function(){
    $(this).parents("tr").remove();
});

$('#add_recode_string').on('click', function(){
    $('#recode_items_string_items').append('<tr>'+
    '<td> <input type="text" class="form-control dari" name="dari"></td>'+
    '<td> <input type="text" class="form-control menjadi" name="menjadi" required></td>'+
    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
    $('.namaVariabelRecode').html($('#namaVariabelRecodeId').html());
});
$('#add_recode_integer').on('click', function(){
    $('#recode_items_integer_items').append('<tr>'+
    '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah"></td>'+
    '<td nowrap> <= <span class="namaVariabelRecode">R102</span> <=</td>'+
    '<td> <input type="number" class="form-control batas-atas" name="batas-atas"></td>'+
    '<td> <input type="text" class="form-control menjadi" name="menjadi" required></td>'+
    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
    $('.namaVariabelRecode').html($('#namaVariabelRecodeId').html());
});
$('#add_recode_double').on('click', function(){
    $('#recode_item_double_items').append('<tr>'+
    '<td> <input type="number" class="form-control batas-bawah" name="batas-bawah"></td>'+
    '<td nowrap> < <span class="namaVariabelRecode">R102</span> <=</td>'+
    '<td> <input type="number" class="form-control batas-atas" name="batas-atas"></td>'+
    '<td> <input type="text" class="form-control menjadi" name="menjadi" required></td>'+
    '<td class="d-flex justify-content-center"> <button type="button" class="btn btn-danger deleteRow">'+
    '<i class="zmdi zmdi-delete"></i></button></td></tr>');
    $('.namaVariabelRecode').html($('#namaVariabelRecodeId').html());
});
function findData(listCategory, uuid){
    for (var i=0; i<listCategory.length; i++){
        if(listCategory[i]['uuid']==uuid){
            return listCategory[i];
        }else{
            if('childrens' in listCategory[i]){
                nilai = findData(listCategory[i]['childrens'], uuid);
                if (nilai != null){
                    return nilai;
                }
            }
        }
    }
    return null;
}

function findDataAndReplace(listCategory, uuid, dataBaru){
    for (var i=0; i<listCategory.length; i++){
        if(listCategory[i]['uuid']==uuid){
            listCategory[i] = dataBaru;
            return true;
        }else{
            if('childrens' in listCategory[i]){
                nilai = findData(listCategory[i]['childrens'], uuid);
                if (nilai){
                    return true;
                }
            }
        }
    }
    return null;
}
$('#form_recode').submit(function (e) {
    //alert('masuk');
    e.preventDefault();
    var uuid = $('#namaVariabelRecodeId').data('uuid');
    var namaVar = $('#namaVariabelRecodeId').text();
    var namaMask = $('#rename_name_recode').val();
    var typeRecode = $('#recode_type').val();
    var error = false;
    var kodeError = 0;
    var itemsRecode = [];
    if(typeRecode == 'string'){
        var banyakLainnya = 0;
        $("#recode_items_string_items tr").each(function() {
            $this = $(this);
            var dariItem = $this.find(".dari").val();
            var jadi = $this.find(".menjadi").val();
            var ada = false;
            for (var ix=0; ix<itemsRecode.length; ix++){
                if(itemsRecode[ix]['hasil'] == jadi && dariItem!='' && itemsRecode[ix]['jenis']==1){
                    ada = true;
                    itemsRecode[ix]['dari'].push(dariItem);
                    break;
                }
            }
            if(!ada && dariItem!=''){
                baru = {'jenis':1, 'dari' : [] , 'hasil' : jadi};
                baru['dari'].push(dariItem);
                itemsRecode.push(baru);
            }else if(!ada && dariItem==''){
                baru = {'jenis':2, 'dari' : dariItem , 'hasil' : jadi};
                itemsRecode.push(baru);
            }
        });
        if(banyakLainnya>1){
            error = true;
            kodeError  = 1;
        }
    }else if(typeRecode == 'integer'){
        var banyakLainnya = 0;
        var banyakBatasAtasOnly = 0;
        var banyakBatasBawahOnly = 0;
        $("#recode_items_integer_items tr").each(function() {
            $this = $(this);
            var batas_bawah = $this.find(".batas-bawah").val();
            var batas_atas = $this.find(".batas-atas").val();
            var jadi = $this.find(".menjadi").val();
            if(batas_bawah == '' && batas_atas == ''){
                banyakLainnya = banyakLainnya+1;
                itemsRecode.push({'jenis':4, 'hasil':jadi});
            }else if(batas_atas == ''){
                banyakBatasBawahOnly = banyakBatasBawahOnly+1;
                itemsRecode.push({'jenis':3, 'bawah':batas_bawah, 'hasil':jadi});
            }else if(batas_bawah == ''){
                banyakBatasAtasOnly = banyakBatasAtasOnly+1;
                itemsRecode.push({'jenis':1, 'atas':batas_atas, 'hasil':jadi});
            }else{
                itemsRecode.push({'jenis':2, 'bawah':batas_bawah, 'atas':batas_atas, 'hasil':jadi});
            }
        });
        if(banyakLainnya>1){
            error = true;
            kodeError  = 1;
        }else if(banyakBatasAtasOnly>1){
            error = true;
            kodeError  = 2;
        }else if(banyakBatasBawahOnly>1){
            error = true;
            kodeError  = 3;
        }
    }else if(typeRecode == 'double'){
        var banyakLainnya = 0;
        var banyakBatasAtasOnly = 0;
        var banyakBatasBawahOnly = 0;
        $("#recode_item_double_items tr").each(function() {
            $this = $(this);
            var batas_bawah = $this.find(".batas-bawah").val();
            var batas_atas = $this.find(".batas-atas").val();
            var jadi = $this.find(".menjadi").val();
            if(batas_bawah == '' && batas_atas == ''){
                banyakLainnya = banyakLainnya+1;
                itemsRecode.push({'jenis':4, 'hasil':jadi});
            }else if(batas_atas == ''){
                banyakBatasBawahOnly = banyakBatasBawahOnly+1;
                itemsRecode.push({'jenis':3, 'bawah':batas_bawah, 'hasil':jadi});
            }else if(batas_bawah == ''){
                banyakBatasAtasOnly = banyakBatasAtasOnly+1;
                itemsRecode.push({'jenis':1, 'atas':batas_atas, 'hasil':jadi});
            }else{
                itemsRecode.push({'jenis':2, 'bawah':batas_bawah, 'atas':batas_atas, 'hasil':jadi});
            }
        });
        if(banyakLainnya>1){
            error = true;
            kodeError  = 1;
        }else if(banyakBatasAtasOnly>1){
            error = true;
            kodeError  = 2;
        }else if(banyakBatasBawahOnly>1){
            error = true;
            kodeError  = 3;
        } 
    }
    if(error){
        if(kodeError==1){
            alert ('lainnya hanya boleh 1 kali');
        }else if(kodeError==2){
            alert ('hanya batas atas hanya boleh 1 kali');
        }else if(kodeError==3){
            alert ('hanya batas bawah hanya boleh 1 kali');
        }else{
            alert ('terjadi kesalahan');   
        }
    }else{
        var topSelect = false;
        for(var igh=0; igh<rowCategory.length; igh++){
            if(uuid==rowCategory[igh]['uuid']){
                topSelect = true;
                break;
            }
        }
        if(!topSelect){
            for(var igh=0; igh<columnCategory.length; igh++){
                if(uuid==columnCategory[igh]['uuid']){
                    topSelect = true;
                    break;
                }
            }
        }
        if(topSelect){
            var data = {'namaVar' : namaVar, 'namaMask' : namaMask, 'uuid' : uuid, 'typeRecode' : typeRecode, 'itemsRecode':itemsRecode, 'kolom_type' : $('#kolom_type').val()};
            console.log(JSON.stringify(data));
            findDataAndReplace(rowCategory, uuid, data);
            console.log(JSON.stringify(rowCategory));
            findDataAndReplace(columnCategory, uuid, data);
            $('#recode_pop').modal('hide');
        }else{
            var data = {'namaVar' : namaVar, 'namaMask' : namaMask, 'uuid' : uuid, 'typeRecode' : typeRecode, 'itemsRecode':itemsRecode};
            console.log(JSON.stringify(data));
            findDataAndReplace(rowCategory, uuid, data);
            console.log(JSON.stringify(rowCategory));
            findDataAndReplace(columnCategory, uuid, data);
            $('#recode_pop').modal('hide');
        }
    }
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

$('#resetDesignButton').on('click', function(){
    rowCategory = [];
    columnCategory = [];
    values = [];
    redraw();
});