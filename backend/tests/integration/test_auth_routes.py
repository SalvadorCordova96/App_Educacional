# TEST: Pruebas de integración para autenticación
import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client


def test_register(client):
    response = client.post(
        "/api/auth/register",
        json={"nombre": "Test", "email": "test@example.com", "password": "secret"},
    )
    assert response.status_code == 201
