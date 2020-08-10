var mongoose = require('mongoose');
var studentsSchema = new mongoose.Schema({


    firstName: {
        type: String,
        require: true,
    },
    middleName: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 100,
    },
    lastName: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 100,
    },

    reg_no: {
        type: String,
        require: true,
    },
    F4Index: {
        type: String,
        require: true,
    },

    status: {
        type: String,
        require: true
    }

});

var students = mongoose.model('student', studentsSchema);
module.exports = students;