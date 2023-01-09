var page = 1;
var pageAsli = 1;
var pageAll = 0;
var search = "";
var limit = 10;
var dataTemplate = null;
var docxUniqueID = ""
var simpeOrAdvance = '0';
var alreadyProcessPdf = false;

$(document).ready(function () {

    docxUniqueID = $('meta[name="_unique_id"]').attr('content');

    $('#smartwizard').on('click','.photoThumb',function () {
        $('.photoThumb').parent().removeClass('selected');
        $(this).parent().addClass('selected');
        kodeform = $(this).data('unique');
        var dataSelectedTemplate = dataTemplate.filter(function (el){
                return el['unique_text'] == kodeform;
            });
        //alert(dataSelectedTemplate[0]['paramater']);
        paramForm = JSON.parse(dataSelectedTemplate[0]['paramater']);
        if(kodeform != ""){
            $("#step2Header").removeClass('disabled');
            $("#step3Header").removeClass('disabled');
            $("#step4Header").removeClass('disabled');
            //alert (JSON.stringify(paramForm));
            loadParam();
        }
    });
    $('#smartwizard').on('click','.viewPdf',function () {
        //alert($(this).data('pdf'));
        $('#preview-pane').attr('src',$(this).data('pdf'));
        $('#myModal').modal();
        //alert($(this).data('pdf'));
    });
    $('#smartwizard').smartWizard({
        selected: 0,  // Initial selected step, 0 = first step 
        keyNavigation:true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
        autoAdjustHeight:true, // Automatically adjust content height
        cycleSteps: false, // Allows to cycle the navigation of steps
        backButtonSupport: true, // Enable the back button support
        useURLhash: true, // Enable selection of the step based on url hash
        lang: {  // Language variables
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
                $('<button></button>').text('Save')
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
        disabledSteps: [],    // Array Steps disabled
        errorSteps: [],    // Highlight step with errors
        theme: 'arrows',
        transitionEffect: 'fade', // Effect on navigation, none/slide/fade
        transitionSpeed: '400'
    });
    $("#finish").hide();
    $("#smartwizard").on("leaveStep", function(e, anchorObject, stepNumber, stepDirection) {
        // alert(stepNumber+'|'+stepDirection);
        if(stepNumber==1 && stepDirection=='forward' && !alreadyProcessPdf){
            if(alreadyProcessPdf){
                alreadyProcessPdf = false;
            }else{
                e.preventDefault();
                $("#step2Header").addClass('loading');
                $('#step-2').addClass('hidden');
                $('#step-1-load').removeClass('hidden');
            
                //$('#step-2-load').addClass('loader-inner').addClass('ball-scale-ripple-multiple');
                $('#step-1-load').addClass('loaderContainer').addClass('ball-scale-ripple-multiple');
                $('#step-1-load').addClass('loading');

                processDocument(function(e){
                    $('#preview-pane-pdf').attr('src',urlbase+"/document/pdf/"+docxUniqueID+".pdf");
                    alreadyProcessPdf = true;
                    $("#step2Header").removeClass('loading');
                    $('#step-2').removeClass('hidden');
                    $('#step-1-load').addClass('hidden');
        
                    //$('#step-2-load').addClass('loader-inner').addClass('ball-scale-ripple-multiple');
                    $('#step-1-load').removeClass('loaderContainer').removeClass('ball-scale-ripple-multiple');
                    $('#step-1-load').removeClass('loading');
                    $('.sw-btn-next').trigger( "click" );
                },function(e){
                    alreadyProcessPdf = false;
                    $("#step2Header").removeClass('loading');
                    $('#step-2').removeClass('hidden');
                    $('#step-1-load').addClass('hidden');
        
                    //$('#step-2-load').addClass('loader-inner').addClass('ball-scale-ripple-multiple');
                    $('#step-1-load').removeClass('loaderContainer').removeClass('ball-scale-ripple-multiple');
                    $('#step-1-load').removeClass('loading');
                });
                // for (var key in paramForm) {
                //     console.log(key+"|"+$("#"+key+"-advance").summernote('code'));
                // } 
            }
        }
        // if(stepNumber==1){
        //     $("#step-3").addClass('loading');
        // }
        
        // for(;;){

        // }
     });
    $("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
        if(stepNumber==3){
            $("#finish").show();
        }else{
            $("#finish").hide();
        }
        if(stepNumber==0){
            $("#step2Header").removeClass('done');
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');
            
            $("#step2Header").removeClass('disabled');
            $("#step3Header").removeClass('disabled');
            $("#step4Header").removeClass('disabled');

            paramForm = "";
            alreadyProcessPdf = false;
            getTemplateTrigger();
        }else if(stepNumber==1){
            alreadyProcessPdf = false;
            $("#step2Header").removeClass('done');
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');
        }else if(stepNumber==2){
            $("#step3Header").removeClass('done');
            $("#step4Header").removeClass('done');
        }else if(stepNumber==3){
            $("#step4Header").removeClass('done');
        }
    });
    $('#advance').hide();
    
    $('#toggle-event').change(function () {
        if ($(this).prop('checked')) {
            $('#simple').hide();
            $('#advance').show();
            simpeOrAdvance = '1';
        } else {
            $('#simple').show();
            $('#advance').hide();
            simpeOrAdvance = '0';
        }
    });
    $("#finish").on('click', function(){ 
        if(!$(this).hasClass("disabled")){
            saveDocument(function(data){
                window.location.href = urlbase+"/user/opendocument";
            },function(error){
                
            })     
        }                       
    });
    $("#cancelh").on('click', function(){ 
        window.location.href = urlbase+"/user/opendocument";             
    });

    if(kodeform==""){
        $("#step2Header").addClass('disabled');
        $("#step3Header").addClass('disabled');
        $("#step4Header").addClass('disabled');
        getTemplateTrigger();
    }else{
        $("#step1Header").addClass('disabled');
        $('.sw-btn-next').trigger( "click" );
        $("#step2Header").removeClass('disabled');
        $("#step3Header").removeClass('disabled');
        $("#step4Header").removeClass('disabled');
    }
});

