from datetime import datetime, timedelta
from django.http import HttpResponseBadRequest, JsonResponse
from rest_framework import generics, permissions
from django.db.models import Q
from .models import Usuario, Cancha, Reserva, Valoracion
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.cache import never_cache
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Cancha, PrecioCancha, Reserva
from django.shortcuts import get_object_or_404
from django.views import generic
from datetime import date, timedelta
from django.urls import reverse_lazy
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth import views as auth_views
from django.contrib import messages
from datetime import datetime, timedelta
from django.shortcuts import render, redirect
from .serializers import UsuarioSerializer, CanchaSerializer, ReservaSerializer, ValoracionSerializer

@never_cache
def login_view(request): #Vista para iniciar sesión
    if request.method == 'POST': #Si el método es POST, se intenta iniciar sesión con los datos proporcionados en el formulario de inicio de sesión.
        username = request.POST['username'] 
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('clientes')  # Redirige a la página principal después del inicio de sesión
        else:
            # Mensaje de error si la autenticación falla    
            messages.error(request, 'Nombre de usuario o contraseña incorrectos.')
    return render(request, 'login.html')

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los administradores editar o crear, pero todos pueden leer.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.es_administrador #Solo los administradores pueden editar o crear usuarios o canchas (no es necesario estar autenticado para ver las canchas o usuarios).

class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        """
        Permite a cualquier usuario (autenticado o no) crear una cuenta (POST).
        Pero solo los administradores pueden ver la lista de usuarios (GET).
        """
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [IsAdminUserOrReadOnly()]

    def get_permissions(self):
        """
        Permite a cualquier usuario (autenticado o no) crear una cuenta (POST).
        Pero solo los administradores pueden ver la lista de usuarios (GET).
        """
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [IsAdminUserOrReadOnly()]

class CanchaListCreate(generics.ListCreateAPIView):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer
    permission_classes = [IsAdminUserOrReadOnly]#Solo los administradores pueden crear, todos pueden listar

class ReservaListCreate(generics.ListCreateAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]#Solo usuarios autenticados pueden reservar

class ValoracionListCreate(generics.ListCreateAPIView):
    queryset = Valoracion.objects.all()
    serializer_class = ValoracionSerializer
    permission_classes = [permissions.IsAuthenticated]#Solo usuarios autenticados pueden valorar

#Para la recuperación de contraseña se usa el sistema de autenticación de Django con una vista genérica de Django.
class PasswordResetRequestView(generic.FormView):
    template_name = 'password_email.html' # Plantilla de recuperación de contraseña.
    form_class = PasswordResetForm # Formulario de recuperación de contraseña de Django (ya viene con el sistema de autenticación de Django).
    success_url = reverse_lazy('request_password_done') # Redirige a la página de éxito después de enviar el correo electrónico de recuperación de contraseña.

    #Se sobreescribe el método form_valid para enviar el correo electrónico de recuperación de contraseña.
    def form_valid(self, form):
        form.save(request=self.request, use_https=True, email_template_name='reset_password.html') # Envía el correo electrónico de recuperación de contraseña.
        return super().form_valid(form) # Redirige a la página de éxito después de enviar el correo electrónico de recuperación de contraseña.

