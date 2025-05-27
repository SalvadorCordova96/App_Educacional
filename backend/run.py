# backend/run.py
import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Configuración adicional si es necesaria
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", "5000"))

    print(f"Iniciando la aplicación en modo {'desarrollo' if debug else 'producción'}")
    print(f"Servidor ejecutándose en http://{host}:{port}")

    # Iniciar la aplicación
    app.run(host="0.0.0.0", port=5000, debug=True)
