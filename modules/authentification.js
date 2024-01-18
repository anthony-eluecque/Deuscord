const bcrypt = require('bcrypt');//Import de bcrypt, permet de chiffrer les MDP
const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const mysql_connection = require('./mysql_connection.js');

module.exports = {
  register: function(req, res, connection){
    var pseudo = req.body.pseudo;
    var mail = req.body.email;

    if(/^([a-zA-Z0-9_]{3,16})$/.test(pseudo) && /^([a-zA-Z0-9_.@]{5,240})$/.test(mail) && typeof(pseudo)=="string" && typeof(mail)=="string"){//Vérification que pseudo & mail sont corrects



        //Les identifiants doivent être uniques
      connection.query('SELECT COUNT(id) AS "nb" FROM user WHERE pseudo="'+pseudo+'" OR email="'+mail+'";', function(error, results, fields){
        if(error instanceof Error){
          console.log(error);
        }else{

          if(results[0].nb>0){
            //Déjà en BDD
            return;
          }else{
            //Tout va bien, je continue

            bcrypt.hash(req.body.password, 12, function(err, hash) {//String, nombre de hashs, quoi faire ensuite

              connection.query('INSERT INTO user (pseudo, email, password, creation_date) VALUES("'+pseudo+'", "'+mail+'", "'+hash+'", NOW());', function (error, results, fields) {//Error : Renvoit l'erreur s'il y en a une; result: Contient une liste de dictionnaires contenant les objets, fields : Données sur les tables ( useless )
                if (error instanceof Error){
                  console.log(error);//En cas d'erreur, l'erreur est log

                  //Erreur dans l'enregistrement
                }else{
                  //Tout s'est bien passé, return
                  //Rediriger vers l'app
                }
              });
            });
          }
        }
      });

    }else{
      //Caractères interdits
      res.redirect('/register?error=forbiden_sign');
    }
  },

  login: function(req, res, connection){
    var login = req.body.login;//Récupère le login
    var formPassword = req.body.password;

    if(/^([a-zA-Z0-9_.@]{3,16})$/.test(login) && typeof(login)=="string"){

      connection.query('SELECT pseudo, email, password FROM user WHERE pseudo="'+login+'" OR email="'+login+'";', function (error, results, fields) {//Error : Renvoit l'erreur s'il y en a une; result: Contient une liste de dictionnaires contenant les objets, fields : Données sur les tables ( useless )
        if (error instanceof Error){
          console.log(error);//En cas d'erreur, l'erreur est log

          //Erreur dans le login / Non trouvé
          //Anuler la connexion
        }else{
          //Requête OK
          if(results.length==1){

            bcrypt.compare(formPassword, results[0].password, function(err, result) {
              if(result){
                //Connection acceptée
                console.log("OK");
              }else{
                //Erreur de MDP
                console.log("Pas OK");
              }
            });



          }else{
            //Trop de résultats, erreur
          }
        }
      });
    }else{
      //Login non conforme
    }
  }
};