#Api view para registrar usuarios con el sistema de autenticación de Django.
@api_view(['POST']) #Solo se permite el método POST para registrar usuarios.
@permission_classes([AllowAny]) #Cualquiera puede registrarse
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    rut = request.data.get('rut')
    telefono = request.data.get('telefono')
    telefono_alternativo = request.data.get('telefono_alternativo') 
    ciudad = request.data.get('ciudad')
    estado = request.data.get('estado', True) #Por defecto los usuarios están activos
    es_administrador = request.data.get('es_administrador', False) #Por defecto los usuarios no son administradores

    #Validación de datos de entrada 
    if not username or not email or not password:
        return Response({'error': 'Por favor, proporcione nombre de usuario, correo electrónico y contraseña'}, status=status.HTTP_400_BAD_REQUEST)
    if Usuario.objects.filter(username=username).exists():
        return Response({'error': 'El nombre de usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST) #Si el nombre de usuario ya existe, devuelve un error.
    
    Usuario.objects.create_user(
        username=username,
        email=email,
        password=password,
        rut=rut,
        telefono=telefono,
        telefono_alternativo=telefono_alternativo,
        ciudad=ciudad,
        estado=estado,
        es_administrador=es_administrador
    )
    return Response({'success': 'Usuario creado con éxito'}, status=status.HTTP_201_CREATED) #Devuelve un mensaje de éxito si el usuario se creó correctamente.

def disponibilidad_canchas(request):
    # Obtener el ID de la cancha y la fecha desde los parámetros de la solicitud
    cancha_id = request.GET.get('cancha_id')
    fecha_str = request.GET.get('fecha')

    # Verificar si los parámetros están presentes
    if not cancha_id or not fecha_str:
        return HttpResponseBadRequest("Se requieren la cancha y la fecha.")

    try:
        # Convertir la fecha de string a objeto datetime
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
    except ValueError:
        return HttpResponseBadRequest("Formato de fecha inválido. Use YYYY-MM-DD.")

    try:
        # Obtener la cancha
        cancha = Cancha.objects.get(id=cancha_id)
    except Cancha.DoesNotExist:
        return HttpResponseBadRequest("Cancha no encontrada.")

    # Obtener las reservas para esa cancha en esa fecha
    reservas = Reserva.objects.filter(
        cancha=cancha,
        fecha_inicio__date=fecha,
        fecha_fin__date=fecha
    )

    # Convertir horarios de reservas a un conjunto para comparar
    horarios_reservados = set(reserva.fecha_inicio.time() for reserva in reservas)

    # Filtrar horarios disponibles
    horarios_disponibles = [
        horario for horario in cancha.horarios_disponibles
        if horario not in horarios_reservados
    ]

    respuesta = {
        'id': cancha.id,
        'nombre': cancha.nombre,
        'ubicacion': cancha.ubicacion,
        'tipo_superficie': cancha.tipo_superficie,
        'horarios_disponibles': horarios_disponibles
    }

    return JsonResponse(respuesta)

def calcular_disponibilidad(fecha_inicio, fecha_fin):
    # Fechas de prueba
    fechas_disponibles_prueba = {date(2023, 12, 20), date(2023, 12, 22), date(2023, 12, 27)}
    fechas_no_disponibles_prueba = {date(2023, 12, 25), date(2023, 12, 26), date(2023, 12, 30)}

    # Filtrar las fechas de prueba para que estén dentro del rango solicitado
    fechas_disponibles = [fecha for fecha in fechas_disponibles_prueba if fecha_inicio.date() <= fecha <= fecha_fin.date()]
    fechas_no_disponibles = [fecha for fecha in fechas_no_disponibles_prueba if fecha_inicio.date() <= fecha <= fecha_fin.date()]

    return fechas_disponibles, fechas_no_disponibles


@api_view(['GET']) #Solo se permite el método GET para calcular la disponibilidad de fechas.
@permission_classes([AllowAny]) #Cualquiera puede calcular la disponibilidad de fechas de las canchas (no es necesario estar autenticado).
def disponibilidad_fecha(request):
    fecha_inicio_str = request.GET.get('fecha_inicio')
    fecha_fin_str = request.GET.get('fecha_fin', fecha_inicio_str)

    if not fecha_inicio_str:
        return HttpResponseBadRequest("Se requiere la fecha de inicio.")
    
    try:
        fecha_inicio = datetime.strptime(fecha_inicio_str, '%Y-%m-%d')
        fecha_fin = datetime.strptime(fecha_fin_str, '%Y-%m-%d') 
    except ValueError:
        return HttpResponseBadRequest("Formato de fecha inválido. Use YYYY-MM-DD.") 
    
    fechas_disponibles, fecha_no_disponibles = calcular_disponibilidad(fecha_inicio, fecha_fin) #Se calcula la disponibilidad de las fechas solicitadas con la función calcular_disponibilidad definida anteriormente.

    #Se convierten las fechas a strings para que puedan ser serializadas por JsonResponse (no se pueden serializar objetos datetime).
    respuesta = {
        'disponible': [fecha.strftime('%Y-%m-%d') for fecha in fechas_disponibles],
        'no_disponible': [fecha.strftime('%Y-%m-%d') for fecha in fecha_no_disponibles]
    }

    return JsonResponse(respuesta) #Devuelve la respuesta en formato JSON

@api_view(['GET']) #Solo se permite el método GET para obtener la información del usuario.
@permission_classes([permissions.IsAuthenticated]) #Solo usuarios autenticados pueden obtener su información
def user_info(request):
    # Obtener el usuario actual basado en el token
    user = request.user
    # Serializar la información del usuario
    serializer = UsuarioSerializer(user)
    return Response(serializer.data)

class UsuarioRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer 

#Vista para listar las canchas disponibles para reservar.
#Solo se permite el método GET para listar las canchas.
@api_view(['GET'])
@permission_classes([AllowAny])
def horarios_disponibles(request, cancha_id, fecha):
    # Obtener la cancha
    cancha = get_object_or_404(Cancha, pk=cancha_id)

    # Convertir la fecha a un objeto datetime
    fecha_reserva = datetime.strptime(fecha, '%Y-%m-%d')
    dia_semana = fecha_reserva.strftime('%A')

    # Encontrar los horarios disponibles para el día de la semana
    horarios_del_dia = next((item for item in cancha.horarios_disponibles if item["dia"] == dia_semana), None)
    
    if not horarios_del_dia:
        return Response({
            'cancha': cancha.nombre,
            'fecha': fecha,
            'horarios_disponibles': []
        })

    horarios_disponibles = []
    for hora in horarios_del_dia['horarios']:
        inicio = datetime.combine(fecha_reserva, datetime.min.time()) + timedelta(hours=int(hora.split(':')[0]), minutes=int(hora.split(':')[1]))
        fin = inicio + timedelta(hours=1)

        # Comprobar si hay reservas que se solapen con este horario
        if not Reserva.objects.filter(cancha=cancha, fecha_inicio__lt=fin, fecha_fin__gt=inicio).exists():
            horarios_disponibles.append(inicio.strftime('%H:%M'))

    return Response({
        'cancha': cancha.nombre,
        'fecha': fecha,
        'horarios_disponibles': horarios_disponibles
    })