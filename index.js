
const {conexion} = require('./conexion');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(express.static(__dirname)); // Sirve archivos estáticos desde la raíz del proyecto
app.use(bodyParser.json());

const db = conexion();

app.post('/torneos', (req, res) => {
  const nuevoTorneo = req.body;
  console.log(nuevoTorneo);
  db.crear_torneo(nuevoTorneo, (error, results) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json({ mensaje: 'Nuevo Torneo Creado' });
    }
  });
});

app.get('/torneos', (req, res) => {
  db.mostrar_torneos((error, results) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(results);
    }
  });
});

app.put('/torneos', (req, res) =>{
  db.actualizar_torneo_byid((error, results)=>{
    if(error){
      res.status(500).json(error);
    } else{
      res.json({mensaje: 'Torneo Actualizado Correctamente', results});
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})