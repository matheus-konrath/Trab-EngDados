import React, { useState } from 'react';
import { Chart } from 'chart.js';

function renderChart(data) {
  const ctx = document.getElementById('stock-chart').getContext('2d');
  const labels = data.precos.map(entry => entry.data);
  const prices = data.precos.map(entry => parseFloat(entry.preco).toFixed(2));
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
  if (window.stockChart) {
    window.stockChart.destroy();
  }
  window.stockChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions
  });
}

function FormComponent() {
  const [empresa, setEmpresa] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:5000/precos?empresa=${empresa}&data=${data}`)
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
        const precoFormatado = data.precos.length > 0 ? parseFloat(data.precos[data.precos.length - 1].preco).toFixed(2) : "N/A";
        row.innerHTML = `
          <td>${data.precos.length > 0 ? data.precos[data.precos.length - 1].data : 'N/A'}</td>
          <td>${data.empresa}</td>
          <td>${precoFormatado}</td>
        `;
        tableBody.appendChild(row);
        renderChart(data);
      })
      .catch(error => console.error('Fetch error:', error));
  };

  return (
    <div className="form-container">
      <form id="stock-form" onSubmit={handleSubmit}>
        <label htmlFor="empresa">Empresa:</label>
        <input type="text" id="empresa" name="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />
        <label htmlFor="data">Data (YYYY-MM-DD):</label>
        <input type="date" id="data" name="data" value={data} onChange={(e) => setData(e.target.value)} required />
        <button type="submit">Buscar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody id="stock-data">
        </tbody>
      </table>
    </div>
  );
}

export default FormComponent;
