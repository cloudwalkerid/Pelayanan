from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
import uuid

class MyUserManager(BaseUserManager):
    def create_user(self, username, nama, seksi, jabatan, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """

        now = timezone.now()
        uuidS = 'user_'+str(uuid.uuid4())

        user = self.model(
            username = username,
            nama = nama,
            uuid = uuidS,
            seksi = seksi,
            jabatan = jabatan,
            create_at = now,
            update_at = now,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

class users(AbstractBaseUser):
    uuid = models.CharField(max_length=80, primary_key=True)
    nama = models.CharField(max_length=80, blank=False)
    username = models.CharField(max_length=80, blank=False, unique=True)
    jabatan  = models.CharField(max_length=20, blank=True, null=True)
    seksi  = models.CharField(max_length=20, blank=True, null=True)
    create_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    update_at = models.DateTimeField(auto_now=False, auto_now_add=False)
    photo_url = models.CharField(max_length=80,null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['jabatan','seksi','create_at','update_at']

    objects = MyUserManager()

    def __str__(self):
        return self.username

    def get_Seksi(self):
        return self.seksi

    def get_Jabatan(self):
        return self.jabatan

    def get_input_publikasi(self):
        return self.jabatan=='kasi' or self.seksi=='ipds'

    def get_input_data_mikro(self):
        return self.jabatan=='kasi' or self.seksi=='ipds'

    def get_input_versioning(self):
        return self.seksi =='ipds'

    def get_jadwal_tu (self) :
        return self.seksi == 'tu'



