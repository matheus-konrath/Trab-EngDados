fetch('http://localhost:5000/precos')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aqui você pode manipular os dados e exibi-los no front-end como desejar
    })
    .catch(error => console.error('Error:', error));
    function renderChart(data) {
        const ctx = document.getElementById('stock-chart').getContext('2d');
        
        const labels = data.precos.map(entry => entry.data);
        const prices = data.precos.map(entry => parseFloat(entry.preco).toFixed(2));
    
        // Configurar os dados do gráfico
        const chartData = {
            labels: labels,
            datasets: [{
                label: `${data.empresa} Price`,
                data: prices,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        };
    
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    
        // Destruir o gráfico anterior se ele existir
        if (window.stockChart) {
            window.stockChart.destroy();
        }
    
        // Criar o novo gráfico
        window.stockChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }
    
    document.getElementById('stock-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const empresa = document.getElementById('empresa').value;
        const data = document.getElementById('data').value;
    
        fetch(`http://localhost:5000/precos?empresa=${empresa}&data=${data}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Verifique se os dados são exibidos corretamente no console
                const tableBody = document.getElementById('stock-data');
                tableBody.innerHTML = ''; // Limpa os resultados anteriores
                const row = document.createElement('tr');
                const precoFormatado = data.precos.length > 0 ? parseFloat(data.precos[data.precos.length - 1].preco).toFixed(2) : "N/A";
                row.innerHTML = `
                    <td>${data.precos.length > 0 ? data.precos[data.precos.length - 1].data : 'N/A'}</td>
                    <td>${data.empresa}</td>
                    <td>${precoFormatado}</td>
                `;
                tableBody.appendChild(row);
                renderChart(data); // Chama a função para renderizar o gráfico
            })
            .catch(error => console.error('Fetch error:', error));
    });
    