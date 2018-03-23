const User = require('../models/user');
var bcrypt = require('bcryptjs');

exports.users_list = function(req,res){
    var limit = req.query.limit? parseInt(req.query.limit):1000;
    var page = req.query.page? parseInt(req.query.page):1;

    var callback = function(err,users){
      if(err){
        return res.status(500).json({
          title:'Ocurrió un error',
          error:err
        });
      }
      res.status(200).json({
        users:users
      });
    };
    User.find({}).limit(limit).skip(limit*(page-1)).exec(callback);

}

exports.user_detail = function(req, res) {
    var callback = function(err,user){
      if(err){
        return res.status(500).json({
          title:'Ocurrió un error',
          error:err
        });
      }
      if(user===null){
        return res.status(404).json({
          title: 'Usuario no encontrado'
        });
      }
      res.status(200).json({
        user:user
      });
    }
    User.findById(req.params._id,callback);
};

exports.create_user = function(req,res){
  var user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password,10),
    grado: req.body.grado,
    legajo: req.body.legajo,
    apellido: req.body.apellido,
    nombres: req.body.nombres,
    roles:req.body.roles,
    photo:req.body.photo,
    tasks: req.body.tasks
  });

  user.save(function(err){
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

exports.update_user=function(req,res){

  var callback = function(err,user){
    if(err){
      return res.status(500).json({
        error: err
      });
    }
    if(user === null){
      return res.status(404).json({
        title: 'Usuario no encontrado.'
      });
    }
    user.username = req.body.username ? req.body.username : user.username;
    user.password = req.body.password ? bcrypt.hashSync(req.body.password,10) : user.password;
    user.grado = req.body.grado ? req.body.grado : user.grado;
    user.legajo = req.body.legajo ? req.body.legajo : user.legajo;
    user.apellido = req.body.apellido ? req.body.apellido : user.apellido;
    user.nombres = req.body.nombres ? req.body.nombres : user.nombres;
    user.roles = req.body.roles ? req.body.roles : user.roles;
    user.photo = req.body.photo ? req.body.photo : user.photo;
    user.tasks = req.body.tasks ? req.body.tasks : user.tasks;

    user.save(function(err){
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
  User.findById(req.params._id,callback);
};

exports.delete_user = function(req,res){
  var callback = function(err,user){
    if(err){
      return res.status(500).json({
        error: err
      });
    }
    if(user === null){
      return res.status(404).json({
        title: 'Usuario no encontrado.'
      });
    }
  }
  User.findByIdAndremove(req.params._id,callback);
}
