# app/schemas/error_handlers.py
"""
Módulo que contiene manejadores de errores para los esquemas de la aplicación.
"""
from marshmallow import ValidationError
from flask import jsonify


def validation_error_handler(error):
    """
    Maneja los errores de validación de Marshmallow.

    Args:
        error (ValidationError): Error de validación.

    Returns:
        tuple: Tupla con la respuesta JSON y el código de estado HTTP.
    """
    return (
        jsonify(
            {
                "status": "error",
                "message": "Error de validación",
                "errors": error.messages,
            }
        ),
        400,
    )


def handle_validation_error(error):
    """
    Maneja los errores de validación de los esquemas.

    Args:
        error (ValidationError): Error de validación.

    Returns:
        dict: Diccionario con el error formateado.
    """
    return {
        "status": "error",
        "message": "Error de validación",
        "errors": error.messages,
    }


def handle_internal_error(error):
    """
    Maneja errores internos del servidor.

    Args:
        error (Exception): Error interno.

    Returns:
        dict: Diccionario con el error formateado.
    """
    return {
        "status": "error",
        "message": "Error interno del servidor",
        "error": str(error),
    }


def handle_not_found_error(resource, id):
    """
    Maneja errores de recurso no encontrado.

    Args:
        resource (str): Nombre del recurso no encontrado.
        id: Identificador del recurso.

    Returns:
        dict: Diccionario con el error formateado.
    """
    return {
        "status": "error",
        "message": f"{resource} con id {id} no encontrado",
        "errors": {resource: ["No encontrado"]},
    }
