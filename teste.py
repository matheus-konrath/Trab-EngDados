import requests
from bs4 import BeautifulSoup
import pandas as pd

# URL do site que vamos fazer o scraping
url = 'https://finance.yahoo.com/most-active/'

# Fazendo a requisição para o site
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Encontrando a tabela de empresas mais ativas
table = soup.find('table', {'class': 'W(100%)'})

# Criando listas para armazenar os dados
tickers = []
names = []
prices = []
changes = []
volumes = []
market_caps = []

# Extraindo dados das 10 primeiras empresas
for row in table.find('tbody').find_all('tr')[:20]:
    cols = row.find_all('td')
    tickers.append(cols[0].text)
    names.append(cols[1].text)
    prices.append(cols[2].text)
    changes.append(cols[3].text)
    volumes.append(cols[6].text)
    market_caps.append(cols[7].text)

# Criando um DataFrame com os dados extraídos
df = pd.DataFrame({
    'Ticker': tickers,
    'Nome da Empresa': names,
    'Preço': prices,
    'Change': changes,
    'Volume': volumes,
    'Market Cap': market_caps
})

# Salvando os dados em um arquivo CSV
df.to_csv('empresas_mais_ativas.csv', index=False)

print("Dados salvos em 'empresas_mais_ativas.csv'")
