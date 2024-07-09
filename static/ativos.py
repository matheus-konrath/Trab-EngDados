import yfinance as yf
from datetime import datetime, timedelta

def get_preco(empresa, data):
    print(f"Buscando preço para {empresa} na data {data}")  # Log para depuração
    try:
        # Converter a data para o formato correto
        data_inicio = datetime.strptime(data, '%Y-%m-%d') - timedelta(days=30)  # 30 dias antes da data escolhida
        data_fim = datetime.strptime(data, '%Y-%m-%d') + timedelta(days=1)  # Inclui a data escolhida

        acao = yf.Ticker(empresa)
        hist = acao.history(start=data_inicio.strftime('%Y-%m-%d'), end=data_fim.strftime('%Y-%m-%d'))
        
        if not hist.empty:
            preco_data = [{"data": date.strftime('%Y-%m-%d'), "preco": price} for date, price in hist['Close'].items()]
            return {"empresa": empresa, "precos": preco_data}
        else:
            return {"empresa": empresa, "precos": []}
    except Exception as e:
        print(f"Erro ao buscar preço: {e}")
        return {"empresa": empresa, "precos": []}
