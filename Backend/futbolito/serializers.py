from rest_framework import serializers
from .models import Usuario, Cancha, Reserva, Valoracion
from datetime import datetime

class UsuarioSerializer(serializers.ModelSerializer):
    # Mostrar las reservas relacionadas con el usuario
    reservas = serializers.PrimaryKeyRelatedField(many=True, queryset=Reserva.objects.all(), required=False)

    class Meta:
        model = Usuario
        #Fiels es una lista de los campos que queremos serializar (convertir a JSON) y mostrar en la API REST.
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'reservas', 'es_administrador', 'rut', 'telefono', 'telefono_alternativo', 'ciudad', 'estado']
        extra_kwargs = {'reservas': {'required': False}}

class CanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancha
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    fecha = serializers.DateField(write_only=True, required=False)
    hora = serializers.TimeField(write_only=True, required=False)
    duracion = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Reserva
        fields = '__all__'

    def create(self, validated_data):
        # Procesamiento de fecha y hora
        fecha = validated_data.pop('fecha', None)
        hora = validated_data.pop('hora', None)
        if fecha and hora:
            fecha_hora_str = f"{fecha} {hora}"
            fecha_hora_obj = datetime.strptime(fecha_hora_str, '%Y-%m-%d %H:%M')
            validated_data['fecha_inicio'] = fecha_hora_obj

        # Procesamiento de duración (si necesitas hacer algo con la duración)
        duracion = validated_data.pop('duracion', None)
        if duracion == "custom":
            # Aquí puedes manejar la duración personalizada si es necesario
            pass

        return super().create(validated_data)
    
    # Validación para asegurarnos de que la fecha_inicio esté en el futuro
    def validate_fecha_inicio(self, value):
        if value <= serializers.DateTimeField().to_representation(datetime.datetime.now()):
            raise serializers.ValidationError("La fecha y hora de inicio de la reserva debe estar en el futuro.")
        return value

class ValoracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valoracion
        fields = '__all__'