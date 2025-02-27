from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path
from futbolito import views
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.login_view, name='login'),
    path('clientes/', views.UsuarioListCreate.as_view(), name='cliente-list-create'),
    path('clientes/<int:pk>/', views.UsuarioRetrieveUpdateDestroy.as_view(), name='cliente-detail'),
    path('canchas/', views.CanchaListCreate.as_view(), name='cancha-list-create'),
    path('api/canchas/', views.CanchaList.as_view(), name='api-canchas'),
    path('api/canchas/<int:pk>/', views.CanchaDetailView.as_view(), name='cancha-detail'),
    path('reservas/', views.ReservaListCreate.as_view(), name='reserva-list-create'),
    path('valoraciones/', views.ValoracionListCreate.as_view(), name='valoracion-list-create'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password_reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('api/register/', views.register, name='register'),
    path('api/disponibilidad_canchas/', views.disponibilidad_canchas, name='disponibilidad_canchas'),
    path('api/disponibilidad_fecha/', views.disponibilidad_fecha, name='disponibilidad_fecha'),
    path('api/user-info/', views.user_info, name='user_info'),
    path('api/canchas/<int:cancha_id>/disponibilidad/<str:fecha>/', views.horarios_disponibles, name='horarios_disponibles')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)