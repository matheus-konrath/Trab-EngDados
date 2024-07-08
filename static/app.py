from flask import Flask, jsonify, request, send_from_directory
import ativos

app = Flask(__name__)

@app.route('/precos', methods=['GET'])
def get_precos():
    empresa = request.args.get('empresa')
    data = request.args.get('data')
    print(f"Recebido pedido para empresa: {empresa}, data: {data}")  # Log para depuração
    if empresa and data:
        preco_info = ativos.get_preco(empresa, data)
        print(f"Resposta do backend: {preco_info}")  # Log para depuração
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
