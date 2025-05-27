from apispec import APISpec
from apispec_webframeworks.flask import FlaskPlugin
from flask_swagger_ui import get_swaggerui_blueprint
from flask import jsonify

spec = APISpec(
    title="API Aplicación Educativa",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[FlaskPlugin()],
)

SWAGGER_URL = "/api/docs"
API_URL = "/api/swagger.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL, API_URL, config={"app_name": "API Educacional"}
)


def register_docs(app):
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    @app.route(API_URL)
    def create_swagger_spec():
        from app.auth import routes as auth_routes
        from app.evaluations import routes as eval_routes

        with app.test_request_context():
            spec.path(view=auth_routes.register_user)
            spec.path(view=auth_routes.login_user)
            spec.path(view=eval_routes.generate_ia_questions)

        return jsonify(spec.to_dict())
