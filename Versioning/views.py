from django.http import HttpResponse
from django.template import loader
from django.shortcuts import redirect
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core import serializers

from django.utils import timezone
import uuid,json
from django.core.files.storage import FileSystemStorage
from django.views.decorators.http import require_http_methods
from django.templatetags.static import static

from .models import  aplikasi, basis_data, kegiatan
from django.views.decorators.csrf import csrf_exempt

def koleksi_versioning(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    seksi = request.GET.get('seksi', '')
    banyak = request.GET.get('banyak', 10)
    page = request.GET.get('page', 1)
    search = request.GET.get('search', '')

    kegiatan_all = kegiatan.objects.filter(Q(seksi__icontains = seksi), Q(nama__icontains = search) | Q(deskripsi__icontains = search)).order_by('-update_at')

    if len(kegiatan_all) == 0 :
        template = loader.get_template('input_versioning.html')
        context = {
            'index_page': 12,
            'title' : 'Versioning',
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))
    else :
        # search_url = '&seksi='+str(seksi)+'&banyak='+str(banyak)+'&search='+str(search)

        paginator = Paginator(kegiatan_all, banyak)
        try:
            kegiatanShow = paginator.page(page)
        except PageNotAnInteger:
            kegiatanShow = paginator.page(1)
        except EmptyPage:
            kegiatanShow = paginator.page(paginator.num_pages)


        template = loader.get_template('input_versioning.html')
        context = {
            'index_page': 12,
            'title' : 'Versioning',
            'kegiatanShow' : kegiatanShow,
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))

