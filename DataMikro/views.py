from django.http import HttpResponse
from django.template import loader
from django.shortcuts import redirect
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
from django.templatetags.static import static
from django.views.decorators.http import require_http_methods

from .models import datasource, table
from .whoosh_app import insertTable, deleteTabel, searchTabel, getProjectDir, deleteDataSource
from .data_mikro_helper import insertDBF, doQuery, getListVariabel

import os
import uuid
import json

def koleksi_tabel(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    
    banyak = request.GET.get('banyak', 10)
    page = request.GET.get('page', 1)
    search = request.GET.get('search', '')
    action = request.GET.get('action', '')

    if action == 'hapus' :
        uuidHapus = request.GET.get('uuid', '')
        deleteTabel(uuidHapus)

    table_all = table.objects.filter(Q(uuid_user = request.user.uuid), Q(nama__icontains = search) | Q(deskripsi__icontains = search)).order_by('-update_at')
    #print(publikasi_all)
    if len(table_all) == 0 :
        template = loader.get_template('koleksi_tabel.html')
        context = {
            'index_page': 8,
            'title' : 'Koleksi Tabel',
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))
    else :
        # search_url = '&seksi='+str(seksi)+'&banyak='+str(banyak)+'&search='+str(search)

        paginator = Paginator(table_all, banyak)
        try:
            tableShow = paginator.page(page)
        except PageNotAnInteger:
            tableShow = paginator.page(1)
        except EmptyPage:
            tableShow = paginator.page(paginator.num_pages)
    
        template = loader.get_template('koleksi_tabel.html')
        context = {
            'index_page': 8,
            'title' : 'Koleksi Tabel',
            'tableShow' : tableShow,
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))

