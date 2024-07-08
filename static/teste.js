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
            const precoFormatado = data.preco !== "N/A" ? parseFloat(data.preco).toFixed(2) : "N/A";
            row.innerHTML = `
                <td>${data.data}</td>
                <td>${data.empresa}</td>
                <td>${precoFormatado}</td>
            `;
            tableBody.appendChild(row);
        })
        .catch(error => console.error('Fetch error:', error));
});