@require_http_methods(["POST"])
def input_kegiatan(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')
    
    now = timezone.now()
    uuidKegiatan = 'kegiatan_'+str(uuid.uuid4())
    kegiatanBaru = kegiatan (uuid=uuidKegiatan,nama=request.POST['nama'], deskripsi=request.POST['deskripsi']
        ,seksi=request.POST['seksi'], nama_aplikasi=request.POST['nama'], create_at=now, update_at=now)
    kegiatanBaru.save()
    if  'aplikasi_awal' in request.FILES:
        uuidAplikasi = 'aplikasi_'+str(uuid.uuid4())
        file_aplikasi = request.FILES['aplikasi_awal']
        fs1 = FileSystemStorage()
        filenameA = file_aplikasi.name.split('.')
        extensionA = filenameA[len(filenameA)-1]
        fs1.save('Versioning//aplikasi//'+uuidAplikasi+"."+extensionA, file_aplikasi)
        aplikasiBaru = aplikasi(uuid=uuidAplikasi, uuid_ext=uuidAplikasi+"."+extensionA, uuid_kegiatan=kegiatanBaru
            , versi=request.POST['versi_aplikasi'], create_at=now, update_at=now)
        aplikasiBaru.save()
    if  'basis_data_awal' in request.FILES:
        uuidBasisData = 'basisdata_'+str(uuid.uuid4())
        file_basis_data = request.FILES['basis_data_awal']
        fs2 = FileSystemStorage()
        filenameB = file_basis_data.name.split('.')
        extensionB = filenameB[len(filenameB)-1]
        fs2.save('Versioning//data//'+uuidBasisData+"."+extensionB, file_basis_data)
        basisDataBaru = basis_data(uuid=uuidBasisData, uuid_ext=uuidBasisData+"."+extensionB, uuid_kegiatan=kegiatanBaru
            , versi=request.POST['versi_basis_data'], create_at=now, update_at=now)
        basisDataBaru.save()
    
    return redirect('versioning')

@require_http_methods(["POST"])
def delete_kegiatan(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    thisKegiatan = kegiatan.objects.get(uuid = request.POST['delete_kegiatan_uuid'])
    basis_data.objects.filter(uuid_kegiatan = thisKegiatan).delete()
    aplikasi.objects.filter(uuid_kegiatan = thisKegiatan).delete()
    thisKegiatan.delete()
    
    return redirect('versioning')

@require_http_methods(["POST"])
def update_applikasi(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    now = timezone.now()
    uuidAplikasi = 'aplikasi_'+str(uuid.uuid4())
    file_aplikasi = request.FILES['aplikasi']
    fs1 = FileSystemStorage()
    filename = file_aplikasi.name.split('.')
    extension = filename[len(filename)-1]
    fs1.save('Versioning//aplikasi//'+uuidAplikasi+"."+extension, file_aplikasi)

    kegiataIni = kegiatan.objects.get(uuid=request.POST['uuid_kegiatan'])

    aplikasiBaru = aplikasi(uuid=uuidAplikasi, uuid_ext=uuidAplikasi+"."+extension, uuid_kegiatan=kegiataIni
            , versi=request.POST['versi'], create_at=now, update_at=now)
    aplikasiBaru.save()
    
    return redirect('versioning')

@require_http_methods(["POST"])
def update_datamikro(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    now = timezone.now()
    uuidBasisData = 'basisdata_'+str(uuid.uuid4())
    file_basis_data = request.FILES['basis_data']
    fs2 = FileSystemStorage()
    filename = file_basis_data.name.split('.')
    extension = filename[len(filename)-1]
    fs2.save('Versioning//data//'+uuidBasisData+"."+extension, file_basis_data)

    kegiataIni = kegiatan.objects.get(uuid=request.POST['uuid_kegiatan'])
    basisDataBaru = basis_data(uuid=uuidBasisData, uuid_ext=uuidBasisData+"."+extension, uuid_kegiatan=kegiataIni
            , versi=request.POST['versi'], create_at=now, update_at=now)
    basisDataBaru.save()

    return redirect('versioning')

@require_http_methods(["POST"])
def hapus_update_applikasi(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    aplikasi.objects.get(uuid = request.POST['uuid']).delete()
    
    return redirect('versioning')

@require_http_methods(["POST"])
def hapus_update_datamikro(request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')

    basis_data.objects.get(uuid = request.POST['uuid']).delete()
    return redirect('versioning')

@csrf_exempt
@require_http_methods(["POST"])
def get_kegiatan(request) :
    returnValue = []
    all_entries = kegiatan.objects.all()
    for oneEntry in all_entries :
        itemKegiatan = {};
        itemKegiatan['uuid'] = oneEntry.uuid
        itemKegiatan['nama'] = oneEntry.nama
        itemKegiatan['deskripsi'] = oneEntry.deskripsi
        itemKegiatan['seksi'] = oneEntry.seksi
        itemKegiatan['nama_aplikasi'] = oneEntry.nama_aplikasi
        itemKegiatan['create_at'] = oneEntry.create_at.strftime("%Y-%m-%d %H:%M:%S")
        itemKegiatan['update_at'] = oneEntry.update_at.strftime("%Y-%m-%d %H:%M:%S")
        returnValue.append(itemKegiatan)
    return HttpResponse(json.dumps(returnValue), content_type ="application/json")

@csrf_exempt
@require_http_methods(["POST"])
def get_my_kegiatan(request) :
    my_kegiatan_key = json.loads(request.POST['key'])
    returnValue = []
    for itemKeyKegiatan in my_kegiatan_key :
        kegiatanIni = kegiatan.objects.get(uuid=itemKeyKegiatan['uuid_kegiatan'])
        returnItem = {}
        returnItem['uuid_kegiatan'] = itemKeyKegiatan['uuid_kegiatan']
        if 'uuid_aplikasi_latest' in itemKeyKegiatan :
            aplikasiTerbaru = kegiatanIni.get_not_update_aplikasi(itemKeyKegiatan['uuid_aplikasi_latest'])
            returnItem['aplikasi'] = []
            for itemAplikasiTerbaru in aplikasiTerbaru :
                aplikasiItem = {}
                aplikasiItem['uuid'] = itemAplikasiTerbaru.uuid
                aplikasiItem['uuid_ext'] = itemAplikasiTerbaru.uuid_ext
                aplikasiItem['versi'] = itemAplikasiTerbaru.versi
                aplikasiItem['create_at'] = itemAplikasiTerbaru.create_at.strftime("%Y-%m-%d %H:%M:%S")
                aplikasiItem['update_at'] = itemAplikasiTerbaru.update_at.strftime("%Y-%m-%d %H:%M:%S")
                returnItem['aplikasi'].append(aplikasiItem)
        else :
            aplikasiTerbaru = aplikasi.objects.filter(uuid_kegiatan=kegiatanIni).order_by('-update_at')
            returnItem['aplikasi'] = []
            for itemAplikasiTerbaru in aplikasiTerbaru :
                aplikasiItem = {}
                aplikasiItem['uuid'] = itemAplikasiTerbaru.uuid
                aplikasiItem['uuid_ext'] = itemAplikasiTerbaru.uuid_ext
                aplikasiItem['versi'] = itemAplikasiTerbaru.versi
                aplikasiItem['create_at'] = itemAplikasiTerbaru.create_at.strftime("%Y-%m-%d %H:%M:%S")
                aplikasiItem['update_at'] = itemAplikasiTerbaru.update_at.strftime("%Y-%m-%d %H:%M:%S")
                returnItem['aplikasi'].append(aplikasiItem)

        if 'uuid_basis_data_latest' in itemKeyKegiatan :
            basisDtaTerbaru = kegiatanIni.get_not_update_basis_data(itemKeyKegiatan['uuid_basis_data_latest'])
            returnItem['basis_data'] = []
            for itemBasisDataTerbaru in basisDtaTerbaru :
                basisDataItem = {}
                basisDataItem['uuid'] = itemBasisDataTerbaru.uuid
                basisDataItem['uuid_ext'] = itemBasisDataTerbaru.uuid_ext
                basisDataItem['versi'] = itemBasisDataTerbaru.versi
                basisDataItem['create_at'] = itemBasisDataTerbaru.create_at.strftime("%Y-%m-%d %H:%M:%S")
                basisDataItem['update_at'] = itemBasisDataTerbaru.update_at.strftime("%Y-%m-%d %H:%M:%S")
                returnItem['basis_data'].append(basisDataItem)

        else :
            basisDtaTerbaru = basis_data.objects.filter(uuid_kegiatan=kegiatanIni).order_by('-update_at')
            returnItem['basis_data'] = []
            for itemBasisDataTerbaru in basisDtaTerbaru :
                basisDataItem = {}
                basisDataItem['uuid'] = itemBasisDataTerbaru.uuid
                basisDataItem['uuid_ext'] = itemBasisDataTerbaru.uuid_ext
                basisDataItem['versi'] = itemBasisDataTerbaru.versi
                basisDataItem['create_at'] = itemBasisDataTerbaru.create_at.strftime("%Y-%m-%d %H:%M:%S")
                basisDataItem['update_at'] = itemBasisDataTerbaru.update_at.strftime("%Y-%m-%d %H:%M:%S")
                returnItem['basis_data'].append(basisDataItem)
        returnValue.append(returnItem)
        #print(returnValue);
    return HttpResponse(json.dumps(returnValue), content_type ="application/json")
