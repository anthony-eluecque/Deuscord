const bcrypt = require('bcrypt');//Import de bcrypt, permet de chiffrer les MDP
const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const mysql_connection = require('./mysql_connection.js');

module.exports = {
  register: function(req, res, connection){
    var pseudo = req.body.pseudo;
    var mail = req.body.email;

    if(/^([a-zA-Z0-9_]{1,16})$/.test(pseudo) && /^([a-zA-Z0-9_.@]{5,240})$/.test(mail) && typeof(pseudo)=="string" && typeof(mail)=="string"){//Vérification que pseudo & mail sont corrects

      //Les identifiants doivent être uniques
      connection.query('SELECT COUNT(id) AS "nb" FROM user WHERE pseudo='+mysql.escape(pseudo)+' OR email='+mysql.escape(mail)+';', function(error, results, fields){
        if(error instanceof Error){
          console.log(error);
        }else{
          if(results[0].nb>0){
            res.redirect('/register?error=existing_in_bdd');
            //Déjà en BDD
            return;
          }else{
            req.session.pseudo = results[0].pseudo;
            req.session.user_id = results[0].id;
            req.session.save();
            res.redirect('/app');
            //Tout va bien, je continue

            bcrypt.hash(req.body.password, 12, function(err, hash) {//String, nombre de hashs, quoi faire ensuite

              connection.query('INSERT INTO user (pseudo, email, password, creation_date) VALUES('+mysql.escape(pseudo)+', '+mysql.escape(mail)+', "'+hash+'", NOW());', function (error, results, fields) {//Error : Renvoit l'erreur s'il y en a une; result: Contient une liste de dictionnaires contenant les objets, fields : Données sur les tables ( useless )
                if (error instanceof Error){
                  console.log(error);//En cas d'erreur, l'erreur est log
                  res.redirect('/register?error=error_register');
                  //Erreur dans l'enregistrement
                }else{//Utilisateur inscrit, je récupère juste son ID dans la base de données pour l'associer à la session
                  connection.query('SELECT id, pseudo FROM user WHERE pseudo='+mysql.escape(pseudo)+';', function(error, results, fields){
                    if(error instanceof Error){
                      console.log(error);
                      res.redirect('/register?error=error_register');
                    }else{
                      req.session.pseudo = results[0].pseudo;
                      req.session.user_id = results[0].id;
                      req.session.save();
                      res.redirect('/app');
                      //Tout s'est bien passé, return
                      //Rediriger vers l'app
                    }
                  });
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
    if(/^([a-zA-Z0-9_.@]{1,16})$/.test(login) && typeof(login)=="string"){

      connection.query('SELECT id, pseudo, email, password FROM user WHERE pseudo='+mysql.escape(login)+' OR email='+mysql.escape(login)+';', function (error, results, fields) {//Error : Renvoit l'erreur s'il y en a une; result: Contient une liste de dictionnaires contenant les objets, fields : Données sur les tables ( useless )
        if (error instanceof Error){
          console.log(error);//En cas d'erreur, l'erreur est log
          res.redirect('/register?error=error_login');
          //Erreur dans le login / Non trouvé
          //Annuler la connexion
        }else{
          //Requête OK
          if(results.length==1){

            bcrypt.compare(formPassword, results[0].password, function(err, result) {
              if(result){
                //Connection acceptée
                req.session.pseudo = results[0].pseudo;//Le pseudo en BDD est enregistré dans la session
                req.session.user_id = results[0].id;
                req.session.save();
                res.redirect('/app');
              }else{
                //Erreur de MDP
                console.log(error);
                res.redirect('/register?error=error_pwd');
              }
            });
          }else{
            console.log(error);
            res.redirect('/register?error=error_login');
            //Trop de résultats, erreur
          }
        }
      });
    }else{
      console.log(error);
      res.redirect('/register?error=error_login');
      //Login non conforme
    }
  }
};