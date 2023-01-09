from django.db import models


class datasource(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    nama = models.CharField(max_length=80, blank=False)
    deskripsi = models.CharField(max_length=255, blank=False)
    seksi = models.CharField(max_length=20, blank= False)
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)

class table(models.Model):
    uuid = models.CharField(max_length=80, primary_key=True)
    nama = models.CharField(max_length=80, blank=False)
    deskripsi = models.CharField(max_length=255, blank=False)
    seksi = models.CharField(max_length=20, blank= False)
    uuid_datasource = models.CharField(max_length=80, blank= False)
    uuid_user = models.CharField(max_length=80, blank= False, default='0')
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)