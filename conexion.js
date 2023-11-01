
const conexion = () => {
  const mysql = require('mysql');

  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'torneos',
  };

  const connection = mysql.createConnection(dbConfig);

  const table = 'torneos';

  const crear_torneo = ({ nombre }, callback) => {
    const sql = `INSERT INTO ${table} (nombre) VALUES (?)`;
    connection.query(sql, [nombre], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results);
      }
    });
  };

  const mostrar_torneos = (callback) => {
    const sql = `SELECT id, nombre FROM torneos`;
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

  return {
    crear_torneo,
    mostrar_torneos,
    actualizar_torneo_byid
  };
};

module.exports = {
  conexion,
};