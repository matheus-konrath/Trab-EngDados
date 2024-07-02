import mysql.connector
import yfinance as yf
import pandas as pd

# Dados dos ativos e datas
ativos = ['PETR4.SA', 'VALE3.SA', 'ITUB3.SA']
start_date = "2024-01-01"
end_date = "2024-06-20"

# Download dos dados
dados = yf.download(ativos, start=start_date, end=end_date)

# Obter os nomes das empresas
empresa_nomes = {}
for ativo in ativos:
    ticker = yf.Ticker(ativo)
    info = ticker.info
    empresa_nomes[ativo] = info.get('longName', 'Nome não disponível')

# Preparar DataFrame para exibir preços e nomes das empresas
precos = dados['Close']  # Seleciona os preços de fechamento
precos.columns = [empresa_nomes[ativo] for ativo in precos.columns]  # Renomeia as colunas com os nomes das empresas

# Conectar ao banco de dados
conn = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="27082001",
    database="ativos_financeiros"
)

cursor = conn.cursor()

# Inserir dados no banco de dados
for data in precos.index:
    for empresa in precos.columns:
        preco_fechar = precos.loc[data, empresa]
        if not pd.isna(preco_fechar):  # Verifica se o preço não é NaN
            cursor.execute("""
                INSERT INTO precos (data, empresa, preco_fechar)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE preco_fechar = VALUES(preco_fechar)
            """, (data.date(), empresa, preco_fechar))

# Commit e fechar conexão
conn.commit()
cursor.close()
conn.close()

print("Dados inseridos no banco de dados com sucesso!")