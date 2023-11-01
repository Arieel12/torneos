// Hacer una solicitud GET al servidor para obtener los datos
fetch('/torneos')
    .then(response => {
        // Verificar si la respuesta es de tipo HTML
        if (response.headers.get('content-type').includes('text/html')) {
            return response.text(); // Leer la respuesta como texto
        } else {
            return response.json(); // Leer la respuesta como JSON
        }
    })
    .then(data => {
        if (typeof data === 'string') {
            // La respuesta es HTML, colócala en la tabla
            const table = document.getElementById('torneos-table').getElementsByTagName('tbody')[0];
            table.innerHTML = data;
        } else {
            // La respuesta es JSON, procesa los datos
            // (esto se mantendrá si deseas agregar más funcionalidad en el futuro)
            const table = document.getElementById('torneos-table').getElementsByTagName('tbody')[0];
            data.forEach(torneos => {
                const row = table.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.innerHTML = torneos.id;
                cell2.innerHTML = torneos.nombre;
            });
        }
    })
    .catch(error => console.error('Error:', error));