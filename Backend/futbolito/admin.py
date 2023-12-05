from django.contrib import admin
from .models import Usuario, Cancha, Reserva, Valoracion  # y cualquier otro modelo que hayas creado

admin.site.register(Usuario)
admin.site.register(Cancha)
admin.site.register(Reserva)
admin.site.register(Valoracion)
admin.site.site_header = "Administración de Futbolito"
admin.site.site_title = "Administración de Futbolito"
admin.site.index_title = "Bienvenido al portal de administración de Futbolito"
admin.site.site_url = "/admin"