from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models.usuario import Usuario


def roles_required(required_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = Usuario.query.get(user_id)
            if not user or user.rol not in required_roles:
                return jsonify(msg="Acceso denegado: rol no autorizado."), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
