# ProyectoRBP

## Descripción
**ProyectoRBP** es una aplicación web para la gestión de reservas de canchas de fútbol. Permite a los usuarios ver la disponibilidad de canchas, reservar horarios y gestionar sus reservas.


## Instalación para Desarrolladores
Esta sección es para desarrolladores que deseen contribuir o probar el proyecto.

## Instalación
Para instalar y ejecutar ProyectoRBP, sigue estos pasos:

### Clonar el Repositorio
```bash
git clone https://github.com/JaysonFxl/ProyectoRBP.git
```

### Navegar a la Carpeta del Proyecto
```bash
cd ProyectoRBP
```
### Instalar las Dependencias y Activar Entorno Virtual
#### Activar Entorno Virtual del Proyecto
```bash
vnv/Scripts/Activate
```

### Luego, instala las dependencias:
#### BackEnd
```bash
cd Backend
pip install -r requirements.txt
```

#### Frontend
En una nueva terminal:
```bash
cd Frontend
npm install
```

### Iniciar el Servidor de Desarrollo
#### Backend
```bash
python manage.py runserver
```

#### Frontend
En una nueva terminal:
```bash
npm start
```

## Uso
Una vez que el proyecto está en marcha, puedes acceder a la aplicación a través de tu navegador web en `http://localhost:3000`.

- Ver las canchas disponibles.
- Hacer una reserva seleccionando una cancha, una fecha y un horario.
- Ver y gestionar tus reservas actuales.

## Contribuir
Las contribuciones son bienvenidas. Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un **fork** del repositorio.
2. Crea una rama para tu característica (`git checkout -b feature/fooBar`).
3. Haz tus cambios y haz un commit (`git commit -am 'Add some fooBar'`).
4. Haz un push a la rama (`git push origin feature/fooBar`).
5. Crea una nueva **Pull Request**.

## Manual de Usuario
### Este apartado es para usuarios finales que deseen utilizar la aplicación.

## Acceder a la Aplicación
Puedes acceder a la aplicación a través de tu navegador web en http://localhost:3000. (Pronto estara disponible en un host gratuito proporcionado por netifly)

## Funcionalidades Disponibles
Ver Canchas Disponibles: Explora las canchas disponibles para reservar.(Agregando mas canchas)
Hacer Reservas: Elige una cancha, selecciona una fecha y un horario para hacer tu reserva. (Aun en mejoras)
Gestión de Reservas: Visualiza y administra tus reservas actuales.(Aun en mejoras)

## Navegación y Uso
Inicio: En la página principal, puedes ver un listado de canchas disponibles.
Reserva de Cancha: Selecciona una cancha, elige una fecha y un horario disponible.
Confirmación de Reserva: Completa el proceso de reserva y recibe una confirmación.

Ayuda y Soporte
Si tienes preguntas o necesitas ayuda, no dudes en contactar al equipo de soporte en [![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jayson.flores.cartes@gmail.com)

## Licencia
Este proyecto está bajo la Licencia [MIT](LICENSE). Consulta el archivo `LICENSE` para más detalles.
```
README.md echo por Jayson Flores Cartes - "JaysonFxl".