function getTemplateTrigger(){
    $("#step1Header").addClass('loading');
    $('#step-1').addClass('hidden');
    $('#step-1-load').removeClass('hidden');

    //$('#step-2-load').addClass('loader-inner').addClass('ball-scale-ripple-multiple');
    $('#step-1-load').addClass('loaderContainer').addClass('ball-scale-ripple-multiple');
    $('#step-1-load').addClass('loading');

    getTemplate(document.getElementById("textSearchInside").value,
        document.getElementById("inputLimit").value, page,
        function () {
            $("#step1Header").removeClass('loading');
            $('#step-1').removeClass('hidden');
            $('#step-1-load').addClass('hidden');

            //$('#step-2-load').addClass('loader-inner').addClass('ball-scale-ripple-multiple');
            $('#step-1-load').removeClass('loaderContainer').removeClass('ball-scale-ripple-multiple');
            $('#step-1-load').removeClass('loading');

            $("#step2Header").addClass('disabled');
            $("#step3Header").addClass('disabled');
            $("#step4Header").addClass('disabled');
        });
}

function getTemplate(search, limit, pageS, callback) {
    $.ajax({
        url: urlbase+'/user/searchtemplate',
        type: 'POST',
        data: {search:search, limit:limit, page:pageS},
        //JQUERY CONVERT THE FILES ARRAYS INTO STRINGS.SO processData:false
        timeout: 100000,
        headers: {
            'X-CSRF-Token': $('meta[name="_token"]').attr('content')
        },
        success: function (data) {
            kodeform = "";
            dataTemplate = null;
            htmlTemplate(JSON.parse(data));
            pageAsli = page;
            $.notify({message: 'success to get template' },{type: 'success'});
            callback();
        },
        error: function (data) {
            //alert("E " + JSON.stringify(data));
            page = pageAsli;
            $.notify({message: 'fail to get template' },{type: 'danger'});
            callback();
        }
    });
}

