from django.urls import path

from . import views

urlpatterns = [
    path('login', views.login_url, name='login'),
    path('signup', views.signup, name='signup'),
    path('profile', views.profile, name='profile'),
    path('', views.home, name='home'),
    path('manage_user', views.admin, name="manage_user"),
    path('logout', views.logout_url, name="logout"),
    path('search', views.cari, name='cari'),
    path('search_result', views.cari_hasil, name='hasil_cari'),
]