from sqlalchemy.orm import relationship

def setup_relationships():
    # Importaciones diferidas
    from .clase import Clase
    from .mensaje import Mensaje
    from .usuario import Usuario
    
    # Configurar relaciones
    Clase.mensajes = relationship('Mensaje', back_populates='clase', cascade='all, delete-orphan', lazy='dynamic')
    Mensaje.clase = relationship('Clase', back_populates='mensajes')
    Usuario.mensajes = relationship('Mensaje', back_populates='usuario', lazy='dynamic')
