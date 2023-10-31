const {conexion} = require('./conexion');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//require('./conexion')(app, crear_torneo());

app.use(bodyParser.json());

app.get('/torneos', (req, res) => {
  /*busca_torneos()
    .then(result =>{
      res.json(result);
    }).catch(e => res.status(500).json(e));*/
  res.json({"mensaje": "HOLA"})
});

app.post('/torneos', (req, res) =>{
  const nuevoTorneo = req.body;
  console.log(nuevoTorneo);
  conexion.crear_torneo(nuevoTorneo)
    .then(()=>{
      res.json({"mensaje": "Nuevo Torneo Creado"});
    }).catch(e => {
      res.status(500).json(e);
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})