function processDocument(callbackBagus, callbackGagal) {

    var paramHasilHasil = {};
    //paramForm = JSON.parse(paramForm);
    //tinyMCE.triggerSave();
    for (var key in paramForm) {
        if (paramForm.hasOwnProperty(key)) {
            if(simpeOrAdvance =='0'){
                paramHasilHasil[key] = document.getElementById(key+"-simple").value;
            }else if(simpeOrAdvance =="1" ){
                paramHasilHasil[key] = summerNoteCode($("#"+key+"-advance").summernote('code'));
            }
        }
    }
    console.log(JSON.stringify(paramHasilHasil));
    
    $.ajax({
        url: urlbase+'/user/processdocument',
        type: 'POST',
        data: {ppmsmdj38r93ids9dj92edjsicj93rjdwscszo0:JSON.stringify(paramHasilHasil),
            mkn2e0mddam7613ujsam111snkzxnmxxzc: docxUniqueID, 
            kdjiiywh8hfsndjsksno02ujs9d3yd7sg2dh : kodeform,
            do232dinxsiw2e9sxj92e7at6adsc34ty66 : simpeOrAdvance},
        //JQUERY CONVERT THE FILES ARRAYS INTO STRINGS.SO processData:false
        timeout: 100000,
        headers: {
            'X-CSRF-Token': $('meta[name="_token"]').attr('content')
        },
        success: function (data) {
            if(data=='1'){
                $.notify({message: 'success to process document' },{type: 'success'});
                callbackBagus();
            }else{
                $.notify({message: 'fail to process document' },{type: 'danger'});
                callbackGagal();
            }
        },
        error: function (data) {
            //alert("E " + JSON.stringify(data));
            $.notify({message: 'fail to process document' },{type: 'danger'});
            callbackGagal();
        }
    });
}

function htmlTemplate(data){
    var paging = [];
    if(data['pageAll']>0){
        var first = 1;
        var last = data['pageAll'];
        pageAll = data['pageAll'];
        if((page-5) > 0){
            first = page - 5;
            paging.push('...');
        }
        if((page+5) < data['pageAll']){
            last = page + 5;
        }else {
            last = data['pageAll'];
        }
        for (var ij = first; ij <= last; ij++) {
            paging.push(ij);
        }
        if (last !== data['pageAll']){
            paging.push('...');
        }

        var htmlBooxPage = "<ul class=\"pagination\"><li class=\"page-item item-nav\" data-seq=\""+(1)+"\">"
            +"<a class=\"page-link\" href=\"javascript:;\">First</a>"
            +"</li><li class=\"page-item item-nav\" data-seq=\""+(-5)+"\">"
            +"<a class=\"page-link\" href=\"javascript:;\">Previous</a>"
            +"</li>";
        for(var i=0; i<paging.length; i++){
            if(i==(page-1)){
                htmlBooxPage = htmlBooxPage + "<li class=\"page-item item-nav active\" data-seq=\""+paging[i]+"\">"
                    +"<a class=\"page-link\" href=\"javascript:;\">"+paging[i]+"</a>"
                    +"</li>";
            }else{
                htmlBooxPage = htmlBooxPage + "<li class=\"page-item item-nav\" data-seq=\""+paging[i]+"\">"
                    +"<a class=\"page-link\" href=\"javascript:;\">"+paging[i]+"</a>"
                    +"</li>";
            }
        }
        htmlBooxPage = htmlBooxPage + "<li class=\"page-item item-nav\" data-seq=\""+(-6)+"\">"
            +"<a class=\"page-link\" href=\"javascript:;\">Next</a>"
            +"</li><li class=\"page-item item-nav\" data-seq=\""+(data['pageAll'])+"\">"
            +"<a class=\"page-link\" href=\"javascript:;\">Last</a>"
            +"</li>"+"</ul>";
        document.getElementById("navPagination").innerHTML = htmlBooxPage;
    }else{
        document.getElementById("navPagination").innerHTML = "";
    }
    
    //alert("333");
    var htmlBoox = "";
    dataTemplate = data["dataK"];
    for(var i = 0; i < data["dataK"].length; i++){
        var item = data["dataK"][i];
        htmlBoox = htmlBoox + "<div class=\"col-sm-6 col-md-3\">"
            +"<div class=\"thumbnail\">"
                +"<img src=\""+urlbase+"/template/img/"+item['unique_text']+".png\" alt=\""+item['description']+"\" class=\"imageThumbNail photoThumb\" data-unique=\""+item['unique_text']+"\"  data-toggle=\"tooltip\" title=\"<img src='"+urlbase+"/template/img/"+item['unique_text']+".png'  width='420px' height='560px'/>\">"
                +"<div class=\"caption\">"
                    +"<h4>"+item['name']+"</h4>"
                    +"<a href=\"javascript:;\" class=\"btn btn-primary form-control viewPdf\" data-pdf=\""+urlbase+"/template/pdf/"+item['unique_text']+".pdf\" >View</a>"
                +"</div>"
            +"</div>"
        +"</div>";
    }
    document.getElementById("templateContent").innerHTML = htmlBoox;
}

