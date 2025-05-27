# app/models/usuario.py
from app.extensions import db  # Usar la instancia centralizada de `db`
from datetime import datetime, date
from app.extensions import bcrypt
from app.models.inscripcion_clase import InscripcionClase


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_completo = db.Column(db.String(255), nullable=False)
    correo_electronico = db.Column(
        db.String(255), unique=True, nullable=False, index=True
    )
    hashed_password = db.Column(db.String(255), nullable=False)
    rol = db.Column(
        db.String(50), nullable=False, default="estudiante"
    )  # 'estudiante', 'docente' o 'admin'
    activo = db.Column(db.Boolean, default=True, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    ultimo_inicio_sesion = db.Column(db.DateTime)
    # PRIVACY_FEATURE: Campo para protección de menores
    fecha_nacimiento = db.Column(db.Date, nullable=True)

    # Relaciones - Usamos cadenas para evitar importaciones circulares
    inscripciones = db.relationship(
        "InscripcionClase",
        foreign_keys=[InscripcionClase.estudiante_id],
        back_populates="estudiante",
        lazy="dynamic"
    )
    
    # Relaciones adicionales
    clases_impartidas = db.relationship(
        "Clase",
        back_populates="docente",
        lazy="dynamic",
        cascade="all, delete-orphan",
        foreign_keys="Clase.docente_id",
    )
    
    respuestas = db.relationship(
        "Respuesta",
        back_populates="estudiante",
        lazy="dynamic",
        cascade="all, delete-orphan",
        foreign_keys="Respuesta.estudiante_id",
    )
    
    mensajes = db.relationship(
        "Mensaje",
        back_populates="usuario",
        lazy="dynamic",
        cascade="all, delete-orphan",
        foreign_keys="Mensaje.usuario_id",
    )

    def __repr__(self):
        return f"<Usuario {self.id}: {self.correo_electronico} ({self.rol})>"

    def set_password(self, password):
        """Crea un hash seguro para la contraseña."""
        self.hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        """Verifica la contraseña contra el hash almacenado."""
        return bcrypt.check_password_hash(self.hashed_password, password)

    def to_dict(self):
        """Convierte el objeto Usuario a un diccionario."""
        return {
            "id": self.id,
            "nombre_completo": self.nombre_completo,
            "correo_electronico": self.correo_electronico,
            "rol": self.rol,
            "fecha_creacion": self.fecha_creacion.isoformat()
            if self.fecha_creacion
            else None,
            "activo": self.activo,
        }

    @property
    def edad(self):
        if not self.fecha_nacimiento:
            return None
        today = date.today()
        return (
            today.year
            - self.fecha_nacimiento.year
            - (
                (today.month, today.day)
                < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )
        )


# Configuración de relaciones dinámicas
def setup_relationships():
    """Configura las relaciones después de que todos los modelos estén definidos."""
    from .clase import Clase
    from .respuesta import Respuesta
    from .inscripcion_clase import InscripcionClase
    from .mensaje import Mensaje

    # Configurar relaciones para Usuario
    if not hasattr(Usuario, "clases_impartidas"):
        Usuario.clases_impartidas = db.relationship(
            "Clase",
            back_populates="docente",
            lazy="dynamic",
            cascade="all, delete-orphan",
            foreign_keys="Clase.docente_id",
        )

    if not hasattr(Usuario, "inscripciones"):
        Usuario.inscripciones = db.relationship(
            "InscripcionClase",
            back_populates="usuario",
            lazy="dynamic",
            cascade="all, delete-orphan",
            foreign_keys="InscripcionClase.estudiante_id",
        )

    if not hasattr(Usuario, "respuestas"):
        Usuario.respuestas = db.relationship(
            "Respuesta",
            back_populates="estudiante",
            lazy="dynamic",
            cascade="all, delete-orphan",
            foreign_keys="Respuesta.estudiante_id",
        )

    if not hasattr(Usuario, "mensajes"):
        Usuario.mensajes = db.relationship(
            "Mensaje",
            back_populates="usuario",
            lazy="dynamic",
            cascade="all, delete-orphan",
            foreign_keys="Mensaje.usuario_id",
        )

    print("Relaciones del modelo Usuario configuradas correctamente")
