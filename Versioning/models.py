from django.db import models


class kegiatan(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    nama = models.CharField(max_length=255, blank= False)
    deskripsi = models.CharField(max_length=255, blank= False, default='ada')
    seksi  = models.CharField(max_length=20, blank=False, default='ipds')
    nama_aplikasi = models.CharField(max_length=255, blank= False)
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    def latestAplikasi(self) :
        aplikasiTerbaru = aplikasi.objects.filter(uuid_kegiatan=self.uuid).order_by('-update_at')[:1]
        if aplikasiTerbaru is not None and len(aplikasiTerbaru)>0:
            return aplikasiTerbaru[0]
        else :
            return None
    def latestBasisData(self) :
        basisDataTerbaru = basis_data.objects.filter(uuid_kegiatan=self.uuid).order_by('-update_at')[:1]
        if basisDataTerbaru  is not None  and len(basisDataTerbaru)>0:
            return basisDataTerbaru[0]
        else :
            return None
    def get_not_update_aplikasi(self, uuid_aplikasi_my_latest) :
        aplikasi_berkaitan = aplikasi.objects.get(uuid=uuid_aplikasi_my_latest)
        if aplikasi_berkaitan is not None :
            aplikasiTerbaru = aplikasi.objects.filter(uuid_kegiatan=self.uuid, update_at__gt=aplikasi_berkaitan.update_at).order_by('-update_at')
            return aplikasiTerbaru
        else :
            aplikasiTerbaru = aplikasi.objects.filter(uuid_kegiatan=self.uuid).order_by('-update_at')
            return aplikasiTerbaru
    def get_not_update_basis_data(self, uuid_aplikasi_my_latest) :
        basis_data_berkaitan = basis_data.objects.get(uuid=uuid_aplikasi_my_latest)
        if basis_data_berkaitan is not None :
            basisDtaTerbaru = basis_data.objects.filter(uuid_kegiatan=self.uuid, update_at__gt=basis_data_berkaitan.update_at).order_by('-update_at')
            return basisDtaTerbaru
        else :
            basisDtaTerbaru = basis_data.objects.filter(uuid_kegiatan=self.uuid).order_by('-update_at')
            return basisDtaTerbaru

class aplikasi(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    uuid_ext = models.CharField(max_length=90, blank= False, default="_")
    uuid_kegiatan = models.ForeignKey(kegiatan, on_delete=models.CASCADE, blank= False)
    versi = models.CharField(max_length=10, blank= False)
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    def url(self):
        from django.templatetags.static import static
        return static('media//Versioning//aplikasi//'+self.uuid_ext)


class basis_data(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    uuid_ext = models.CharField(max_length=90, blank= False, default="_")
    uuid_kegiatan = models.ForeignKey(kegiatan, on_delete=models.CASCADE, blank= False)
    versi = models.CharField(max_length=10, blank= False)
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    def url(self):
        from django.templatetags.static import static
        return static('media//Versioning//data//'+self.uuid_ext)