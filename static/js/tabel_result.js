var rowCategoryProcess = [];
var columnCategoryProcess = [];
var jsonTable = hasilTabel['jsonTable'];
var value = [];
var hasil = hasilTabel['result'];
var total = [];
var totalFirst = [];
var totalAll = [];
var rowPercentage = [];
var columnPercentage = [];
var defaultNameVal = 'v_aaaaaaaaabbbbbbbbb';
var dictionaryKey = [];
prosesAll();

$('#namaTable').text(jsonTable['nama']);

function jumlah(category, uuid){
    var hasil = 0;
    for(var ax=0; ax<category.length; ax++){
        hasil = hasil +category[uuid];
    }
    return hasil;
}

function processCategory(listCategory, berapaKali){
    var maxCategory = 0;
    for (var i=0; i<listCategory.length; i++){
        if(listCategory[i]['typeRecode'] != 'none'){
            listCategory[i]['jadiList'] = [];
            for(var j=0; j<listCategory[i]['itemsRecode'].length; j++){
                //console.log(listCategory[i]['itemsRecode'][j]);
                listCategory[i]['jadiList'].push(listCategory[i]['itemsRecode'][j]['hasil']);
            }
        }else{
            console.log("masuk 22");
            listCategory[i]['jadiList'] = [];
            for(var j=0; j<hasil.length; j++){
                for(var m=0; m<hasil[j].length; m++){
                    var ada = false;
                    for(var k=0; k<listCategory[i]['jadiList'].length; k++){
                        if(listCategory[i]['jadiList'][k]==hasil[j][m][listCategory[i]['uuid']]){
                            ada = true;
                            break;
                        }
                    }
                    if(!ada){
                        listCategory[i]['jadiList'].push(hasil[j][m][listCategory[i]['uuid']]);
                    }
                }
            }
        }

        var banyakForItemCategory = listCategory[i]['jadiList'].length;

        var baruDictionar = [];
        baruDictionar.push(listCategory[i]['uuid']); 
        baruDictionar.push(listCategory[i]['namaMask']); 
        dictionaryKey.push(baruDictionar);

        if('childrens' in listCategory[i]){
            var maxChildBanyakItem = processCategory(listCategory[i]['childrens'], banyakForItemCategory*berapaKali);
            listCategory[i]['panjangCategory'] = banyakForItemCategory*maxChildBanyakItem ;
            listCategory[i]['panjangItem'] = maxChildBanyakItem ;
            listCategory[i]['pengulangan'] = berapaKali;
            maxCategory = maxCategory + (banyakForItemCategory*maxChildBanyakItem);
        }else{
            listCategory[i]['panjangCategory'] = banyakForItemCategory;
            listCategory[i]['panjangItem'] = 1;
            listCategory[i]['pengulangan'] = berapaKali;
            maxCategory = maxCategory + banyakForItemCategory;
        }
    }
    return maxCategory;
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

function prosesTotalAll(){
    for(var ix=0; ix<hasil.length; ix++){
        if('values' in jsonTable){
            var itemRowTotalAbc = {};
            for(var ick=0; ick<jsonTable['values'].length; ixk++){
                itemRowTotalAbc[jsonTable['values'][ick]['uuid']] = 0;
            }
            for(var ixx=0; ixx<hasil[ix].length;ixx++){
                for(var ick=0; ick<jsonTable['values'].length; ixk++){
                    itemRowTotalAbc[jsonTable['values'][ick]['uuid']] = itemRowTotalAbc[jsonTable['values'][ick]['uuid']] 
                        + hasil[ix][ixx][jsonTable['values'][ick]['uuid']];
                }
            }   
            totalAll[ix]=itemRowTotalAbc;
        }else{
            var itemRowTotalAbc = 0;
            for(var ixx=0; ixx<hasil[ix].length;ixx++){
                itemRowTotalAbc = itemRowTotalAbc + hasil[ix][ixx][defaultNameVal];
            }   
            totalAll[ix]=itemRowTotalAbc;
        }
    }
}

function processPercentage(){
    for(var ix=0; ix<hasil.length; ix++){
        var uuid_percetage = '';
        Object.keys(hasil[ix][0]).forEach(function(key) {
            var isPercentageUuid = isPercentage(jsonTable['rowCategory'], key);
            if(!isPercentageUuid){
                isPercentageUuid = isPercentage(jsonTable['columnCategory'], key);
            } 
            if(isPercentageUuid){
                uuid_percetage = key;
            }
        });
        if(uuid_percetage != ''){
            for(var ixx=0; ixx<hasil[ix].length; ixx++){
                var totatlFirstHaha = getFirstTotalCorrespond(ix, uuid_percetage, hasil[ix][ixx][uuid_percetage]);
                if('values' in jsonTable){
                    Object.keys(hasil[ix][ixx]).forEach(function(key) {
                        if(key.startsWith('v_')){
                            hasil[ix][ixx][defaultNameVal] = (hasil[ix][ixx][key]/totatlFirstHaha[key] *100);
                        }
                    });
                }else{
                    hasil[ix][ixx][defaultNameVal] = (hasil[ix][ixx][defaultNameVal]/totatlFirstHaha[defaultNameVal] *100); 
                }
            }
            for (var gh=0; gh<total[ix].length; gh++){
                if(uuid_percetage in total[ix][gh]){
                    var totatlFirstHaha = getFirstTotalCorrespond(ix, uuid_percetage, total[ix][gh][uuid_percetage]);
                    //console.log(totatlFirstHaha);
                    if('values' in jsonTable){
                        Object.keys(total[ix][gh]).forEach(function(key) {
                            if(key.startsWith('v_')){
                                total[ix][gh][key] = (total[ix][gh][key]/totatlFirstHaha[key] *100);
                            }
                        });
                    }else{
                        total[ix][gh][defaultNameVal] = (total[ix][gh][defaultNameVal]/totatlFirstHaha[defaultNameVal]*100); 
                    }
                }else{
                    if('values' in jsonTable){
                        Object.keys(total[ix][gh]).forEach(function(key) {
                            if(key.startsWith('v_')){
                                total[ix][gh][key] = (total[ix][gh][key]/totalAll[ix][key]*100);
                            }
                        });
                    }else{
                        total[ix][gh][defaultNameVal] = (total[ix][gh][defaultNameVal]/totalAll[ix]*100); 
                    }
                }
            }
        }
    }
}

function getFirstTotalCorrespond(index,category, categoryHasil){
    for(var idg=0; idg<totalFirst[index].length; idg++){
        if(category in totalFirst[index][idg]){
            if(totalFirst[index][idg][category] == categoryHasil){
                return totalFirst[index][idg];
            }
        }
    }
}

function isPercentage(listCategory, kolom_uuid){
    for(var ihk=0; ihk<listCategory.length; ihk++){
        if(listCategory[ihk]['kolom_type']=='percentage' && listCategory[ihk]['uuid']==kolom_uuid){
            return true;
        }
    }
    return false;
}

function prosesTotal(){
    for(var ix=0; ix<hasil.length; ix++){
        //console.log(hasil[ix]);
        prosesTotalMakeAtribute(ix, hasil[ix]);
        //console.log(JSON.stringify(total[ix]));
        for(var ixx = 0; ixx<hasil[ix].length; ixx++){
            for(var ixk=0; ixk<total[ix].length; ixk++){
                var masuk = true;
                Object.keys(total[ix][ixk]).forEach(function(key) {
                    if(!key.startsWith('v_')){
                        if(total[ix][ixk][key] != hasil[ix][ixx][key]){
                            masuk = false;
                        }
                    }
                });
                if(masuk){
                    if('values' in jsonTable){
                        for(var iik=0; iik<jsonTable['values'].length; iik){
                            if(jsonTable['values']['uuid'] in total[ix][ixk]){
                                total[ix][ixk][jsonTable['values']['uuid']] = total[ix][ixk][jsonTable['values']['uuid']] 
                                    +hasil[ix][ixx][jsonTable['values']['uuid']]; 
                            }else{
                                total[ix][ixk][jsonTable['values']['uuid']] = hasil[ix][ixx][jsonTable['values']['uuid']]; 
                            }
                        }
                    }else{
                        if(defaultNameVal in total[ix][ixk]){
                            total[ix][ixk][defaultNameVal] = total[ix][ixk][defaultNameVal] 
                                +hasil[ix][ixx][defaultNameVal]; 
                        }else{
                            total[ix][ixk][defaultNameVal] = hasil[ix][ixx][defaultNameVal]; 
                        }
                    }
                }
            }
            //console.log(totalFirst);
            for(var ixk=0; ixk<totalFirst[ix].length; ixk++){
                //console.log('masuk'+totalFirst[ix].length+'|'+ixk);
                var masuk = true;
                Object.keys(totalFirst[ix][ixk]).forEach(function(key) {
                    if(!key.startsWith('v_')){
                        if(totalFirst[ix][ixk][key] != hasil[ix][ixx][key]){
                            masuk = false;
                        }
                    }
                });
                if(masuk){
                    if('values' in jsonTable){
                        for(var iik=0; iik<jsonTable['values'].length; iik){
                            if(jsonTable['values']['uuid'] in totalFirst[ix][ixk]){
                                totalFirst[ix][ixk][jsonTable['values']['uuid']] = totalFirst[ix][ixk][jsonTable['values']['uuid']] 
                                    +hasil[ix][ixx][jsonTable['values']['uuid']]; 
                            }else{
                                totalFirst[ix][ixk][jsonTable['values']['uuid']] = hasil[ix][ixx][jsonTable['values']['uuid']]; 
                            }
                        }
                    }else{
                        if(defaultNameVal in totalFirst[ix][ixk]){
                            totalFirst[ix][ixk][defaultNameVal] = totalFirst[ix][ixk][defaultNameVal] 
                                +hasil[ix][ixx][defaultNameVal]; 
                        }else{
                            totalFirst[ix][ixk][defaultNameVal] = hasil[ix][ixx][defaultNameVal]; 
                        }
                    }
                }
            }
        }
        //console.log(JSON.stringify(total[ix]));
    }
}

function prosesTotalMakeAtribute(indexHasil,hasilItem){
    if(hasilItem.length==0){
        return;
    }
    var hasilSementara = [];
    var hasilSementaraFirst = [];
    Object.keys(hasilItem[0]).forEach(function(key) {
        var data = findData(jsonTable['rowCategory'], key);
        if( data==null){
            data = findData(jsonTable['columnCategory'], key);
        }
        if(data!=null){
            var baruLIst = [];
            for(var ih=0; ih<hasilSementara.length;ih++){
                for(var igk=0; igk<data['jadiList'].length; igk++){
                    var baru = JSON.parse(JSON.stringify(hasilSementara[ih]));
                    baru [key] = data['jadiList'][igk];
                    //console.log(JSON.stringify(baru));
                    baruLIst.push(baru);
                }
            }
            if(baruLIst.length>0){
                for (var igg=0; igg<baruLIst.length; igg++){
                    hasilSementara.push(baruLIst[igg]);
                }
            }
            for(var igk=0; igk<data['jadiList'].length; igk++){
                var baru = {};
                baru [key] = data['jadiList'][igk];
                //console.log(JSON.stringify(baru));
                hasilSementara.push(baru);

                var baruA = {};
                baruA [key] = data['jadiList'][igk];
                hasilSementaraFirst.push(baruA);
            }
        }
    });
    //console.log(JSON.stringify(hasilSementara));
    total[indexHasil] = hasilSementara;
    totalFirst[indexHasil] = hasilSementaraFirst;
}

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



function prosesItemPercentage(jsonHasilItem, category){
    for(var ix=0; ix<category['jadiList'].length; ix++){

    }
    listCategory[i]['jadiList']
}


function prosesAll(){
    var jumlahRow = processCategory(jsonTable['rowCategory'], 1);
    var JumlahKolom = processCategory(jsonTable['columnCategory'], 1);
    console.log(jsonTable);
    //console.log(hasil);
    prosesTotalAll();
    prosesTotal();
    //console.log(JSON.stringify(totalFirst));
    processPercentage();
    // console.log(JSON.stringify(hasil));
    // console.log(JSON.stringify(total));
    $('#table_hasil').html('');
    var html='';

    var panjangKolomAwal = kedalamanList(jsonTable['columnCategory']);
    var panjangBarisAwal = kedalamanList(jsonTable['rowCategory']);

    if(jsonTable['rowCategory'].length>0 && jsonTable['columnCategory'].length==0){
        var head = '<tr><td rowspan="2" colspan="'+(panjangBarisAwal*2)+'">';
        for(var iyu=0; iyu<jsonTable['columnCategory'].length; iyu++){
            if('values' in jsonTable){
                returnHtml = '<tr><td rowspan="2" colspan="'+(panjangBarisAwal*2)+'">';
                var valuesHtml = '';
                for(var igg=0; igg<jsonTable['values'].length; igg){
                    valuesHtml = valuesHtml +'<td>'+jsonTable['values'][igg]['namaMask']+'</td>'
                }
                returnHtml = returnHtml +'<tr><td rowspan="2" colspan="'+(panjangBarisAwal*2)+'"><td colspan="'+jsonTable['values'].length+'">Nilai</td></tr><tr>'+
                    valuesHtml+'</tr>';
                
            }
        }
        html = html + head;
        var isiArr = [];
        prosesIsi([],isiArr,jsonTable['rowCategory'], [], 1, 1, panjangBarisAwal,1 );
        var isi='';
        for(var gdf=0; gdf<isiArr.length; gdf++){
            isi = isi +'<tr>'+isiArr[gdf]+'</tr>';
        }
        html = html + isi;   

    }else if(jsonTable['rowCategory'].length==0 && jsonTable['columnCategory'].length>0){
        var head = '';
        var headArr = prosesHead(jsonTable['columnCategory'], panjangKolomAwal, 1);
        for(var ity=0; ity<headArr.length; ity++){
            head = head +'<tr>'+headArr[ity]+'</tr>';
        }
        html = html + head;

        var isiArr = [];
        prosesIsi([],isiArr,jsonTable['rowCategory'], [], 1, 2, panjangBarisAwal,1 );
        var isi='';
        for(var gdf=0; gdf<isiArr.length; gdf++){
            isi = isi +'<tr>'+isiArr[gdf]+'</tr>';
        }
        html = html + isi;   
    }else{
        var head = '';
        var headArr = prosesHead(jsonTable['columnCategory'], panjangKolomAwal, 1);
        //console.log(headArr);
        for(var ity=0; ity<headArr.length; ity++){
            if(ity==0){
                head = head +'<tr> <th colspan="'+(panjangBarisAwal*2)+'" rowspan="'+(headArr.length)
                    +'"></th>'+headArr[ity]+'</tr>';
            }else{
                head = head +'<tr>'+headArr[ity]+'</tr>';
            }
        }
        //console.log(head);
        html = html + head;
        //console.log(html);
        var isiArr = [];
        prosesIsi([],isiArr,jsonTable['rowCategory'], [], 1, 3, panjangBarisAwal,1 );
        //console.log(isiArr);
        var isi='';
        for(var gdf=0; gdf<isiArr.length; gdf++){
            isi = isi +'<tr>'+isiArr[gdf]+'</tr>';
        }
        html = html + isi;   
    }       

    $('#table_hasil').html('<table>'+html+'</table>');
}
function prosesIsi(hasilAwal,hasilIsi, categoryList, category, rowOrCol, type, panjangKolomAwal, panjangSekarang){
    if(type==1){
        for (var ifh=0; ifh<categoryList.length; ifh++){
            for(var ifi=0; ifi<categoryList[ifh]['jadiList'].length; ifi++){
                var categoryBaru = JSON.parse(JSON.stringify(category));
                var barugh = [];
                barugh.push(categoryList[ifh]['uuid'],categoryList[ifh]['jadiList'][ifi]
                    ,categoryList[ifh]['panjangCategory'],categoryList[ifh]['panjangItem']);
                categoryBaru.push(barugh);
                var hasilAwalThis = JSON.parse(JSON.stringify(hasilAwal));

                if('childrens' in categoryList[ifh]){
                    if(ifi==0){
                        hasilAwalThis.push('<td rowspan="'+categoryList[ifh]['panjangCategory']+'">'+categoryList[ifh]['namaMask']
                            +'</td><td rowspan="'+categoryList[ifh]['panjangItem']+'">'+categoryList[ifh]['jadiList'][ifi]+'</td>');
                    }else{
                        hasilAwalThis.push('<td rowspan="'+categoryList[ifh]['panjangItem']+'">'+categoryList[ifh]['jadiList'][ifi]+'</td>');
                    }

                    for(var idd=0; idd<categoryList[ifh]['childrens'].length; idd++){
                        prosesIsi(hasilAwalThis,hasilIsi, categoryList[ifh]['childrens'][idd], categoryBaru, rowOrCol, type, panjangKolomAwal, panjangSekarang+1);
                    }
                }else{
                    var panjangSeharusnyaH = panjangKolomAwal-panjangSekarang +1;
                    if(ifi==0){
                        hasilAwalThis.push('<td rowspan="'+categoryList[ifh]['panjangCategory']+'">'+categoryList[ifh]['namaMask']
                            +'</td><td rowspan="'+categoryList[ifh]['panjangItem']+'" colspan="'+panjangSeharusnyaH+'">'+categoryList[ifh]['jadiList'][ifi]+'</td>');
                    }else{
                        hasilAwalThis.push('<td rowspan="'+categoryList[ifh]['panjangItem']+'" colspan="'+panjangSeharusnyaH+'">'+categoryList[ifh]['jadiList'][ifi]+'</td>');
                    }
                    var nilai = '';
                    for (var mssa=0; mssa<hasilAwalThis.length; mssa++){
                        nilai = nilai + hasilAwalThis[mssa];
                    }
                    hasilIsi.push(nilai+getValue1(categoryBaru));
                }
            }
        }
    }else if(type==2){
        for (var ifh=0; ifh<categoryList.length; ifh++){
            for(var ifi=0; ifi<categoryList[ifh]['jadiList'].length; ifi++){
                var categoryBaru = JSON.parse(JSON.stringify(category));
                var barugh = [];
                barugh.push(categoryList[ifh]['uuid'],categoryList[ifh]['jadiList'][ifi]
                    ,categoryList[ifh]['panjangCategory'],categoryList[ifh]['panjangItem']);
                categoryBaru.push(barugh);
                var hasilAwalThis = JSON.parse(JSON.stringify(hasilAwal));
                if('childrens' in categoryList[ifh]){
                    for(var idd=0; idd<categoryList[ifh]['childrens'].length; idd++){
                        prosesIsi(hasilAwalThis,hasilIsi, categoryList[ifh]['childrens'][idd], categoryBaru, rowOrCol, type, panjangKolomAwal, panjangSekarang);
                    }
                }else{
                    hasilIsi.push(getValue1(categoryBaru));
                }
            }
        }
    }else if(type==3){
        if(rowOrCol==1){
            for (var ifh=0; ifh<categoryList.length; ifh++){
                for(var ifi=0; ifi<categoryList[ifh]['jadiList'].length; ifi++){
                    var categoryBaru = JSON.parse(JSON.stringify(category));
                    var barugh = [];
                    barugh.push(categoryList[ifh]['uuid'],categoryList[ifh]['jadiList'][ifi]
                        ,categoryList[ifh]['panjangCategory'],categoryList[ifh]['panjangItem']);
                    categoryBaru.push(barugh);
                    var hasilAwalThis = JSON.parse(JSON.stringify(hasilAwal));
    
                    if('childrens' in categoryList[ifh]){
                        if(ifi==0){
                            hasilAwalThis.push('<th rowspan="'+categoryList[ifh]['panjangCategory']+'">'+categoryList[ifh]['namaMask']
                                +'</th><th rowspan="'+categoryList[ifh]['panjangItem']+'">'+categoryList[ifh]['jadiList'][ifi]+'</th>');
                        }else{
                            hasilAwalThis.push('<th rowspan="'+categoryList[ifh]['panjangItem']+'">'+categoryList[ifh]['jadiList'][ifi]+'</th>');
                        }
    
                        for(var idd=0; idd<categoryList[ifh]['childrens'].length; idd++){
                            prosesIsi(hasilAwalThis,hasilIsi, categoryList[ifh]['childrens'][idd], categoryBaru, rowOrCol, type, panjangKolomAwal, panjangSekarang+1);
                        }
                    }else{
                        var panjangSeharusnyaH = panjangKolomAwal-panjangSekarang +1;
                        if(ifi==0){
                            hasilAwalThis.push('<th rowspan="'+categoryList[ifh]['panjangCategory']+'">'+categoryList[ifh]['namaMask']
                                +'</th><th rowspan="'+categoryList[ifh]['panjangItem']+'" colspan="'+panjangSeharusnyaH+'">'+categoryList[ifh]['jadiList'][ifi]+'</th>');
                        }else{
                            hasilAwalThis.push('<th rowspan="'+categoryList[ifh]['panjangItem']+'" colspan="'+panjangSeharusnyaH+'">'+categoryList[ifh]['jadiList'][ifi]+'</th>');
                        }
                        //prosesIsi(hasilAwalThis,hasilIsi, jsonTable['columnCategory'], categoryBaru, 2, type, panjangKolomAwal, panjangSekarang);
                        var nilai = '';
                        for (var mssa=0; mssa<hasilAwalThis.length; mssa++){
                            nilai = nilai + hasilAwalThis[mssa];
                        }
                        var kolomHtml = '';
                        var kolomArr = [];
                        prosesIsi(hasilAwalThis,kolomArr, jsonTable['columnCategory'], categoryBaru, 2, type, panjangKolomAwal, panjangSekarang);
                        for(var trdf=0; trdf<kolomArr.length; trdf++){
                            kolomHtml = kolomHtml+kolomArr[trdf];
                        }
                        hasilIsi.push(nilai+kolomHtml);
                    }
                }
            }
        }else if(rowOrCol==2){
            for (var ifh=0; ifh<categoryList.length; ifh++){
                for(var ifi=0; ifi<categoryList[ifh]['jadiList'].length; ifi++){
                    var categoryBaru = JSON.parse(JSON.stringify(category));
                    var barugh = [];
                    barugh.push(categoryList[ifh]['uuid'],categoryList[ifh]['jadiList'][ifi]
                        ,categoryList[ifh]['panjangCategory'],categoryList[ifh]['panjangItem']);
                    categoryBaru.push(barugh);
                    var hasilAwalThis = JSON.parse(JSON.stringify(hasilAwal));
                    if('childrens' in categoryList[ifh]){
                        for(var idd=0; idd<categoryList[ifh]['childrens'].length; idd++){
                            prosesIsi(hasilAwalThis,hasilIsi, categoryList[ifh]['childrens'][idd], categoryBaru, rowOrCol, type, panjangKolomAwal, panjangSekarang);
                        }
                    }else{
                        hasilIsi.push(getValue1(categoryBaru));
                    }
                }
            }
        }
    }
}

function prosesHead(categoryList, panjangSeharusnya, panjangSekarang){
    var returnValueSementara = [];
    for(var igh=0; igh<categoryList.length; igh++){
        if('childrens' in categoryList[igh]){
            var hasilHtmlCategory = '';
            var hasilSementara= [];
            var hasilHtmlItem = '';
            if('values' in jsonTable){
                for(var frw=0; frw<categoryList[igh]['pengulangan'].length; frw++){
                    hasilHtmlCategory = hasilHtmlCategory+'<th colspan="'+(categoryList[igh]['panjangCategory']*jsonTable['values'].length)
                        +'">'+categoryList[igh]['namaMask']+'</th>'
                    for(var ifw=0; ifw<categoryList[igh]['jadiList'].length; ifw++){
                        hasilHtmlItem = hasilHtmlItem +'<th colspan="'+(categoryList[igh]['panjangItem']*jsonTable['values'].length)
                            +'">'+categoryList[igh]['jadiList'][ifw]+'</th>'
                    }
                }
            }else{
                for(var frw=0; frw<categoryList[igh]['pengulangan'].length; frw++){
                    hasilHtmlCategory = hasilHtmlCategory+'<th colspan="'+categoryList[igh]['panjangCategory']
                        +'">'+categoryList[igh]['namaMask']+'</th>'
                    for(var ifw=0; ifw<categoryList[igh]['jadiList'].length; ifw++){
                        hasilHtmlItem = hasilHtmlItem +'<th colspan="'+categoryList[igh]['panjangItem']
                            +'">'+categoryList[igh]['jadiList'][ifw]+'</th>'
                    }
                }
            }
            hasilSementara.push(hasilHtmlCategory);
            hasilSementara.push(hasilHtmlItem);
            var hasil = prosesHead(categoryList[igh]['childrens'],panjangSeharusnya, (panjangSekarang+1));
            for(var fgw=0; fgw<hasil.length; fgw++){
                hasilSementara.push(JSON.parse(JSON.stringify(hasil[fgw])));
            }
            returnValueSementara.push(hasil);
        }else{
            var kekuranganTambahSatu = panjangSeharusnya - panjangSekarang +1;
            if('values' in jsonTable){
                var hasilHtmlCategory = '';
                var hasilHtmlItem = '';
                var hasilHtmlValue = '';
                for(var ixxr=0; ixxr<categoryList[igh]['pengulangan']; ixxr++){
                    hasilHtmlCategory = hasilHtmlCategory +'<th colspan="'+(jsonTable['values'].length*categoryList[igh]['jadiList'].length)
                        +'">'+categoryList[igh]['namaMask']+'</th>';
                    for(var ifw=0; ifw<categoryList[igh]['jadiList'].length; ifw++){
                        hasilHtmlItem = hasilHtmlItem +'<th colspan="'+jsonTable['values'].length+'">'+categoryList[igh]['jadiList'][ifw]+'</th>'
                        for(var ifw=0; ifw<jsonTable['values'].length; ifw++){
                            hasilHtmlValue = hasilHtmlItem +'<th>'+jsonTable['values'][ifw]['namaMask']+'</th>'
                        }
                    }
                }
               
                var hasilSementara= []; 
                hasilSementara.push(hasilHtmlCategory);
                hasilSementara.push(hasilHtmlItem);
                hasilSementara.push(hasilHtmlValue);
                returnValueSementara.push(hasilSementara);
            }else{
                var hasilHtmlCategory = '';
                var hasilHtmlItem = '';
                for(var ixxr=0; ixxr<categoryList[igh]['pengulangan']; ixxr++){
                    hasilHtmlCategory = hasilHtmlCategory +'<th colspan="'+categoryList[igh]['jadiList'].length
                        +'">'+categoryList[igh]['namaMask']+'</th>';
                    for(var ifw=0; ifw<categoryList[igh]['jadiList'].length; ifw++){
                        hasilHtmlItem = hasilHtmlItem +'<th rowspan="'+kekuranganTambahSatu+'">'+categoryList[igh]['jadiList'][ifw]+'</th>'
                    }
                }
                var hasilSementara= []; 
                hasilSementara.push(hasilHtmlCategory);
                hasilSementara.push(hasilHtmlItem);
                returnValueSementara.push(hasilSementara);
            }
        }
    }
    //console.log(returnValueSementara);
    var returnValue = [];
    var maxRow = 0;
    for(var ihy=0; ihy< returnValueSementara.length; ihy++){
        if(returnValueSementara[ihy].length> maxRow){
            maxRow = returnValueSementara[ihy].length;
        }
    }

    if('values' in jsonTable){
        for(var ihk=0; ihk<maxRow; ihk++){
            for(var ihy=0; ihy< returnValueSementara.length; ihy++){
                if(ihk in returnValueSementara[ihy] && ihk<returnValueSementara[ihy].length-1){
                    if(ihk in returnValue){
                        returnValue[ihk] = returnValue[ihk] + returnValueSementara[ihy][ihk];
                    }else{
                        returnValue[ihk] = returnValueSementara[ihy][ihk];
                    }
                }
            }
        }
        returnValue[maxRow-1] = '';
        for(var ihy=0; ihy< returnValueSementara.length; ihy++){
            returnValue[maxRow-1] = returnValue[maxRow-1] + returnValueSementara[ihy][returnValueSementara[ihy].length-1];
        }
    }else{
        for(var ihk=0; ihk<maxRow; ihk++){
            for(var ihy=0; ihy< returnValueSementara.length; ihy++){
                if(ihk in returnValueSementara[ihy]){
                    if(ihk in returnValue){
                        returnValue[ihk] = returnValue[ihk] + returnValueSementara[ihy][ihk];
                    }else{
                        returnValue[ihk] = returnValueSementara[ihy][ihk];
                    }
                }
            }
        }
    }
    return returnValue;
}

function getValue1(category){
    for(var ik=0; ik<hasil.length;ik++){
        var yangIni = true;
        for(var il=0; il<category.length; il++){
            if(category[il][0] in hasil[ik][0]){

            }else{
                yangIni = false;
                break;
            }
        }
        if(yangIni){
            return getValue2(category, hasil[ik]);
        }
    }
}

function getValue2(category, hasil){
    for(var ik=0; ik<hasil.length; ik++){
        var yangIni=true;
        for(var il=0; il<category.length; il++){
            if(hasil[ik][category[il][0]] != category[il][1]){
                yangIni = false;
                break;
            }
        }
        if(yangIni){
            if('values' in jsonTable){
                var returnValue = '';
                for(var im=0; im<jsonTable['values'].length;im++){
                    returnValue = returnValue + '<td>'+hasil[ik][jsonTable['values'][im]['uuid']]+'</td>';
                }
                return returnValue;
            }else{
                return '<td>'+hasil[ik][defaultNameVal]+'</td>';
            }
        }
    }
    if('values' in jsonTable){
        var returnValue = '';
        for(var im=0; im<jsonTable['values'].length;im++){
            returnValue = returnValue + '<td>0</td>';
        }
        return returnValue;
    }else{
        return '<td>0</td>';
    }
}

function exportData(){
    var exportIdType = document.getElementById('type_export').value;
    if(exportIdType==0 || exportIdType==1){
        fnExcelReport();
    }else if(exportIdType == 2){
        fnCsvReport();
    }else if(exportIdType == 3){
        fnJSONReport();
    }
}

function fnCsvReport() {
    var returnValue = JSON.parse(JSON.stringify(hasil));
    var str = '';
    for(var ayrc=0; ayrc<returnValue.length; ayrc++){
        array = returnValue[ayrc];

        var fields = Object.keys(array[0]);
        //console.log(fields);
        var lineField = '';
        for(var iyhv=0;iyhv<fields.length; iyhv++){
            //console.log('00');
            if (lineField != '') lineField += ','
            lineField += findNamaVar(fields[iyhv]);
        }
        //console.log(lineField);
        str += lineField + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
    
                line += array[i][index];
            }
    
            str += line + '\r\n';
        }
        str += '\r\n';
        str += '\r\n';
        str += '\r\n';
    }

    $('#test').attr('href', encodeURI('data:text/csv;charset=utf-8,' + str));
    $('#test').attr('download', 'export.csv');
    document.getElementById('test').click();
}

