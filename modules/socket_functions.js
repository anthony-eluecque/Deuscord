const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const mysql_connection = require('./mysql_connection.js');

module.exports = {
  manage_chanel: function(name, description, position, new_chanel_created, connection, socket, callback){
    //TODO : Vérifier perms

    if(!/^([0-9]{1,5})$/.test(position) || position<0 || position>9999){
      position = 0;//Si la position est incorrecte, elle est définie à 0 par défaut
    }

    if(/^([a-zA-Z0-9_ ]{1,24})$/.test(name) && (new_chanel_created=="true" || new_chanel_created=="false")){
      if(new_chanel_created=="true"){

        connection.query('INSERT INTO chanel(name, subject, owner, position) VALUES('+mysql.escape(name)+', '+mysql.escape(description)+', '+socket.request.session.user_id+', '+mysql.escape(position)+');', function(error, results, fields){
          if(error instanceof Error){
            //Erreur lors de a création du chanel
            console.log(error);
            callback({
              status: "erreur",
              info: "Erreur BDD"
            });
          }else{
            callback({
              status: "OK"
            });
          }
        });

      }else{
        //Mise à jour d'un chanel
      }
    }else{
      callback({
        status: "erreur",
        info:  "Nom du chanel incorrect !\n( [a-zA-Z0-9_ ] )"
      });
    }
  },

  get_chanel_list: function(connection, socket, callback){
    //TODO : vérifier les perms
    connection.query('SELECT chanel.id, name, subject, owner, position, pseudo FROM chanel INNER JOIN user ON chanel.owner=user.id ORDER BY position;', function(error, results, fields){
      if(error instanceof Error){
        console.log(error);
        callback({
          status: "Erreur",
          result: []
        });

      }else{
        var liste_chanels = [];
        for(var i=0; i<Object.keys(results).length; i++){
          liste_chanels.push(results[i]);
        }
        callback({
          status: "OK",
          result: liste_chanels
        });
      }
    });
  }
}
