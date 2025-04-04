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
        result = subprocess.run(
            ["python3", "/usr/src/app/scripts/lancer_pipeline.py"],
            capture_output=True, text=True
        )

        if result.returncode != 0:
            return jsonify({"error": "Erreur de conversion", "details": result.stderr}), 500

        return jsonify({"message": "Conversion réussie!", "output": result.stdout}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/flag', methods=['GET'])
def flag():
    try:
        result = subprocess.run(
            ["python3", "/usr/src/app/scripts/flag.py"],
            capture_output=True, text=True
        )

        if result.returncode != 0:
            return jsonify({"error": "Erreur de conversion", "details": result.stderr}), 500

        try:
            output_data = json.loads(result.stdout)
        except json.JSONDecodeError:
            return jsonify({"error": "Sortie JSON invalide", "output": result.stdout}), 500

        return jsonify(output_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500