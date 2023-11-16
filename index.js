
const {conexion} = require('./conexion');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const port = 3000;
app.use(express.static(__dirname)); // Sirve archivos estáticos desde la raíz del proyecto
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

const db = conexion();

//TORNEOS

app.post('/torneos', (req, res) => {
  const nuevoTorneo = req.body;
  console.log(nuevoTorneo);
  db.crear_torneo(nuevoTorneo, (error, results) => {
    if (error) {
      res.status(500).json(error);
      console.log(error)
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
  const torneo_actualizado = req.body;
  db.actualizar_torneo_byid(torneo_actualizado,(error, results)=>{
    if(error){
      res.status(500).json(error);
    } else{
      res.json({mensaje: 'Torneo Actualizado Correctamente', results});
    }
  })
})


// EQUIPOS

app.get('/equipos', (req, res)=>{
  db.mostrar_equipos ((error, results) =>{
    if(error){
      res.status(500).json({mensaje: 'No se pudo mostrar los equipos'})
    } else{
      res.json(results)
    }
  });
});

app.get('/equipostorneo', (req, res)=>{
  const torneo = req.query;
  db.mostrar_equipos_torneo (torneo, (error,results)=>{
    if(error){
      res.status(500).json({mensaje: 'Este torneo no tiene equipos'})
    } else{
      res.json(results)
    }
  })
})

app.post('/equipos', (req, res) =>{
  const nuevo_equipo = req.body;
  db.crear_equipo(nuevo_equipo, (error, results) =>{
    if(error){
      res.status(500).json({mensaje: 'El equipo ya existe'});
    } else{
      res.json({mensaje: 'Nuevo equipo creado'});
    }
  })
})

//PARTIDOS

app.post('/partidos', (req, res) =>{
  const nuevo_partido = req.body;
  console.log(nuevo_partido);
  db.crear_partido(nuevo_partido, (error, results) =>{
    if(error){
      res.status(500).json(error);
    } else{
      res.json({mensaje: 'El partido ha sido creado'});
    }
  });
});

app.put('/partidos', (req, res) =>{
  const actualizar_partido = req.body;
  db.cargar_resultados(actualizar_partido, (error, results) =>{
    if(error){
      res.status(500).json(error);
    }else {
      res.json({mensaje: 'Los resultados han sido cargados'})
    }
  })
})

app.get('/partidos', (req, res)=>{
  db.mostrar_partidos((error, results) =>{
    if(error){
      res.status(500).json({mensaje: 'No se pudo devolver a los partidos'});
    } else{
      res.json(results)
    }
  });
});

 // FIXTURE

 app.post('/fixture', (req, res) =>{
  const nuevo_fixture = req.body;
  db.crear_fixture(nuevo_fixture,(error, results) =>{
    if(error){
      res.status(500).json(error);
    } else{
      res.json({mensaje: "Fixture creado correctamente"})
    }
  })
 })

 app.get('/fixture', (req, res)=>{
  const mostrar = req.body;
  db.mostrar_fixture(mostrar, (error, results) =>{
    if(error){
      res.status(500).json({mensaje: 'No se pudo devolver a los partidos'});
    } else{
      res.json(results)
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})