function loadParam(){
    var simpleString = "<form class=\"form1\">";
    var advanceString = "<form class=\"form1\">";
    paramForm = JSON.parse(paramForm);
    for (var key in paramForm) {
        if (paramForm.hasOwnProperty(key)) {
            //console.log(key + " -> " + paramForm[key]);
            simpleString = simpleString + "<div class=\"form-group\">"
                +"<label>"+paramForm[key]+" :</label>"
                +"<input type=\"text\" class=\"form-control\" name=\""+key+"\" id=\""+key+"-simple\">"
                +"</div>";
            advanceString = advanceString + "<div class=\"form-group\">"
                +"<label>"+paramForm[key]+" :</label>"
                +"<div class=\"summernoteA\">"
                +"<textarea name=\""+key+"\" id=\""+key+"-advance\"></textarea>"
                +"</div>"
                +"</div>";
        }
    }
    simpleString = simpleString + "</form>";
    advanceString = advanceString + "</form>";

    document.getElementById("simple").innerHTML = simpleString;
    document.getElementById("advance").innerHTML = advanceString;
    for (var key in paramForm) {
        $("#"+key+"-advance").summernote({
            callbacks: {
                onEnter: function(e) {
                  e.preventDefault();
                },
            },
            disableDragAndDrop: true,
            toolbar:[
                ['font',['bold','italic','underline','clear','strikethrough']],
                ['fontsize', ['fontsize']],
                ['fontname',['fontname']],
                ['color',['color']],
                ['view',['fullscreen','codeview']],]
            });
    } 
    // tinymce.triggerSave();
    // intTiny();
}

function saveDocument(callbackBagus, callbackGagal){
    var paramHasilHasil = {};
    //paramForm = JSON.parse(paramForm);

    for (var key in paramForm) {
        if (paramForm.hasOwnProperty(key)) {
            if(simpeOrAdvance =='0'){
                paramHasilHasil[key] = document.getElementById(key+"-simple").value;
            }else if(simpeOrAdvance =="1" ){
                paramHasilHasil[key] = summerNoteCode($("#"+key+"-advance").summernote('code'));
            }
        }
    }
    
    $.ajax({
        url: urlbase+'/user/savedocument',
        type: 'POST',
        data: {ppmsmdj38r93ids9dj92edjsicj93rjdwscszo0:JSON.stringify(paramHasilHasil),
            mkn2e0mddam7613ujsam111snkzxnmxxzc: docxUniqueID, 
            kdjiiywh8hfsndjsksno02ujs9d3yd7sg2dh : kodeform,
            do232dinxsiw2e9sxj92e7at6adsc34ty66 : simpeOrAdvance,
            lslsdlaiqhbsy689jxscij813ehdbvacsappsxz : document.getElementById("lslsdlaiqhbsy689jxscij813ehdbvacsappsxz").value,
            mkmhgug8240fjjcxh8hu3sll2jxbuweo0ol7e2sd : document.getElementById("mkmhgug8240fjjcxh8hu3sll2jxbuweo0ol7e2sd").value},
        //JQUERY CONVERT THE FILES ARRAYS INTO STRINGS.SO processData:false
        timeout: 100000,
        headers: {
            'X-CSRF-Token': $('meta[name="_token"]').attr('content')
        },
        success: function (data) {
            $.notify({message: 'success to save document' },{type: 'success'});
            callbackBagus();
        },
        error: function (data) {
            //alert("E " + JSON.stringify(data));
            $.notify({message: 'fail to save document' },{type: 'danger'});
            callbackGagal();
        }
    });
}


