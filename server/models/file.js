var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fileSchema = new Schema({
    file_code: { type: String, required:true},
    description: { type: String, required:true},
    comments: { type: String },
    entry_date: { type: Date, default: Date.now },
    images_path: [{ type: String }],
    etx: { type: String },
    time_limit: { type: Date },
    status: { type: String, default:"Ingresado" },
    last_status_date: { type: Date },
    assigned:{ type: Schema.Types.ObjectId, ref:'User' }
});


var File = mongoose.model('File',fileSchema);
module.exports = File;
