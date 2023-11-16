const { errors } = require('ethers');

const conexion = () => {
  const mysql = require('mysql');

  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'torneos',
  };

  const connection = mysql.createConnection(dbConfig);

  //TORNEOS
  const table = 'torneos';

  const crear_torneo = ({ nombre }, callback) => {
    // Verificar si el nombre ya existe
    const verificarExistenciaSql = 'SELECT COUNT(*) AS count FROM torneos WHERE nombre = ?';
    connection.query(verificarExistenciaSql, [nombre], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const nombreYaExiste = results[0].count > 0;
  
        if (nombreYaExiste) {
          const error = ({mensaje: 'El nombre ya existe en la base de datos'});
          callback(error, null);
        } else {
          // El nombre no existe, realizar la inserción
          const sql = `INSERT INTO ${table} (nombre) VALUES (?)`;
          connection.query(sql, [nombre], (insertError, insertResults) => {
            if (insertError) {
              callback(insertError, null);
            } else {
              callback(null, insertResults);
            }
          });
        }
      }
    });
  };

  const mostrar_torneos = (callback) => {
    const sql = `SELECT id, nombre, fecha_creacion FROM torneos`;
    connection.query(sql,(error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  };

  const actualizar_torneo_byid = ({ nombre, id }, callback) => {
    const sql = `UPDATE torneos SET nombre = ? WHERE id = ?`;
    connection.query(sql, [nombre, id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  };

  //EQUIPOS

  const table2 = 'equipos';

  const crear_equipo = ({nombre, id_torneo, numero_jugadores}, callback) =>{
    const equipo_existente = `SELECT COUNT (*) AS count FROM equipos WHERE nombre = ?`;
    connection.query(equipo_existente, [nombre], (error, results)=>{ 
      if(error){
        callback (error, null)
      } else{
        const equipo_existe = results[0].count > 0; 
        if(equipo_existe){
          const error = new Error ({mensaje: 'El equipo ya existe'});
          callback(error, null)
        } else{
          const sql = `INSERT INTO ${table2} (nombre, id_torneo, numero_jugadores) VALUES (?, ?, ?)`;
          connection.query(sql, [nombre, id_torneo, numero_jugadores], (error2, result2) =>{
            if(error2){
              callback(error2, null)
            }else{
              callback(null, result2)
            }
          });
        }
      }
    }); 
  }

  const mostrar_equipos = (callback) =>{
    const sql = `SELECT id, nombre, id_torneo, numero_jugadores FROM equipos`;
    connection.query(sql,(error, results) =>{
      if(error){
        callback(error, null)
      } else{
        callback(null, results)
      }
    });
  };


  const mostrar_equipos_torneo = ({id_torneo}, callback) =>{
    const sql = `SELECT id, nombre FROM equipos WHERE id_torneo = ?`;
    connection.query(sql, [id_torneo], (error, results)=>{ 
      if(error){
        callback(error, null)
      }else{
        callback(null, results)
      }
    });
  };

  //PARTIDOS

  const crear_partido = ({ id_equipo1, id_equipo2, goles_equipo1, goles_equipo2 }, callback) => {
    // Verificar si el equipo 1 existe
    const equipo1existeSql = `SELECT COUNT(*) AS count FROM equipos WHERE id = ?`;
    connection.query(equipo1existeSql, [id_equipo1], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const equipo1NoExiste = results[0].count === 0;
  
        // Verificar si el equipo 2 existe
        const equipo2existeSql = `SELECT COUNT(*) AS count FROM equipos WHERE id = ?`;
        connection.query(equipo2existeSql, [id_equipo2], (error, results) => {
          if (error) {
            callback(error, null);
          } else {
            const equipo2NoExiste = results[0].count === 0;
  
            if (equipo1NoExiste || equipo2NoExiste) {
              const error = {mensaje: 'El equipo 1 o el equipo 2 NO existe'};
              callback(error, null);
            } else {
              // Chequear si se encuentan en el mismo torneo
              const id_torneo_equipo1 = `SELECT id_torneo FROM equipos WHERE id = ?`;
              connection.query(id_torneo_equipo1, [id_equipo1], (error, results_equipo1) =>{
                if(error){
                  callback(error, null);
                } else{
                  const id_torneo_equipo2 = `SELECT id_torneo FROM equipos WHERE id = ?`;
                  connection.query(id_torneo_equipo2, [id_equipo2], (error, results_equipo2) =>{
                    if(error){
                      callback(error, null);
                    } else{
                      console.log(results_equipo1[0].id_torneo !== results_equipo2[0].id_torneo)
                      if (results_equipo1[0].id_torneo !== results_equipo2[0].id_torneo) {
                        error = {mensaje: 'Los equipos no se encuentran en el mismo torneo'}
                        callback(error, null);
                      } else{
                        // Ambos equipos existen, crear partido
                        const sql = `INSERT INTO partidos (id_torneo, id_equipo1, id_equipo2, goles_equipo1, goles_equipo2) VALUES (?, ?, ?, ?, ?)`;
                        connection.query(sql, [results_equipo1[0].id_torneo, id_equipo1, id_equipo2, goles_equipo1, goles_equipo2], (insertError, insertResults) => {
                          if (insertError) {
                            callback(insertError, null);
                          } else {
                            callback(null, insertResults);
                          }
                        });
                      }
                    }
                  })
                }
              })
              
            }
          }
        });
      }
    });
  };

  const cargar_resultados = ({goles_equipo1, goles_equipo2, id}, callback) =>{
    const InsertarResultadoSQL = `UPDATE partidos SET goles_equipo1 = ?, goles_equipo2 = ? WHERE id = ?`;
    connection.query(InsertarResultadoSQL, [goles_equipo1, goles_equipo2, id], (error, results) =>{
      if(error){
        callback(error,null)
      }else{
        callback(null, results)
      }
    })
  }

  const mostrar_partidos = (callback) =>{
    const sql = `SELECT id, id_torneo, id_equipo1, id_equipo2, goles_equipo1, goles_equipo2, fecha FROM partidos`;
    connection.query(sql, (error, results)=>{ 
      if(error){
        callback(error, null)
      }else{
        callback(null, results)
      }
    });
  };

  // FIXTURE

  const crear_fixture = ({ id_torneo }, callback) => {
    const checkTorneoExistenceSQL = `SELECT COUNT(*) AS count FROM torneos WHERE id = ?`;
    connection.query(checkTorneoExistenceSQL, [id_torneo], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            const torneoNoExiste = results[0].count === 0;
            if (torneoNoExiste) {
                callback({ mensaje: 'El torneo no existe' }, null);
            } else {
                const checkEquiposCountSQL = `SELECT COUNT(*) AS count FROM equipos WHERE id_torneo = ?`;
                connection.query(checkEquiposCountSQL, [id_torneo], (error, results) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        const cantidad_equipos = results[0].count !== 16;
                        if (cantidad_equipos) {
                            callback({ mensaje: 'No hay 16 equipos en el torneo' }, null);
                        } else {
                            const getEquiposSQL = `SELECT id FROM equipos WHERE id_torneo = ? ORDER BY id`;
                            connection.query(getEquiposSQL, [id_torneo], (error, resultsIdEquipos) => {
                                if (error) {
                                    callback({ mensaje: 'Hubo un error al obtener los equipos' }, null);
                                } else {
                                  const id_equipos = resultsIdEquipos.map(equipo => equipo.id);
                                  const cantidadFechas = id_equipos.length - 1;
                                  for (let i = 1; i <= cantidadFechas; i++) {
                                    for (let j = 0; j < 8; j++) {
                                        const id_equipo1 = id_equipos[j];
                                        const id_equipo2 = id_equipos[cantidadFechas - j];
                                        const insertPartidoSQL = `INSERT INTO partidos (id_torneo, id_equipo1, id_equipo2, fecha) VALUES (?,?,?,?)`;
                                        connection.query(insertPartidoSQL, [id_torneo, id_equipo1, id_equipo2, i], (error, resultsInsertPartido) => {
                                            if (error) {
                                                callback({mensaje: 'Hubo un error al insertar el partido'}, null);
                                            }
                                        });
                                    }
                                    id_equipos.unshift(id_equipos.pop());
                                    console.log(id_equipos)
                                  }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
  };

  const mostrar_fixture = ({nombre_torneo}, callback) =>{
    const getIdTorneoSQL = `SELECT id_torneo FROM torneos	WHERE nombre = ?`;
    connection.query(getIdTorneoSQL, [nombre_torneo], (error, resultsIdTorneo)=>{ 
      if(error){
        callback(error, null)
      }else{
        for(i=1; i<=15; i++){
          const getPartidosSQL = `SELECT id_equipo1, id_equipo2, goles_equipo1, goles_equipo2 FROM partidos
                                  WHERE id_torneo = ? AND fecha = ?`;
          connection.query(getPartidosSQL, [resultsIdTorneo, i], (error, resultsPartidos) =>{
            if(error){
              callback(error, null)
            } else{
              callback(null, resultsPartidos)
            }
          })
        }
      }
    });
  
  }
  




  return {
    crear_torneo,
    mostrar_torneos,
    actualizar_torneo_byid,
    crear_equipo,
    mostrar_equipos,
    mostrar_equipos_torneo,
    crear_partido,
    mostrar_partidos,
    crear_fixture,
    mostrar_fixture,
    cargar_resultados
  };
};

module.exports = {
  conexion,
};