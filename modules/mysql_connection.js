const mysql = require('mysql2');
module.exports = {
  getConnexion: function(){
    var connection = mysql.createConnection({
      host: 'mysql',
      user: 'user',
      password: 'pass',
      database: 'deuscord',
      multipleStatements: true
    });
    return(connection);
  }
}
