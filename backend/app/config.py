# backend/app/config.py
import os
from dotenv import load_dotenv

# Construir la ruta al archivo .env que está en la carpeta raíz del backend (un nivel arriba de 'app')
# __file__ es la ruta de este archivo (config.py)
# os.path.dirname(__file__) es la ruta de la carpeta 'app'
# os.path.dirname(os.path.dirname(__file__)) es la ruta de la carpeta 'backend'
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

# Cargar el archivo .env si existe
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    # print(f"INFO: Archivo .env cargado desde {dotenv_path}") # Para depuración
# else:
# print(f"WARNING: Archivo .env no encontrado en {dotenv_path}") # Para depuración


class Config:
    """Configuración base, las otras configuraciones heredan de esta."""

    # Configuración de seguridad
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "un_secreto_por_defecto_muy_seguro_y_dificil_de_adivinar"
    )

    # Configuración de JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_secreto_por_defecto_muy_seguro")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hora en segundos
    JWT_REFRESH_TOKEN_EXPIRES = 30 * 24 * 3600  # 30 días en segundos
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_COOKIE_SECURE = False  # En producción debe ser True (HTTPS)
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True
    JWT_CSRF_CHECK_FORM = True

    # Configuración de base de datos
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = (
        False  # Desactiva una característica de SQLAlchemy que no necesitamos
    )

    # Otras configuraciones globales
    CORS_HEADERS = "Content-Type"


class DevelopmentConfig(Config):
    """Configuración para el entorno de desarrollo."""

    DEBUG = True

    # Configuración de la base de datos SQLite para desarrollo
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "development.db"
    )

    # Configuración de JWT para desarrollo
    JWT_COOKIE_SECURE = False  # Permitir HTTP en desarrollo
    PROPAGATE_EXCEPTIONS = True  # Para mejor depuración

    # Configuración CORS para desarrollo
    CORS_ALLOW_HEADERS = "*"


class TestingConfig(Config):
    """Configuración para el entorno de pruebas."""

    DEBUG = True
    TESTING = True

    # Base de datos en memoria para tests
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    PRESERVE_CONTEXT_ON_EXCEPTION = False

    # Configuración de seguridad para tests
    SECRET_KEY = "test_secret_key"
    JWT_SECRET_KEY = "test_jwt_secret_key"

    # Desactivar CSRF para facilitar las pruebas
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_CSRF_IN_COOKIES = False
    JWT_CSRF_CHECK_FORM = False


class ProductionConfig(Config):
    """Configuración para el entorno de producción."""

    DEBUG = False

    # Configuración de seguridad para producción
    JWT_COOKIE_SECURE = True  # Requiere HTTPS
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = "Lax"

    # Configuración de base de datos desde variables de entorno
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    # Configuración CORS para producción
    CORS_ALLOW_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")


# Diccionario para acceder a las configuraciones por nombre
config_by_name = dict(
    development=DevelopmentConfig,
    testing=TestingConfig,
    production=ProductionConfig,
    default=DevelopmentConfig,  # Configuración por defecto si no se especifica ninguna
)

# Para cargar la API Key de Anthropic (ya la lee desde .env, pero la exponemos aquí para la app)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Podrías añadir una comprobación para asegurarte de que las claves importantes están cargadas
# if ANTHROPIC_API_KEY is None:
# print("WARNING: ANTHROPIC_API_KEY no está configurada en el archivo .env")
# if Config.SECRET_KEY == 'un_secreto_por_defecto_muy_seguro_y_dificil_de_adivinar' and os.getenv('FLASK_ENV') == 'production':
# print("WARNING: Estás usando la SECRET_KEY por defecto en un entorno que parece ser producción.")
