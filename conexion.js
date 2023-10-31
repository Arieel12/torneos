
const conexion = () =>{
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3000,
      user: 'root',
      password: "",
      database: 'torneos'
    }
  })

  const table = 'torneos';

  const crear_torneo = ({nombre}) =>{
    return knex(table).insert({
      nombre: nombre
    });
  }
  return{
    crear_torneo
  }
}
module.exports = {
  conexion
}