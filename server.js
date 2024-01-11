const authentification = require('./modules/authentification.js');//Fonctions gérant le login/register
const mysql_connection = require('./modules/mysql_connection.js');//Crée une connexion Mysql, stocke aussi les infos de connexion

const express = require('express');//Import d'Express, simplifie la gestion du backend
const morgan = require('morgan');//Import de morgan, permet de log les connexions au serveur
const ejs = require('ejs');//Import d'ejs : permet de rendre les .ejs, les <% %>
const bodyParser = require('body-parser');// Import de body-parser : permet de récupérer les infos des formulaires sur le site
const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const bcrypt = require('bcrypt');//Import de bcrypt, permet de chiffrer les MDP

var app = express();//Création de l'app Express
var server = require("http").createServer(app);//Crée le serveur
var connection = mysql_connection.getConnexion();//Création d'une connexion

app.use(morgan('combined'));//Démarre les logs
app.use(bodyParser.urlencoded({extended: true}));

try{
  connection.connect();//Connexion à la BDD
}catch(error){
  console.log("Impossible d'accéder à la BDD !!");
  console.log(error);
}

app.use(function(req, res, next){
//Fonction éxécutée à chaque chargement de page
    next();
});

app.get('/', function(req, res){//Je crée une "route", et j'y renvoit le fichier views/hello.ejs
  res.render('login.ejs');
});

app.get('/login', function(req, res){
  res.render('login.ejs');
});
app.post('/login/post', function(req, res){
  var a = req.body.login;//Récupère le login
  console.log(a);//Et l'affiche dans la console
  res.redirect('/login');
});

app.get('/register', function(req, res){
  res.render('register.ejs');
});
app.post('/register/post', function(req, res){
  authentification.register(req, res, connection);
  res.redirect('/login');
});

app.get('/style', function(req, res){
  res.render('style.ejs');
});
app.get('/style/login', function(req, res){
  res.render('style.login.ejs');
});

app.get('/:url', function(req, res){//Même chose, mais la "route" est dynamique, et envoyée dans une variable
  res.render('hello.ejs',{url: req.params.url});
});


console.log("Serveur démarré !");
app.listen(8080, '0.0.0.0');//Le serveur démarre sur le port 80 ( HTTP par défaut en 80, HTTPS en 443), et écoute les connexions de toutes les IPs