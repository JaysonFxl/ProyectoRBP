from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ValidationError
from django.db.models import JSONField

class Usuario(AbstractUser):
    # Campo para determinar si un usuario es administrador
    es_administrador = models.BooleanField(default=False)

    # Campo para el RUT
    rut = models.CharField(max_length=12, unique=True)

    # Campo para el número de teléfono principal
    telefono = models.CharField(max_length=15, blank=True, null=True)

    # Campo para el número de teléfono alternativo
    telefono_alternativo = models.CharField(max_length=15, blank=True, null=True)

    # Campo para la ciudad o región
    ciudad = models.CharField(max_length=100, null=True, blank=True)

    # Campo para el estado del usuario
    ESTADO_OPCIONES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('suspendido', 'Suspendido'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADO_OPCIONES, default='activo')

    groups = models.ManyToManyField(
    'auth.Group',
    blank=True,
    help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    related_name="usuario_groups",  # <-- Cambio aquí
    related_query_name="usuario",  # <-- Cambio aquí
    verbose_name='groups'
)

    user_permissions = models.ManyToManyField(
    'auth.Permission',
    blank=True,
    help_text='Specific permissions for this user.',
    related_name="usuario_user_permissions",  # <-- Cambio aquí
    related_query_name="usuario",  # <-- Cambio aquí
    verbose_name='user permissions'
)


    def __str__(self):
        # Si ambos first_name y last_name están presentes, úsalos
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        # Si solo uno está presente, úsalo junto con el username
        elif self.first_name or self.last_name:
            return f"{self.first_name or self.last_name} ({self.username})"
        # Si ninguno está presente, usa el username
        else:
            return self.username

class Cancha(models.Model):
    TIPOS_SUPERFICIE = [
        ('sintetica', 'Sintética'),
        ('pasto_natural', 'Pasto Natural'),
    ]

    nombre = models.CharField(max_length=100)
    tipo_superficie = models.CharField(max_length=15, choices=TIPOS_SUPERFICIE)
    ubicacion = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='imagenes_canchas/', blank=True, null=True)
    horarios_disponibles = JSONField(default=list)

class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='reservas')
    cancha = models.ForeignKey(Cancha, on_delete=models.CASCADE)
    fecha_inicio = models.DateTimeField()
    estado = models.CharField(max_length=15, default='pendiente')

    def clean(self):
        reservas_solapadas = Reserva.objects.filter(
            cancha=self.cancha,
            fecha_inicio__lt=self.fecha_fin,
            fecha_fin__gt=self.fecha_inicio
        )
        if reservas_solapadas.exists():
            raise ValidationError('La reserva se colisiona con otra reserva existente')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        return super(Reserva, self).save(*args, **kwargs)

class Valoracion(models.Model):
    Usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cancha = models.ForeignKey(Cancha, on_delete=models.CASCADE)
    puntuacion = models.PositiveIntegerField()
    comentario = models.TextField(blank=True, null=True)

class Pago(models.Model):
    METODOS_PAGO = [
        ('transferencia', 'Transferencia'),
    ]

    ESTADOS_PAGO = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('rechazado', 'Rechazado'),
    ]

    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=METODOS_PAGO, default='transferencia')
    comprobante = models.ImageField(upload_to='comprobantes/', blank=True, null=True) 
    fecha_pago = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADOS_PAGO, default='pendiente')

class PrecioCancha(models.Model):
    cancha = models.ForeignKey(Cancha, on_delete=models.CASCADE)
    duracion = models.IntegerField()  # Duración en minutos
    precio = models.DecimalField(max_digits=6, decimal_places=2)  # Precio de la reserva

    def __str__(self):
        return f"{self.cancha.nombre} - {self.duracion} minutos - {self.precio} $"
