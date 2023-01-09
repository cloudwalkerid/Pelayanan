from django.urls import path

from . import views

urlpatterns = [
    path('', views.koleksi_versioning, name='versioning'),
    path('input_kegiatan', views.input_kegiatan, name='input_kegiatan'),
    path('delete_kegiatan', views.delete_kegiatan, name='delete_kegiatan'),
    path('update_aplikasi', views.update_applikasi, name='update_aplikasi'),
    path('update_basis_data', views.update_datamikro, name='update_basis_data'),
    path('hapus_update_aplikasi', views.hapus_update_applikasi, name='hapus_update_aplikasi'),
    path('hapus_update_basis_data', views.hapus_update_datamikro, name='hapus_update_basis_data'),
    path('get_kegiatan', views.get_kegiatan, name='get_kegiatan'),
    path('get_my_kegiatan', views.get_my_kegiatan, name='get_my_kegiatan'),
]