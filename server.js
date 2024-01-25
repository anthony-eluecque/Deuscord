const authentification = require('./modules/authentification.js');//Fonctions gérant le login/register
const mysql_connection = require('./modules/mysql_connection.js');//Crée une connexion Mysql, stocke aussi les infos de connexion
const images = require('./modules/images.js');//Fonction gérant le /img/...
const socket_functions = require('./modules/socket_functions.js');//Fonctions de socket.io

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
const path = require('path');//Gestion des chemins d'accès

var app = express();//Création de l'app Express
var server = require("http").createServer(app);//Crée le serveur
var connection = mysql_connection.getConnexion();//Création d'une connexion

//redis
var redisClient  = redis.createClient();

redisClient.on('error', (err) => {
  console.log('Redis error : ', err);
});

var sessionMiddleware = session({//Définition des paramètres du système de session
  secret: 'SECRET_A_CHANGER',
  //J'indique à express-session de stocker les sessions en cours dans Redis
  store: new redisStore({ host: '127.0.0.1', port: 6379, client: redisClient, ttl:  86000}),
  saveUninitialized: true,
  resave: true
});

app.use(morgan('combined'));//Démarre les logs
app.use(bodyParser.urlencoded({extended: true}));

try{
  connection.connect();//Connexion à la BDD
}catch(error){
  console.log("Impossible d'accéder à la BDD !!");
  console.log(error);
}

//socket.io
const io = require("socket.io")(server);
io.use(function(socket, next){//A chaque requête io, le middleware de sessions est appelé
  sessionMiddleware(socket.request, socket.request.res || {}, next);//Pour lire la session : socket.request.session.Variable
});

app.use(sessionMiddleware);

io.sockets.on('connection', function(socket){
  console.log("Un client s'est connecté !");

  socket.on("create_chanel", (name, description, position, callback) => {
    socket_functions.create_chanel(name, description, position, connection, socket, callback);//Nom du chanel, description, nouveau ou non, connexion Mysql, socket si besoin de renvoyer un message, retour
  });

  socket.on("get_chanel_list", (callback) => {
    socket_functions.get_chanel_list(connection, socket, callback);
  });

  socket.on("delete_chanel", (chanel_id, callback) => {//Evénement "delete_chanel" reçu, avec l'argument chanel_id. Un callback est rajouté à la fonction pour répondre au client
    socket_functions.delete_chanel(chanel_id, connection, socket, callback);//L'ID du chanel, la connection Mysql, le socket et le callback sont envoyés à une fonction qui gérera la suppression
  });

  socket.on("update_chanel", (name, description, position, chanel_id, callback) => {
    socket_functions.update_chanel(name, description, position, chanel_id, connection, socket, callback);
  });
});



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
    res.render('app.ejs', {pseudo: req.session.pseudo});//Je définis la variable pseudo sur la page
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

//Fonctions
app.get('/js/cookies', function(req, res){
  res.render('./js/cookies.ejs');
});
app.get('/js/chanels_list', function(req, res){
  res.render('./js/chanels_list.ejs');
});

//Obtention d'images
app.get('/img/:img', function(req, res){
  images.getImage(req, res);
});

console.log("Serveur démarré !");
server.listen(8080, '0.0.0.0');//Le serveur démarre sur le port 8080 ( HTTP par défaut en 80, HTTPS en 443), et écoute les connexions de toutes les IPs