function renameJSONItem(jsonItem) {
   // Check for the old property name to avoid a ReferenceError in strict mode.
   var fields = Object.keys(jsonItem);
   for(var ghwr=0; ghwr<fields.length; ghwr++){
        jsonItem[findNamaVar(fields[ghwr])] = jsonItem[fields[ghwr]];
        delete jsonItem[fields[ghwr]];
   }

   return jsonItem;
};

function findNamaVar(uuid){
    if(uuid == defaultNameVal){
        return 'default nilai';
    }
    for(var tycg=0; tycg<jsonTable['values']; tycg++){
        if(jsonTable['values'][tycg]['uuid'] == uuid){
            return jsonTable['values'][tycg]['namaMask'];
        }
    }
    for(var tycg=0; tycg<dictionaryKey.length; tycg++){
        if(dictionaryKey[tycg][0] == uuid){
            return dictionaryKey[tycg][1];
        }
    }
}

function fnJSONReport() {
    var returnValue = JSON.parse(JSON.stringify(hasil));
    var str = '';
    for(var ayrc=0; ayrc<returnValue.length; ayrc++){
        array = returnValue[ayrc];
        for (var i = 0; i < array.length; i++) {
            renameJSONItem(array[i]);
        }
    }

    var blob = new Blob([JSON.stringify(returnValue)], {type: "application/octet-stream"});
    var url  = URL.createObjectURL(blob);

    $('#test').attr('href', url);
    $('#test').attr('download', 'export.json');
    document.getElementById('test').click();
}

function fnExcelReport() {
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

    tab_text = tab_text + "<table border='1px'>";
    tab_text = tab_text + $('#table_hasil').html();
    tab_text = tab_text + '</table></body></html>';

    var data_type = 'data:application/vnd.ms-excel';
    
    //console.log(tab_text);
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([tab_text], {
                type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'Test file.xls');
        }
    } else {
        $('#test').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
        $('#test').attr('download', jsonTable['nama']+'.xlsx');
        document.getElementById('test').click();
    }

}