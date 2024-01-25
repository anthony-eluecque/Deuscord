const mysql = require('mysql');
const mysql_connection = require('./mysql_connection.js');

function clear_client_rooms(socket){
  socket.rooms.forEach(function(room_name){//Pour chaque room du socket du client :
    if(room_name!=socket.id){//Si le nom de la room n'est pas son id ( room créée par défaut ayant pour nom l'ID du socket )
      socket.leave(room_name);//Quitter la room
    }
  });
}

function get_client_chanel(socket){
  var i = 0;
  var room;
  socket.rooms.forEach(function(room_name){
    i++;
    if(i==2){
      room=room_name;
    }
  });
  return(room);
}

module.exports = {
  change_chanel: function(chanel_id, connection, socket, io, callback){//Le client change de chanel
    //TODO :Vérifier les perms
    if(/^([0-9]{1,999999})$/.test(chanel_id)){//L'ID est un nombre

      clear_client_rooms(socket);//Clear de toutes les rooms du client
      socket.join(chanel_id);//Le client n'a plus aucune room à part celle par défaut, il peut rejoindre un nouveau chanel
      //Le socket est maintenant dans la bonne room, mais il faut aussi lui envoyer les derniers messages envoyés dans la room
      connection.query('SELECT pseudo, date, message.text, message.id FROM message INNER JOIN user ON message.sender=user.id WHERE chanel='+mysql.escape(chanel_id)+' ORDER BY date LIMIT 50;', function(error, results, fields){
        if(error instanceof Error){

          console.log(error);
          callback({
            status: "Erreur",
            info: "Erreur BDD",
            result: []
          });

        }else{
          var liste_messages = [];
          for(var i=0; i<Object.keys(results).length; i++){//Les messages sont récupérés
            liste_messages.push(results[i]);
          }
          callback({//Puis renvoyés au serveur
            status: "OK",
            result: liste_messages
          });

        }
      });

    }else{
      callback({
        status: "Erreur",
        info: "ID invalide"
      });
    }
  },
  send_message: function(message, connection, socket, io, callback){
    if(message.length<=2000){//Message limité à 2000 caractères

      connection.query("INSERT INTO message(sender, date, text, chanel) VALUES("+socket.request.session.user_id+", NOW(), "+mysql.escape(message)+", "+get_client_chanel(socket)+"); SELECT LAST_INSERT_ID() AS last_id;", function(error, results, fields){
        if(error instanceof Error){

          console.log(error);
          callback({
            status: "Erreur",
            info: "Erreur BDD"
          });

        }else{
          callback({
            status: "OK",
            message_id: results[1][0].last_id
          });
        }
      });

    }else{
      callback({
        status: "Erreur",
        info: "Message trop long ! Max : 2000 caractères"
      });
    }
  }
}
