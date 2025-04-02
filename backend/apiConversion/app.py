from flask import Flask
from dotenv import load_dotenv
import os
import src.routes
from loguru import logger

# Charger les variables d'environnement depuis .env
load_dotenv()

app = Flask(__name__)

# Création de l'instance ClickHouse
logger.critical('Début du log')

# Enregistrer le blueprint des routes
app.register_blueprint(src.routes.bp)

flask_port = int(os.getenv('FLASK_PORT', 5002))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=flask_port)

