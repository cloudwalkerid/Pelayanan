from django.db import models


class publikasi(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    judul = models.CharField(max_length=80, blank= False)
    deskripsi = models.CharField(max_length=300, blank= False, null=True, default="None")
    isi = models.TextField(null=True)
    seksi = models.CharField(max_length=20, blank= False)
    tag = models.TextField(null=True)
    tanggal_terbit = models.DateField()
    type_pub = models.CharField(max_length=80, blank= False, default="pdf")
    data_tahun = models.CharField(max_length=4, blank= False, default="2018")
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)