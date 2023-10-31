
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

  const crear_torneo = ({id, nombre}) =>{
    return knex(table).insert({
      id: id,
      nombre: nombre
    });
  }
  return{
    crear_torneo
  }
}
module.export = {
  conexion
}