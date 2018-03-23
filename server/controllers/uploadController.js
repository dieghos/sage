var multer = require('multer');
const fs = require('fs');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/assets/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+file.originalname);
  }
})

var upload = multer({ storage: storage }).array('image',12);

/**
* Sube un archivo al servidor.
*/
exports.upload_file = function(req,res){
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({
        error: err
      })
    }
    res.status(200).json({
      files: req.files
    })
  })
};

/**
* Elimina un archivo del servidor.
*/
exports.delete_file = function(req,res){
  fs.unlink("dist/"+req.body.path, (err) => {
    if (err){
      console.error(err);
      return res.status(500).json({
        error: err
      })
    }
    res.status(200).json({
      title: 'Path eliminado',
      path: req.body.path
    });
  });
};
