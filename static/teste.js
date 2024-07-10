function renderChart(data) {
    const ctx = document.getElementById('stock-chart').getContext('2d');
    
    const labels = data.previsoes.map(entry => entry.data);
    const prices = data.previsoes.map(entry => parseFloat(entry.preco).toFixed(2));
    
    // Encontrar a posição do início da previsão
    const historicalDataCount = data.previsoes.length - 30;
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: `${data.empresa} Price Prediction`,
            data: prices,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: historicalDataCount,
                        xMax: historicalDataCount,
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Início da Previsão',
                            enabled: true,
                            position: 'top'
                        }
                    }
                }
            }
        }
    };

    if (window.stockChart) {
        window.stockChart.destroy();
    }

    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

document.getElementById('stock-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const empresa = document.getElementById('empresa').value;
    const dataInicio = document.getElementById('data-inicio').value;
    const dataFim = document.getElementById('data-fim').value;

    fetch(`http://localhost:5000/prever?empresa=${empresa}&start=${dataInicio}&end=${dataFim}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const tableBody = document.getElementById('stock-data');
            tableBody.innerHTML = '';
            const row = document.createElement('tr');
            const precoFormatado = data.previsoes.length > 0 ? parseFloat(data.previsoes[data.previsoes.length - 1].preco).toFixed(2) : "N/A";
            row.innerHTML = `
                <td>${data.previsoes.length > 0 ? data.previsoes[data.previsoes.length - 1].data : 'N/A'}</td>
                <td>${data.empresa}</td>
                <td>${precoFormatado}</td>
            `;
            tableBody.appendChild(row);
            renderChart(data);
        })
        .catch(error => console.error('Fetch error:', error));
});