$(document).ready(function () {
    $("#inputLimit" ).on( "change", function() {
        limit = this.value;
        //alert(limit);
        getTemplateTrigger();
    });
    $(".box-body" ).on( 'click', ".item-nav", function() {
        //alert($(this).data('seq'));
        if($(this).data('seq')=="..."){

        }else if($(this).data('seq')==-5){
            if(page != 1){
                page = page - 1;
                getTemplateTrigger(); 
            }
        }else if($(this).data('seq')==-6){
            if(page != pageAll){
                page = page + 1;
                getTemplateTrigger();
            }
        }else{
            if(page!=$(this).data('seq')){
                page = parseInt($(this).data('seq'));
                getTemplateTrigger();
            }
        }
    });
    $('#textSearchInside').keypress(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            getTemplateTrigger();
        }
    });
    $(document).tooltip({
        selector:".imageThumbNail",
        animated: 'fade',
        placement: 'right',
        html: true
    });
    if(simpeOrAdvance=='0'){
        $("#toggle-event").prop('checked',false);
    }else{
        $("#toggle-event").prop('checked',true);
    }

    if( $("#lslsdlaiqhbsy689jxscij813ehdbvacsappsxz").val() == ""  || $("#mkmhgug8240fjjcxh8hu3sll2jxbuweo0ol7e2sd").val() =="" ){
        $("#finish").removeClass("disabed");
        $("#finish").addClass("disabled");
    }else{
        $("#finish").removeClass("disabled");
    }
    $(".box-body" ).on( 'keyup', "#lslsdlaiqhbsy689jxscij813ehdbvacsappsxz, #mkmhgug8240fjjcxh8hu3sll2jxbuweo0ol7e2sd", function(){
        //alert("asasas");
        if( $("#lslsdlaiqhbsy689jxscij813ehdbvacsappsxz").val() == ""  || $("#mkmhgug8240fjjcxh8hu3sll2jxbuweo0ol7e2sd").val() =="" ){
            $("#finish").removeClass("disabed");
            $("#finish").addClass("disabled");
        }else{
            $("#finish").removeClass("disabled");
        }
    });
});

function summerNoteCode(codeNN){
    codeNN = codeNN.replace("<p><br></p>", "");
    codeNN = codeNN.replace("<br>", "");
    if(!codeNN.startsWith("<p>")){
        codeNN = "<p>"+codeNN+"</p>"
    }
    console.log(codeNN);
    return codeNN;
}
// function intTiny(){
//     tinymce.init({
//         selector: 'textarea',
//         height: 40,
//         theme: 'modern',
        
//         // force_p_newlines : false,
//         // force_br_newlines : false,
//         // forced_root_block : '', // Needed for 3.x
      
//         menubar:false,
//         statusbar: false,
//         plugins: 'colorpicker textcolor code',
//         toolbar1: 'fontselect fontsizeselect bold italic underline strikethrough forecolor | code',
//         fontsize_formats: '8pt 11pt 10pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt',
//         image_advtab: true,
//         setup : function(ed) {
//           ed.on('keydown', function(e) {
//               if (e.keyCode == 13) {
//                   e.preventDefault();
//               }
//           });
//         },
//         paste_retain_style_properties : "font-size, font-family, color, text-decoration",
//         content_css: [
//           '//https://fonts.googleapis.com/css?family=Times+New+Roman',
//           '/assets2/css/codepan.min.css'
//         ]
//        });
      
//       // $('textarea').on('keyup', function(){
//       //   $(this).val($(this).val().replace(/[\r\n\v]+/g, ''));
//       // });
      
// }

