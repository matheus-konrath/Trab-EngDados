fetch('http://localhost:5000/precos')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aqui você pode manipular os dados e exibi-los no front-end como desejar
    })
    .catch(error => console.error('Error:', error));
