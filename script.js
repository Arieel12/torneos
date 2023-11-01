// Hacer una solicitud GET al servidor para obtener los datos
fetch('/torneos')
    .then(response => response.json())
    .then(data => {
        // Obtener la referencia a la tabla
        const table = document.getElementById('torneos-table').getElementsByTagName('tbody')[0];

        // Iterar a través de los datos y agregar filas a la tabla
        data.forEach(torneo => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.innerHTML = torneo.id;
            cell2.innerHTML = torneo.nombre;
        });
    })
    .catch(error => console.error('Error:', error));