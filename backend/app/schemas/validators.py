# app/schemas/validators.py
"""
Módulo que contiene validadores personalizados para los esquemas de la aplicación.
"""
import re
from datetime import datetime
from marshmallow import ValidationError


def validate_email(email):
    """
    Valida que el formato del correo electrónico sea válido.

    Args:
        email (str): Correo electrónico a validar.

    Raises:
        ValidationError: Si el formato del correo no es válido.
    """
    if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
        raise ValidationError("Formato de correo electrónico inválido")


def validate_password(password):
    """
    Valida que la contraseña cumpla con los requisitos de seguridad.

    Args:
        password (str): Contraseña a validar.

    Raises:
        ValidationError: Si la contraseña no cumple con los requisitos.
    """
    if len(password) < 8:
        raise ValidationError("La contraseña debe tener al menos 8 caracteres")
    if not re.search(r"[A-Z]", password):
        raise ValidationError(
            "La contraseña debe contener al menos una letra mayúscula"
        )
    if not re.search(r"[a-z]", password):
        raise ValidationError(
            "La contraseña debe contener al menos una letra minúscula"
        )
    if not re.search(r"\d", password):
        raise ValidationError("La contraseña debe contener al menos un número")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError(
            "La contraseña debe contener al menos un carácter especial"
        )


def validate_date_not_in_past(date_str):
    """
    Valida que la fecha no sea anterior a la fecha actual.

    Args:
        date_str (str): Fecha en formato ISO a validar.

    Raises:
        ValidationError: Si la fecha es anterior a la fecha actual.
    """
    try:
        date_obj = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        if date_obj < datetime.now():
            raise ValidationError("La fecha no puede ser anterior a la fecha actual")
    except ValueError:
        raise ValidationError("Formato de fecha inválido. Use el formato ISO 8601")


def validate_positive_number(value, field_name):
    """
    Valida que el valor sea un número positivo.

    Args:
        value: Valor a validar.
        field_name (str): Nombre del campo para el mensaje de error.

    Raises:
        ValidationError: Si el valor no es un número positivo.
    """
    if value is not None and value < 0:
        raise ValidationError(f"{field_name} debe ser un número positivo")


def validate_html_content(content):
    """
    Valida que el contenido HTML sea seguro o cumpla con ciertas reglas.
    Args:
        content (str): Contenido HTML a validar.
    Raises:
        ValidationError: Si el contenido no es válido.
    """
    if not isinstance(content, str):
        raise ValidationError("El contenido debe ser una cadena de texto.")
    # Ejemplo simple: prohibir la etiqueta <script>
    if '<script>' in content.lower():
        raise ValidationError("El contenido no puede contener scripts.")


def validate_percentage(value):
    # Función dummy para evitar error de importación
    pass
