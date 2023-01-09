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

from .models import publikasi

from .whoosh_app import inputPublikasiPDF, inputPublikasiExcell, searchHalaman, searchPublikasi, getProjectDir, deletePdfAndExcell

import uuid
import os
import json
import ast

from PyPDF2 import PdfFileReader, PdfFileWriter

def koleksi_publikasi(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    
    seksi = request.GET.get('seksi', '')
    banyak = request.GET.get('banyak', 10)
    page = request.GET.get('page', 1)
    search = request.GET.get('search', "")

    publikasi_all = publikasi.objects.filter(Q(seksi__icontains = seksi), Q(judul__icontains = search) | Q(deskripsi__icontains = search)).order_by('-tanggal_terbit')
    #print(publikasi_all)
    if len(publikasi_all) == 0 :
        template = loader.get_template('koleksi_publikasi.html')
        context = {
            'index_page': 4,
            'title' : 'Koleksi Publikasi',
            'seksi' : seksi,
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))
    else :
        # search_url = '&seksi='+str(seksi)+'&banyak='+str(banyak)+'&search='+str(search)

        paginator = Paginator(publikasi_all, banyak)
        try:
            publikasis = paginator.page(page)
        except PageNotAnInteger:
            publikasis = paginator.page(1)
        except EmptyPage:
            publikasis = paginator.page(paginator.num_pages)
    
        template = loader.get_template('koleksi_publikasi.html')
        context = {
            'index_page': 4,
            'title' : 'Koleksi Publikasi',
            'publikasis' : publikasis,
            'seksi' : seksi,
            'banyak' : banyak,
            'search' : search,
        }
        return HttpResponse(template.render(context, request))

def cari_hasil_publikasi(request):
    page_pub = int(request.POST.get('page_pub', 1))
    page_hal = int(request.POST.get('page_hal', 1))
    search_kalimat = request.POST.get('seacrh', '')
    hasil = json.loads(request.POST.get('hasil', '[]'))
    hasilPub = searchPublikasi(search_kalimat,page_pub)
    hasilHal = searchHalaman(search_kalimat,page_hal)
    template = loader.get_template('search_result_publikasi.html')
    jenis = request.POST.get('jenis', 'publikasi')
    #print(hasil)
    context = {
        'index_page': 6,
        'title' : 'Hasil Cari',
        'jenis' : jenis,
        'search_kalimat' : search_kalimat,
        'hasilPub' : hasilPub,
        'hasilHal' : hasilHal,
        'page_pub' : page_pub,
        'page_hal' : page_hal,
        'hasil' : hasil,
    }
    return HttpResponse(template.render(context, request))

def createHasilPDF (request) :
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == "POST" :
        print("Error 1")
        hasil = json.loads(request.POST['hasil'])
        print("Error 2")
        pdf_folder_path = getProjectDir()+'//media//publikasi//pdf'
        print("Error 3")
        hasil_folder_path = getProjectDir()+'//media//publikasi//hasil'
        print("Error 4")
        uuidS = 'H_'+str(uuid.uuid4())
        print("Error 5")
        try :
            writer = PdfFileWriter()
            print("Error 6")
            pertama = True;
            for element in hasil :
                print("Error 7")
                pdf_reader = PdfFileReader(pdf_folder_path+"//"+element['uuid']+'.pdf')
                writer.addPage(pdf_reader.getPage(int(element['halaman'])-1))

            with open(hasil_folder_path+'//'+uuidS+'.pdf', 'wb') as outfile:
                print("Error 10")
                writer.write(outfile)

            return HttpResponse(static(hasil_folder_path+'//'+uuidS+'.pdf'))
        except Exception as e: 
            print(e);
            return HttpResponse('1')
    else :
        return HttpResponse('0')

