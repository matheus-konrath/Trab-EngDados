from flask import Flask, jsonify, request, send_from_directory
import mysql.connector
import ativos

app = Flask(__name__)

# Configuração do banco de dados
db_config = {
    'user': 'root',          # seu usuário do MySQL
    'password': '27082001',  # sua senha do MySQL
    'host': '127.0.0.1',
    'database': 'stock_data'
}

def save_user_choice(empresa, data, preco):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO stock (empresa, data, preco) VALUES (%s, %s, %s)", (empresa, data, preco))
        conn.commit()
        cursor.close()
        conn.close()
        print("Escolha do usuario salva com sucesso!")
    except mysql.connector.Error as err:
        print(f"Erro ao salvar escolha do usuario: {err}")

@app.route('/precos', methods=['GET'])
def get_precos():
    empresa = request.args.get('empresa')
    data = request.args.get('data')
    print(f"Recebido pedido para empresa: {empresa}, data: {data}")  # Log para depuração
    if empresa and data:
        preco_info = ativos.get_preco(empresa, data)
        print(f"Resposta do backend: {preco_info}")  # Log para depuração
        if preco_info['precos']:
            ultimo_preco = preco_info['precos'][-1]['preco']
            save_user_choice(empresa, data, ultimo_preco)
        return jsonify(preco_info)
    else:
        return jsonify({"error": "Missing parameters"}), 400

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)