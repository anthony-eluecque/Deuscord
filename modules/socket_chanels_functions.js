const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const mysql_connection = require('./mysql_connection.js');

module.exports = {
  create_chanel: function(name, description, position, connection, socket, callback){
    //TODO : Vérifier perms

    if(!/^([0-9]{1,5})$/.test(position) || position<0 || position>9999){
      position = 0;//Si la position est incorrecte, elle est définie à 0 par défaut
    }

    if(/^([a-zA-Z0-9_ ]{1,24})$/.test(name)){

        connection.query('INSERT INTO chanel(name, subject, owner, position) VALUES('+mysql.escape(name)+', '+mysql.escape(description)+', '+socket.request.session.user_id+', '+mysql.escape(position)+');', function(error, results, fields){
          if(error instanceof Error){
            //Erreur lors de a création du chanel
            console.log(error);
            callback({
              status: "Erreur",
              info: "Erreur BDD"
            });
          }else{
            callback({
              status: "OK"
            });
          }
        });
    }else{
      callback({
        status: "Erreur",
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
          info: "Erreur BDD",
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
  },

  delete_chanel: function(chanel_id, connection, socket, callback){
    //TODO : Vérifier les perms
    if(/^([0-9]{1,999999})$/.test(chanel_id)){//L'ID du chanel doit être un nombre
      //Pour supprimer un chanel, il faut d'abord supprimer les données liées / clées étrangères
      connection.query("DELETE FROM message WHERE chanel="+mysql.escape(chanel_id)+";DELETE FROM chanel WHERE id="+mysql.escape(chanel_id)+";", function(error, results, fields){

        //Gestion d'une erreur Mysql
        if(error instanceof Error){
          console.log(error);
          callback({
            status: "Erreur",
            info: "Erreur BDD"
          });

        }else{
          //Tout s'est bien passé
          callback({
            status: "OK"
          });
        }
      });

    }else{
      callback({
        status: "Erreur",
        info: "ID incorecte"
      })
    }
  },

  update_chanel: function(name, description, position, chanel_id, connection, socket, callback){
    //TODO : Vérifier les permissions

    if(!/^([0-9]{1,5})$/.test(position) || position<0 || position>9999){
      position = 0;//Si la position est incorrecte, elle est définie à 0 par défaut
    }

    if(/^([a-zA-Z0-9_ ]{1,24})$/.test(name)){

      connection.query('UPDATE chanel SET name='+mysql.escape(name)+', subject='+mysql.escape(description)+', position='+mysql.escape(position)+' WHERE id='+mysql.escape(chanel_id)+';', function(error, results, fields){
        if(error instanceof Error){
          console.log(error);
          callback({
            status: "Erreur",
            info: "Erreur BDD"
          });
        }else{
          callback({
            status: "OK"
          });
        }
      });
    }else{
      callback({
        status: "Erreur",
        info:  "Nom du chanel incorrect !\n( [a-zA-Z0-9_ ] )"
      });
    }
  }
}
