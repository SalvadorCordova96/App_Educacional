# TEST: Pruebas unitarias para el modelo Usuario
import pytest
from app.models.usuario import Usuario


def test_usuario_creation():
    user = Usuario(nombre="Test", email="test@example.com")
    user.set_password("secret")
    assert user.check_password("secret") is True
