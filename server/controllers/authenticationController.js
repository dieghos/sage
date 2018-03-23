const User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.create_admin = function(){
  var query  = User.where({ username: 'admin' });
  query.findOne(function (err, user) {
    if (err) console.error(err);
    if (!user) {
      user = new User({
        username: 'admin',
        password: bcrypt.hashSync('superadmin',10),
        grado: 'Administrador',
        legajo: 'XXX',
        apellido:'',
        nombres:'',
        photo:'./assets/images/escudo.png',
        roles:'Administrador'
      });
      user.save(function(err){
        if(err){
          console.error(err)
        }
        console.log('Superadministrador creado exitosamente.')
      });
    }
  });
}

exports.register = function(req,res){

  var user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password,10),
    grado: req.body.grado,
    legajo: req.body.legajo,
    apellido: req.body.apellido,
    nombres: req.body.nombres,
    photo: req.body.photo,
    roles: req.body.roles
  });

  user.save(function(err,user){
    if(err){
      return res.status(500).json({
        error: err
      });
    }
    res.status(200).json({
      user: user
    });
  });
};

exports.login = function(req,res){
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'Ocurrió un error',
        error: err
      });
    }
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        error: {message: 'Credenciales de acceso inválidas'}
      });
    }

    var token = jwt.sign({user: user}, 'enlacestokenizer', {expiresIn: 7200});
    res.status(200).json({
      token: token,
      user: user
    });
  });
}

exports.verify = function(req,res,next){
  jwt.verify(req.query.token, 'enlacestokenizer', function (err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'No autenticado.',
        error: err
      });
    }
    next();
  })
}
