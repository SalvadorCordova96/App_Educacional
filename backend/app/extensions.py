# backend/app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from redis import Redis
from flask_marshmallow import Marshmallow # Added import

# Instancia única de SQLAlchemy
# Esta instancia debe ser usada en toda la aplicación

db = SQLAlchemy()
bcrypt = Bcrypt()
redis_client = Redis(host='localhost', port=6379, decode_responses=True)
ma = Marshmallow() # Added Marshmallow instance
