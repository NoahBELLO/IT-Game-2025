from flask import Blueprint, jsonify, request
import os, json
from loguru import logger
import subprocess

bp = Blueprint('routes', __name__)
@bp.route('/all', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})

@bp.route('/conversion', methods=['GET'])
def conversion():
    try:
        # Exécuter le script Python de conversion
        result = subprocess.run(
            ["python3", "/usr/src/app/scripts/lancer_pipeline.py"],  # Exécuter le script sans paramètres
            capture_output=True, text=True
        )

        # Vérifier si la conversion a réussi
        if result.returncode != 0:
            return jsonify({"error": "Erreur de conversion", "details": result.stderr}), 500

        return jsonify({"message": "Conversion réussie!", "output": result.stdout}), 200
        # return jsonify({"result": "test"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
