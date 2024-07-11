import React from 'react';
import './App.css';
import FormComponent from './FormComponent';
import './teste.js';

function App() {
  return (
    <div className="App">
      <h1>Stock Prices</h1>
      <FormComponent />
      <div id="chart-container">
        <canvas id="stock-chart"></canvas>
      </div>
    </div>
  );
}

export default App;
