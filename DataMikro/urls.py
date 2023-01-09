from django.urls import path

from . import views

urlpatterns = [
    path('', views.koleksi_tabel, name='koleksi_tabel'),
    path('make_table', views.buat_tabel, name='buat_tabel'),
    path('table_result', views.hasil_tabel, name='hasil_tabel'),
    path('input', views.input_data_mikro, name='masukkan_data_mikro'),
    path('listVar', views.getListVar, name='list_var'),
    path('simpan_tabel', views.simpanTable, name='simpan_tabel'),
    path('makeExcellHasil', views.makeExcellHasil, name='make_excell_hasil'),
]