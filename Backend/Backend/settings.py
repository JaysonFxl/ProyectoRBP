import os
from pathlib import Path
from datetime import timedelta
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-(lybf@1x+7a@+e1hnz13o-^=fxidv_2ph33x3c0aoh(nrxx_eo'

DEBUG = True

ALLOWED_HOSTS = []

AUTH_USER_MODEL = 'futbolito.Usuario'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'futbolito',
    'rest_framework', # REST FRAMEWORK sirve para crear API's de forma sencilla y rápida con Django REST Framework.
    'corsheaders', # CORS sirve para permitir que el frontend se conecte al backend.
    'rest_framework_simplejwt.token_blacklist', # JWT Blacklist sirve para invalidar tokens de refresco.
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',#SecurityMiddleware sirve para proteger a los usuarios de ataques XSS.
    'django.contrib.sessions.middleware.SessionMiddleware',#SessionMiddleware sirve para guardar información de sesión de los usuarios.
    'corsheaders.middleware.CorsMiddleware',#CORS Middleware debe ir antes que CommonMiddleware, sirve para permitir que el frontend se conecte al backend.
    'django.middleware.common.CommonMiddleware',#CommonMiddleware debe ir después de CORS Middleware, sirve para que Django pueda procesar las peticiones.
    'django.middleware.csrf.CsrfViewMiddleware',#CsrfViewMiddleware sirve para proteger a los usuarios de ataques CSRF.
    'django.contrib.auth.middleware.AuthenticationMiddleware',#AuthenticationMiddleware sirve para autenticar usuarios.
    'django.contrib.messages.middleware.MessageMiddleware',#MessageMiddleware sirve para enviar mensajes a los usuarios.
    'django.middleware.clickjacking.XFrameOptionsMiddleware',#XFrameOptionsMiddleware sirve para proteger a los usuarios de ataques de clickjacking.
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication', #JWT sirve para autenticar usuarios con tokens.
        'rest_framework.authentication.TokenAuthentication', #TokenAuthentication sirve para autenticar usuarios con tokens.
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', #IsAuthenticated sirve para que solo los usuarios autenticados puedan acceder a las API's.
    )
}

#Simple JWT sirve para autenticar usuarios con tokens.
SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': False, #Si es True, el token de refresco se invalida cuando se usa para obtener un nuevo token de acceso.
    'ALGORITHM': 'HS256', #El algoritmo se usa para firmar los tokens.
    'SIGNING_KEY': SECRET_KEY, #La clave secreta de Django se usa para firmar los tokens.
    'VERIFYING_KEY': None, #La clave de verificación se usa para verificar la firma de los tokens.
    'AUTH_HEADER_TYPES': ('Bearer',), # El tipo de cabecera de autenticación se usa para saber si el usuario está autenticado.
    'USER_ID_FIELD': 'id', 
    'USER_ID_CLAIM': 'user_id', #El id del usuario se usa para identificar al usuario.
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',), #El token de acceso se usa para autenticar al usuario.
    'TOKEN_TYPE_CLAIM': 'token_type',#El tipo de token se usa para saber si es un token de acceso o de refresco.
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=3), #El token de acceso expira en 3 hora.
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1), #El token de refresco expira en 1 día.
}



#Para permitir todas las direcciones
CORS_ALLOW_ALL_ORIGINS = True

#Para permitir solo direcciones específicas (recomendado para producción)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", #La dirección de tu frontend con Vite
]

ROOT_URLCONF = 'Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME'),
        'USER': config('DATABASE_USER'),
        'PASSWORD': config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOST'),
        'PORT': config('DATABASE_PORT'),
    }
}

# Configuración de SMTP para enviar correos electrónicos
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'#Backend de correo electrónico de Django para enviar correos electrónicos.
EMAIL_HOST = 'smtp.gmail.com'#Servidor SMTP de Gmail
EMAIL_PORT = 587 #Puerto del servidor SMTP de Gmail
EMAIL_USE_TLS = True #TLS es un protocolo de seguridad
EMAIL_HOST_USER = 'fseba196@gmail.com' #Cuenta de Gmail que enviará los correos electrónicos.
EMAIL_HOST_PASSWORD = 'gekf qsvt ieuc ibtj' #Contraseña de aplicacion de la cuenta de Gmail (no la contraseña de la cuenta). 


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
