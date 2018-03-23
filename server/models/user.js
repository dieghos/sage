var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required:true},
    password: { type: String, required:true},
    grado: { type: String },
    legajo: { type: String },
    apellido: { type: String },
    nombres: { type: String },
    roles:{type: String},
    photo:{type : String},
    tasks:[Schema.Types.Mixed]
});


var User = mongoose.model('User',userSchema);
module.exports = User;
