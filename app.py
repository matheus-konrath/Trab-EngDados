from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

# Configurações do banco de dados
db_config = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '27082001'),
    'database': os.getenv('DB_NAME', 'ativos_financeiros')
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as e:
        print(f"Error: {e}")
        return None

@app.route('/precos', methods=['GET'])
def get_precos():
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM precos")
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
