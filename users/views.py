from django.shortcuts import redirect
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout
from .models import users
from django.utils import timezone
import uuid
from django.core.files.storage import FileSystemStorage

from Publikasi.views import cari_hasil_publikasi, jumlah_publikasi, get_latest_publikasi
from DataMikro.views import cari_hasil_tabel, jumlah_data_mikro, jumlah_tabel, get_latest_my_table
def login_url(request):
    if request.user is not None:
        if request.user.is_authenticated:
            if request.method == 'POST':
                return HttpResponse('fuck off')
            else :
                return redirect('home')
       
    if request.method == 'POST':
        username = request.POST['Username']
        password = request.POST['password']
        remember_me = request.POST.get('remember', False) == 'on'
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            template = loader.get_template('login.html')
            context = {
                'index_page': 0,
                'title' : 'Masuk',
                'error' : 1,
            }
            return HttpResponse(template.render(context, request))
    else:
        template = loader.get_template('login.html')
        context = {
            'index_page': 0,
            'title' : 'Masuk',
            'error' : 0,
        }
        return HttpResponse(template.render(context, request))

def logout_url(request):
   if request.user is not None:
        if request.user.is_authenticated:
            if request.method == 'POST':
                return HttpResponse('fuck off')
            else :
                logout(request)
                return redirect('login')

def signup(request):
    if request.user is not None:
        if request.user.is_authenticated:
            if request.method == 'POST':
                return HttpResponse('fuck off')
            else :
                return redirect('home')

    if request.method == 'POST':
        now = timezone.now()
        uuidS = 'user_'+str(uuid.uuid4())

        username = request.POST['Username']
        password = request.POST['password']
        seksi = request.POST['seksi']
        jabatan = request.POST['jabatan']
        nama = request.POST['nama']
        newUser = users( 
            username = username,
            nama = nama,
            uuid = uuidS,
            seksi = seksi,
            jabatan = jabatan,
            create_at = now,
            update_at = now)
        newUser.set_password(password)
        newUser.save()

        login(request, newUser)
        return redirect('home')
    else :
        template = loader.get_template('signup.html')
        context = {
            'index_page': 1,
            'title' : 'Daftar',
        }
        return HttpResponse(template.render(context, request))

def profile(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'GET':
        template = loader.get_template('profile.html')
        context = {
            'index_page': 2,
            'title' : 'Profil',
        }
        return HttpResponse(template.render(context, request))
    elif request.method == 'POST':
        uuid_this_user = request.user.uuid
        one_entry = users.objects.get(uuid=uuid_this_user)
        one_entry.username = request.POST['Username']
        one_entry.nama = request.POST['nama']
        one_entry.jabatan = request.POST['jabatan']
        one_entry.seksi = request.POST['seksi']
        one_entry.update_at = timezone.now()
        
        if len(request.FILES) != 0:
            uuidS = 'user_photo_'+str(uuid.uuid4())
            file_photo = request.FILES['photo']
            fs = FileSystemStorage()
            filename = file_photo.name.split('.')
            extension = filename[len(filename)-1]
            fs.save('userPhoto//'+uuidS+"."+extension, file_photo)
            one_entry.photo_url = 'userPhoto//'+uuidS+"."+extension
        if request.POST['type_password'] == 'ya':
            one_entry.set_password(request.POST['password']);
        one_entry.save()
        return redirect('home')

def home(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')

    template = loader.get_template('index.html')
    jumlahPublikasi = jumlah_publikasi()
    jumlahDataMikro = jumlah_data_mikro()
    jumlahTabel = jumlah_tabel()
    latestMyTabel = get_latest_my_table(4)
    latestPublikasi = get_latest_publikasi(4)
    context = {
        'index_page': 3,
        'title' : 'Beranda',
        'jumlahPublikasi' : jumlahPublikasi,
        'jumlahDataMikro' : jumlahDataMikro,
        'jumlahTabel' : jumlahTabel,
        'latestMyTabel' : latestMyTabel,
        'latestPublikasi' : latestPublikasi,
    }
    return HttpResponse(template.render(context, request))

def admin(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    if not request.user.seksi == 'ipds':
        return redirect('home')
    
    template = loader.get_template('pengaturan_user.html')
    context = {
        'index_page': 13,
        'title' : 'Pengaturan User',
    }
    return HttpResponse(template.render(context, request))

def cari(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')
    
    template = loader.get_template('search.html')
    context = {
        'index_page': 5,
        'title' : 'Cari',
    }
    return HttpResponse(template.render(context, request))

def cari_hasil(request):
    if request.user is None:
        return redirect('login')
    if not request.user.is_authenticated:
        return redirect('login')

    jenis = request.POST.get('jenis', 'publikasi')

    if jenis == 'publikasi' :
        return cari_hasil_publikasi(request)
    elif jenis == 'table' :
        return cari_hasil_tabel(request)