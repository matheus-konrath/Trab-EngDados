import yfinance as yf
from datetime import datetime, timedelta

def get_preco(empresa, data):
    print(f"Buscando preço para {empresa} na data {data}")  # Log para depuração
    try:
        # Converter a data para o formato correto
        data_inicio = datetime.strptime(data, '%Y-%m-%d')
        data_fim = data_inicio + timedelta(days=1)  # Incrementa um dia para incluir a data no histórico

        acao = yf.Ticker(empresa)
        hist = acao.history(start=data_inicio.strftime('%Y-%m-%d'), end=data_fim.strftime('%Y-%m-%d'))
        
        if not hist.empty:
            preco = hist['Close'].iloc[0]
            return {"data": data, "empresa": empresa, "preco": preco}
        else:
            return {"data": data, "empresa": empresa, "preco": "N/A"}
    except Exception as e:
        print(f"Erro ao buscar preço: {e}")
        return {"data": data, "empresa": empresa, "preco": "Erro ao buscar preço"}
