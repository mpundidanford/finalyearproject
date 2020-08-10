var mongoose = require('mongoose');



var allocationSchema = new mongoose.Schema({
    allocation: {
        type: String,
        required: true

    },

    date: {
        type: String,
        required: true
    },


});
module.exports = mongoose.model('allocation', allocationSchema);