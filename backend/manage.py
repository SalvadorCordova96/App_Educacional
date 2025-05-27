# backend/manage.py
import os
from app import create_app, db  # Importa la factory y la instancia de db

# Importa tus modelos aquí a medida que los vayas creando para que Flask-Migrate los detecte
# from app.models import Usuario, Clase, Modulo, Leccion, etc.

# Carga la configuración de .flaskenv y .env
# Esto es útil principalmente si ejecutas este script directamente con 'python manage.py <comando_custom>'
# Para los comandos 'flask db', Flask carga .flaskenv automáticamente.
from dotenv import load_dotenv

dotenv_path_flaskenv = os.path.join(os.path.dirname(__file__), ".flaskenv")
dotenv_path_env = os.path.join(os.path.dirname(__file__), ".env")

if os.path.exists(dotenv_path_flaskenv):
    load_dotenv(dotenv_path_flaskenv)
if os.path.exists(dotenv_path_env):
    load_dotenv(dotenv_path_env)

# Crea una instancia de la aplicación usando la configuración del entorno
# (FLASK_ENV de .flaskenv o 'development' por defecto)
app = create_app(os.getenv("FLASK_ENV") or "development")

# El contexto de la aplicación es necesario para que comandos como los de Flask-Migrate
# que no se ejecutan a través del CLI de Flask (si los tuvieras aquí) puedan acceder a la app
# y sus extensiones. Con los comandos 'flask db', esto se maneja automáticamente.
# app.app_context().push() # No es estrictamente necesario si solo usas 'flask db'

# Nota sobre Flask-Migrate:
# Con Flask-Migrate >= 4.0.0, los comandos de migración se ejecutan típicamente como:
# flask db init (solo una vez para crear la carpeta migrations)
# flask db migrate -m "mensaje descriptivo de la migración"
# flask db upgrade
#
# Asegúrate de tener FLASK_APP=app:create_app en tu .flaskenv o como variable de entorno.
# Este archivo manage.py no es estrictamente necesario para las migraciones con el CLI moderno de Flask,
# pero se mantiene aquí como placeholder para posibles comandos de gestión personalizados en el futuro.

from flask.cli import AppGroup
from app.models.usuario import Usuario
import click

# Grupo de comandos para usuarios
user_cli = AppGroup("user", help="Gestión de usuarios")


@user_cli.command("createadmin")
@click.option("--nombre", prompt=True)
@click.option("--email", prompt=True)
@click.option("--password", prompt=True, hide_input=True)
def create_admin(nombre, email, password):
    if Usuario.query.filter_by(correo_electronico=email).first():
        click.echo("Error: Usuario ya existe")
        return
    admin = Usuario(nombre_completo=nombre, correo_electronico=email, rol="admin")
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()
    click.echo(f"Admin {email} creado")


app.cli.add_command(user_cli)

if __name__ == "__main__":
    # Este bloque solo se ejecuta si corres 'python manage.py' directamente.
    # No es la forma usual de correr la app de desarrollo (para eso está 'flask run' o 'npm run dev:backend').
    print("Archivo de gestión 'manage.py'.")
    print("Para iniciar la aplicación en modo desarrollo, usa el comando 'flask run'")
    print(
        "  (asegúrate de que FLASK_APP y FLASK_ENV estén configurados en .flaskenv o como variables de entorno)."
    )
    print("Para migraciones de base de datos, usa los comandos 'flask db ...'.")
    # Por ejemplo, para correr la app desde aquí (no recomendado para desarrollo normal):
    # app.run(debug=app.config.get('DEBUG', False))
