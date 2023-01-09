from django.urls import path

from . import views

urlpatterns = [
    path('', views.koleksi_publikasi, name='koleksi_publikasi'),
    path('input', views.input_publikasi, name='masukkan_publikasi'),
    path('create_hasil', views.createHasilPDF, name='create_hasil'),
]