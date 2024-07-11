import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function FormComponent() {
	const [empresa, setEmpresa] = useState('');
	const [data, setData] = useState('');
	const [chartData, setChartData] = useState(null);

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
				console.log('Fetched Data:', data);
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

				setChartData(chartData);
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
			{chartData && (
				<div id="chart-container">
					<Line data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
				</div>
			)}
		</div>
	);
}

export default FormComponent;
