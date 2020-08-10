const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({
    file: {
        type: String,
        required: true
    },
    date: {
        type: String,

    },

});


module.exports = mongoose.model('File', fileSchema);