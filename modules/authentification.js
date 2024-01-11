const bcrypt = require('bcrypt');//Import de bcrypt, permet de chiffrer les MDP
const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const mysql_connection = require('./mysql_connection.js');

module.exports = {
  register: function(req, res, connection){
    var pseudo = req.body.pseudo;
    var mail = req.body.email;

    if(/^([a-zA-Z0-9_]{3,16})$/.test(pseudo) && /^([a-zA-Z0-9_.@]{5,240})$/.test(mail) && typeof(pseudo)=="string" && typeof(mail)=="string"){//Vérification que pseudo & mail sont corrects

      bcrypt.hash(req.body.password, 12, function(err, hash) {//String, nombre de hashs, quoi faire ensuite

        connection.query('INSERT INTO user (pseudo, email, password, creation_date) VALUES("'+pseudo+'", "'+mail+'", "'+hash+'", NOW());', function (error, results, fields) {//Error : Renvoit l'erreur s'il y en a une; result: Contient une liste de dictionnaires contenant les objets, fields : Données sur les tables ( useless )
          if (error instanceof Error){
            console.log(error);//En cas d'erreur, l'erreur est log
            
            //Erreur dans l'enregistrement
          }
        });
      });


    }else{
      //Pseudo/mail non conformes
    }
  },

  test: function(){
    console.log("Hello World");
  }
};
