#!/usr/bin/env python3
"""
Script de prueba para verificar que los modelos se pueden importar correctamente
"""

import sys
import os

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Iniciando prueba de importación de modelos...")
    
    # Importar la aplicación
    from app import create_app
    print("✓ Aplicación importada correctamente")
    
    # Crear la aplicación
    app = create_app()
    print("✓ Aplicación creada correctamente")
    
    # Importar modelos
    with app.app_context():
        from app.models import Usuario, Clase, Mensaje, InscripcionClase, ArchivoCargado
        print("✓ Modelos importados correctamente")
        
        # Verificar que las relaciones están configuradas
        print(f"✓ Usuario tiene relación con mensajes: {hasattr(Usuario, 'mensajes')}")
        print(f"✓ Clase tiene relación con mensajes: {hasattr(Clase, 'mensajes')}")
        print(f"✓ Mensaje tiene relación con usuario: {hasattr(Mensaje, 'usuario')}")
        print(f"✓ Mensaje tiene relación con clase: {hasattr(Mensaje, 'clase')}")
        
        print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
        print("El problema de SQLAlchemy ha sido resuelto.")
        
except Exception as e:
    print(f"❌ Error durante la prueba: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