def buat_tabel(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    
    if request.method == 'GET' :
        allDataSource = datasource.objects.all()
        template = loader.get_template('buat_tabel.html')
        context = {
            'index_page': 9,
            'title' : 'Buat Tabel',
            'allDataSource' : allDataSource,
            'jsonTable' : {},
            'uuid_use_datasource' : '',
        }
        return HttpResponse(template.render(context, request))
    elif request.method == 'POST':
        allDataSource = datasource.objects.all()
        template = loader.get_template('buat_tabel.html')
        context = {
            'index_page': 9,
            'title' : 'Buat Tabel',
            'allDataSource' : allDataSource,
        }
        return HttpResponse(template.render(context, request))

def hasil_tabel(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    uuid = request.GET.get('uuid','')
    if uuid=='' :
        return redirect('koleksi_tabel')
    hasil = doQuery(uuid)
    template = loader.get_template('tabel_result.html')
    context = {
        'index_page': 10,
        'title' : 'Hasil Tabel',
        'hasil' : json.dumps(hasil),
    }
    return HttpResponse(template.render(context, request))

def input_data_mikro(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if (not request.user.seksi == 'ipds') and (not request.user.jabatan == 'kasi') and (not request.user.jabatan == 'kepala'):
        return redirect('home')
    
    if request.method == 'GET':
        if request.user is None:
            return redirect('login')
        if not request.user.is_authenticated:
            return redirect('login')
    
        banyak = request.GET.get('banyak', 10)
        page = request.GET.get('page', 1)
        search = request.GET.get('search', '')
        seksi = request.GET.get('seksi', '')

        datasource_all = datasource.objects.filter(Q(nama__icontains = search) | Q(deskripsi__icontains = search)).order_by('-update_at')
        if request.user.seksi != 'ipds' :
            seksi = request.user.seksi
            datasource_all = datasource.objects.filter(Q(seksi = request.user.seksi) ,Q(nama__icontains = search) | Q(deskripsi__icontains = search)).order_by('-update_at')
        #print(publikasi_all)
        if len(datasource_all) == 0 :
            template = loader.get_template('input_datamikro.html')
            context = {
                'index_page': 11,
                'title' : 'Masukkan Data Mikro',
                'banyak' : banyak,
                'search' : search,
                'seksi' : seksi,
            }
            return HttpResponse(template.render(context, request))
        else :
            # search_url = '&seksi='+str(seksi)+'&banyak='+str(banyak)+'&search='+str(search)
            paginator = Paginator(datasource_all, banyak)
            try:
                dataSourceShow = paginator.page(page)
            except PageNotAnInteger:
                dataSourceShow = paginator.page(1)
            except EmptyPage:
                dataSourceShow = paginator.page(paginator.num_pages)
    
            template = loader.get_template('input_datamikro.html')
            context = {
                'index_page': 11,
                'title' : 'Masukkan Data Mikro',
                'dataSourceShow' : dataSourceShow,
                'banyak' : banyak,
                'search' : search,
                'seksi' : seksi,
            }
            return HttpResponse(template.render(context, request))
    else :
        action = request.POST['action']
        if action == 'tambah' : 
            now = timezone.now()
            uuidS = 'DS_'+str(uuid.uuid4())

            nama = request.POST['nama']
            deskripsi = request.POST['deskripsi']
            seksi = request.POST['seksi']
            file_data_mikro = request.FILES['file']

            fs = FileSystemStorage()
            fs.save(getProjectDir()+ '//media//DBF//'+uuidS+".dbf", file_data_mikro)

            dbfFile = os.path.join(getProjectDir()+ '//media//DBF//'+uuidS+".dbf")
            sqliteFile = os.path.join(getProjectDir()+ '//DataMikro//datasource//', uuidS+'.db')
            hasil = insertDBF(dbfFile, sqliteFile, uuidS)

            if hasil :
                newDataSource = datasource(uuid=uuidS, nama=nama, deskripsi=deskripsi, seksi=seksi, 
                    create_at=now, update_at=now)
                newDataSource.save()
            
        elif action == 'ubah' :
            now = timezone.now()
            uuidS = request.POST['uuid']
            nama = request.POST['nama']
            deskripsi = request.POST['deskripsi']
            seksi = request.POST['seksi']
            file_data_mikro = request.FILES['file']

            if file_data_mikro is None :
                updateDataSource = datasource.objects.get(uuid=uuidS)
                updateDataSource.nama = nama 
                updateDataSource.deskripsi = deskripsi 
                updateDataSource.seksi = seksi
                updateDataSource.update_at = now
                newDataSource.save()
            else :
                if os.path.exists(getProjectDir()+ '//media//DBF//'+uuidS+".dbf"):
                    os.remove(getProjectDir()+ '//media//DBF//'+uuidS+".dbf")
                if os.path.exists(getProjectDir()+ '//DataMikro//datasource//', uuidS+'.db'):
                    os.remove(getProjectDir()+ '//DataMikro//datasource//', uuidS+'.db')

                fs = FileSystemStorage()
                fs.save('DBF//'+uuidS+".dbf", file_data_mikro)

                dbfFile = os.path.join(getProjectDir()+ '//media//DBF//'+uuidS+".dbf")
                sqliteFile = os.path.join(getProjectDir()+ '//DataMikro//datasource//', uuidS+'.db')
                hasil = insertDBF(dbfFile, sqliteFile, uuidS)

                if hasil :
                    updateDataSource = datasource.objects.get(uuid=uuidS)
                    updateDataSource.nama = nama 
                    updateDataSource.deskripsi = deskripsi 
                    updateDataSource.seksi = seksi
                    updateDataSource.update_at = now
                    newDataSource.save()

        elif action == 'hapus' :
            uuidS = request.POST['uuid']
            deleteDataSource(uuidS)

        return redirect('masukkan_data_mikro')

def cari_hasil_tabel(request):
    page = int(request.POST.get('page', 1))
    search_kalimat = request.POST.get('seacrh', '')
    hasil = searchTabel(search_kalimat,page)
    template = loader.get_template('search_result_tabel.html')
    jenis = request.POST.get('jenis', 'table')
    print(hasil)
    context = {
        'index_page': 26,
        'title' : 'Hasil Cari',
        'jenis' : jenis,
        'search_kalimat' : search_kalimat,
        'hasil' : hasil,
        'page' : page,
    }
    return HttpResponse(template.render(context, request))

@require_http_methods(["POST"])
def getListVar(request) :
    if request.user is None:
        return HttpResponse('fuck off')
    if not request.user.is_authenticated:
        return HttpResponse('fuck off')

    allVar = getListVariabel(request.POST['uuid_source'])
    if allVar is not None :
        return HttpResponse(json.dumps(allVar))
    else :
        return  HttpResponse('0')

@require_http_methods(["POST"])
def simpanTable(request) :
    if request.user is None:
        return HttpResponse('fuck off')
    if not request.user.is_authenticated:
        return HttpResponse('fuck off')

    uuidS = 'T_'+str(uuid.uuid4())
    now = timezone.now()
    rowCategory = json.loads(request.POST.get('rowCategory','[]'))
    columnCategory = json.loads(request.POST.get('columnCategory','[]'))
    filters = json.loads(request.POST.get('filters','[]'))
    nama = request.POST.get('nama','')
    deskripsi = request.POST.get('deskripsi','')
    uuidDatasource = request.POST.get('uuidDatasource','')
    weight = request.POST.get('weight','')
    values  = json.loads(request.POST.get('values', '[]'))
    isi = {}
    isi['uuid'] = uuidS
    isi['nama'] = nama
    isi['deskripsi'] = deskripsi
    isi['rowCategory'] = rowCategory
    isi['columnCategory'] = columnCategory
    isi['filters'] = filters
    isi['datasourceuuid'] = uuidDatasource
    if weight != '':
        isi['weight'] = weight
    if len(values) > 0:
        isi['values'] = values

    dtaSourceDipakai = datasource.objects.get(uuid=uuidDatasource)

    hasil = insertTable(uuidS, nama, deskripsi, uuidDatasource, dtaSourceDipakai.nama, dtaSourceDipakai.deskripsi, isi, 
        request.user.nama, request.user.seksi, now, now, request.user.uuid)

    if hasil:
        with open(getProjectDir()+'//DataMikro//JsonTable//'+str(uuidS)+'.json', 'w') as outfile:
            json.dump(isi, outfile)
        return HttpResponse(uuidS)
    else :
        return HttpResponse('0')
@require_http_methods(["POST"])
def makeExcellHasil(request) :
    if request.user is None:
        return HttpResponse('fuck off')
    if not request.user.is_authenticated:
        return HttpResponse('fuck off')

    uuidS = 'Excell_'+str(uuid.uuid4())
    return HttpResponse('0')

def jumlah_data_mikro() :
    return datasource.objects.all().count()
def jumlah_tabel() :
    return table.objects.all().count()
def get_latest_my_table(jumlah) :
    return table.objects.all()[:jumlah]

