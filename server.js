const authentification = require('./modules/authentification.js');//Fonctions gérant le login/register
const mysql_connection = require('./modules/mysql_connection.js');//Crée une connexion Mysql, stocke aussi les infos de connexion
const images = require('./modules/images.js');//Fonction gérant le /img/...
const post_functions = require('./modules/post_functions.js');//Gestion de requêtes post

const express = require('express');//Import d'Express, simplifie la gestion du backend
const morgan = require('morgan');//Import de morgan, permet de log les connexions au serveur
const ejs = require('ejs');//Import d'ejs : permet de rendre les .ejs, les <% %>
const bodyParser = require('body-parser');// Import de body-parser : permet de récupérer les infos des formulaires sur le site
const mysql = require('mysql');//Import de MySql, permettra de faire des requêtes vers la BDD
const bcrypt = require('bcrypt');//Import de bcrypt, permet de chiffrer les MDP
const redis = require("redis");//Redis
const session = require('express-session');//Gestion des sessions avec Express
const redisStore = require('connect-redis')(session);//Stockage des données dans Redis
const fs = require('fs')//FileSystem, permet d'intéragir avec les fichiers présents sur le serveur
var path = require('path');//Gestion des chemins d'accès

var app = express();//Création de l'app Express
var server = require("http").createServer(app);//Crée le serveur
var connection = mysql_connection.getConnexion();//Création d'une connexion

//redis
var redisClient  = redis.createClient();

redisClient.on('error', (err) => {
  console.log('Redis error : ', err);
});

app.use(session({
    secret: 'SECRET_A_CHANGER',
    //J'indique à express-session de stocker les sessions en cours dans Redis
    store: new redisStore({ host: '127.0.0.1', port: 6379, client: redisClient, ttl :  86000}),
    saveUninitialized: true,
    resave: true
}));

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




app.get('/', function(req, res){
  res.render('login.ejs');
});

app.get('/login', function(req, res){
  res.render('login.ejs');
});
app.post('/login/post', function(req, res){
  authentification.login(req, res, connection);//Exécution de la fonction login définie dans le module authentification
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/login');
});

app.get('/register', function(req, res){
  res.render('register.ejs');
});
app.post('/register/post', function(req, res){
  authentification.register(req, res, connection);
  //res.redirect('/login');
});

//Page principale de l'appli
app.get('/app', function(req, res){
  if(req.session.pseudo!=undefined){
    res.render('app.ejs', {pseudo: req.session.pseudo});//Je définis la variable pseudo sur la pagekkm
  }else{
    res.redirect('/login?error=must_login');
  }
});

//Gestion de l'application :
app.get('/app/chanels_admin', function(req, res){
  if(1==1 && req.session.pseudo!=undefined){//TODO : Vérifier niveau de permission
    res.render('chanels_admin.ejs');//TODO : Récupérer permissions utilisateur
  }else{
    res.redirect('/app');
  }
});

app.post('/app/chanels_admin/post', function(req, res){
  if(1==1 && req.session.pseudo!=undefined){//TODO : Vérifier niveau de permission
    post_functions.chanels_admin_post(req, res);
  }else{
    res.status(404).end('Not found');
  }
});


//Style
app.get('/style', function(req, res){
  res.render('./style/style.ejs');
});
app.get('/style/login', function(req, res){
  res.render('./style/style.login.ejs');
});
app.get('/style/app', function(req, res){
  res.render('./style/style.app.ejs');
});
app.get('/style/app/chanels_admin', function(req, res){
  res.render('./style/style.app.chanels_admin.ejs');
});

//Obtention d'images
app.get('/img/:img', function(req, res){
  images.getImage(req, res);
});


console.log("Serveur démarré !");
app.listen(8080, '0.0.0.0');//Le serveur démarre sur le port 8080 ( HTTP par défaut en 80, HTTPS en 443), et écoute les connexions de toutes les IPs