def input_publikasi(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if (not request.user.seksi == 'ipds') and (not request.user.jabatan == 'kasi') and (not request.user.jabatan == 'kepala'):
        return redirect('home')

    if request.method == 'GET':
        seksi = request.GET.get('seksi', '')
        banyak = request.GET.get('banyak', 10)
        page = request.GET.get('page', 1)
        search = request.GET.get('search', "")

        publikasi_all = publikasi.objects.filter(Q(judul__icontains = search) | Q(deskripsi__icontains = search)).order_by('-tanggal_terbit')
        if request.user.seksi != 'ipds' :
            seksi = request.user.seksi
            publikasi_all = publikasi.objects.filter(Q(seksi = seksi), Q(judul__icontains = search) | Q(deskripsi__icontains = search)).order_by('-tanggal_terbit')

        if len(publikasi_all) == 0 :
            template = loader.get_template('input_publikasi.html')
            context = {
                'index_page': 7,
                'title' : 'Masukkan Publikasi',
                'seksi' : seksi,
                'banyak' : banyak,
                'search' : search,
            }
            return HttpResponse(template.render(context, request))
        else :
            # search_url = '&seksi='+str(seksi)+'&banyak='+str(banyak)+'&search='+str(search)
            paginator = Paginator(publikasi_all, banyak)
            try:
                publikasis = paginator.page(page)
            except PageNotAnInteger:
                publikasis = paginator.page(1)
            except EmptyPage:
                publikasis = paginator.page(paginator.num_pages)
    
            template = loader.get_template('input_publikasi.html')
            context = {
                'index_page': 7,
                'title' : 'Masukkan Publikasi',
                'publikasis' : publikasis,
                'seksi' : seksi,
                'banyak' : banyak,
                'search' : search,
            }
            return HttpResponse(template.render(context, request))
    else :
        action = request.POST['action']
        if action == 'tambah' : 
            now = timezone.now()
            uuidS = 'P_'+str(uuid.uuid4())

            judul = request.POST['judul']
            deskripsi = request.POST['deskripsi']
            seksi = request.POST['seksi']
            tags = request.POST['tags']
            tanggal_terbit = request.POST['tanggal_terbit']
            data_tahun = request.POST['data_tahun']
            file_publikasi = request.FILES['file']

            fs = FileSystemStorage()
            filename = file_publikasi.name

            image_path = getProjectDir()+'//media//publikasi//images'
            if filename.endswith('.xls') : 
                fs.save(getProjectDir()+ '//media//excell//'+uuidS+".xls", file_publikasi)
                xlsFile = os.path.join(getProjectDir()+ '//media//excell', uuidS+'.xls')
                inputPublikasiExcell (uuidS, xlsFile, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now)
            elif filename.endswith('.xlsx'):
                fs.save(getProjectDir()+ '//media//excell//'+uuidS+".xlsx", file_publikasi)
                xlsFilex = os.path.join(getProjectDir()+ '//media//excell', uuidS+'.xlsx')
                inputPublikasiExcell (uuidS, xlsFilex, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now)
            elif filename.endswith('.pdf'):
                fs.save(getProjectDir()+ '//media//publikasi//pdf//'+uuidS+".pdf", file_publikasi)
                pdfFile = os.path.join(getProjectDir()+ '//media//publikasi//pdf', uuidS+'.pdf')
                inputPublikasiPDF (uuidS, pdfFile, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now, image_path)
        elif action == 'ubah' :
            oldUUID = request.POST.get('uuid','')
            deletePdfAndExcell(oldUUID)
            # insert seperti baru
            now = timezone.now()
            uuidS = 'P_'+str(uuid.uuid4())

            judul = request.POST['judul']
            deskripsi = request.POST['deskripsi']
            seksi = request.POST['seksi']
            tags = request.POST['tags']
            tanggal_terbit = request.POST['tanggal_terbit']
            data_tahun = request.POST['data_tahun']
            file_publikasi = request.FILES['file']

            fs = FileSystemStorage()
            filename = file_publikasi.name

            image_path = getProjectDir()+'//media//publikasi//images'
            if filename.endswith('.xls') : 
                fs.save(getProjectDir()+ '//media//excell//'+uuidS+".xls", file_publikasi)
                xlsFile = os.path.join(getProjectDir()+ '//media//excell', uuidS+'.xls')
                inputPublikasiExcell (uuidS, xlsFile, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now, 'xls')
            elif filename.endswith('.xlsx'):
                fs.save(getProjectDir()+ '//media//excell//'+uuidS+".xlsx", file_publikasi)
                xlsFilex = os.path.join(getProjectDir()+ '//media//excell', uuidS+'.xlsx')
                inputPublikasiExcell (uuidS, xlsFilex, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now, 'xlsx')
            elif filename.endswith('.pdf'):
                fs.save(getProjectDir()+ '//media//publikasi//pdf//'+uuidS+".pdf", file_publikasi)
                pdfFile = os.path.join(getProjectDir()+ '//media//publikasi//pdf', uuidS+'.pdf')
                inputPublikasiPDF (uuidS, pdfFile, seksi, judul, deskripsi, tags, tanggal_terbit, data_tahun, now, now, image_path)
        elif action == 'hapus' :
            uuidS = request.POST['uuid']
            deletePdfAndExcell(uuidS)

        return redirect('koleksi_publikasi')

def jumlah_publikasi() :
    return publikasi.objects.all().count()

def get_latest_publikasi(jumlah) :
    return publikasi.objects.order_by('-tanggal_terbit')[:jumlah]