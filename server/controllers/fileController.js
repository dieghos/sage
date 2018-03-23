const Files = require('../models/file');
var moment = require('moment');
/**
* Devuelve la lista de expedientes y la cantidad total.
*/
exports.file_list = function(req, res){
  var limit = req.query.limit? parseInt(req.query.limit):0;
  var page = req.query.page? parseInt(req.query.page):1;
  var filter = req.query.query;
  var query = filter? {$or: [
       { "code":{ $regex: filter  ,$options:'i'} },
       { "description":{ $regex: filter  ,$options:'i'} },
       { "etx":{ $regex: filter  ,$options:'i'} }
     ]}:{};
  if(filter){
    if (filter.includes("date=")){
      //Date
      var start = moment(filter.substr(5,10)+ " 00:00:00","DD-MM-YYYY HH:mm:ss").format();
      var end = moment(filter.substr(5,10)+ " 23:59:59","DD-MM-YYYY HH:mm:ss").format();

      query = { "time_limit":{$gte: start, $lt: end}};
    }
  }

  var callback = function(err,files){

    if(err){
      return res.status(500).json({
        title:'Ocurrió un error',
        error:err
      });
    }
    Files.find(query).count(function(err,count){

      res.status(200).json({
        files: files,
        count: count
      });
    })
  };

  Files.find(query).populate('assigned').limit(limit).skip(limit*(page-1)).exec(callback);
};

/**
* Devuelve el detalle de un expediente especifico.
*/
exports.file_detail = function(req,res){
  var callback = function(err,file){
    if(err){
      return res.status(500).json({
        title:'Ocurrió un error',
        error:err
      });
    }
    if(file===null){
      return res.status(404).json({
        title: 'Expediente no encontrado'
      });
    }
    res.status(200).json({
      file: file
    });
  }
  Files.findById(req.params._id,callback).populate('assigned');
};

/**
* Crea expedientes en la base de datos.
*/
exports.file_create = function(req,res){
  Files.insertMany(req.body.files).then(
    files => {
       res.status(200).json({
         files: files
       });
    }).catch(error => {
      console.log('Rejected promise in file_create')
       res.status(500).json({
         error:error
       });
     });
};

/**
* Actualiza los expedientes en la base de datos.
*/
exports.file_update = function(req,res){
  var callback = function(err,file){
    if(err){
      return res.status(500).json({
        title:'Ocurrió un error',
        error:err
      });
    }
    if (file===null) {
      return res.status(404).json({
        title: 'Expediente no encontrado'
      });
    }


    file.code = req.body.file_code ? req.body.file_code:file.file_code;
    file.description = req.body.description ? req.body.description:file.description;
    file.comments = req.body.comments ? req.body.comments:file.comments;
    file.entry_date = req.body.entry_date ? req.body.entry_date:file.entry_date;
    file.images_path = req.body.images_path? req.body.images_path: file.images_path;
    file.etx = req.body.etx? req.body.etx: file.etx;
    file.time_limit = req.body.time_limit? req.body.time_limit: file.time_limit;
    file.status = req.body.status? req.body.status:file.status;
    file.last_status_date = req.body.last_status_date ? req.body.last_status_date:file.last_status_date;
    file.assigned = req.body.assigned ? req.body.assigned:file.assigned;

    file.save(function(err){
      if(err){
        res.status(500).json({
          title:'Ocurrió un error',
          error:err
        });
      }
      res.status(200).json({
        title: 'Expediente actualizado exitosamente.',
        obj: file
      })
    });
  };

  Files.findById(req.params._id,callback);
};

/**
* Elimina un expediente de la base de datos.
*/
exports.file_delete = function(req,res){
  var callback = function(err,file){
    if(err){
      return res.status(500).json({
        title:'Ocurrió un error',
        error:err
      });
    }
    if (file===null) {
      return res.status(404).json({
        title: 'Expediente no encontrado'
      });
    }
    res.status(200).json({
      title:'Expediente borrado exitosamente'
    });
  }

  Files.findByIdAndRemove(req.params._id,callback);
};
