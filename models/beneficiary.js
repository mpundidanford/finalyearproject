var mongoose = require('mongoose');

var beneficiarySchema = new mongoose.Schema({


    Firstname: {
        type: String,
    },
    Middlename: {
        type: String,
        minlength: 5,
        maxlength: 100,
    },
    Lastname: {
        type: String,
        minlength: 5,
        maxlength: 100,
    },
    reg_no: {
        type: String,
    },
    F4Index: {
        type: String,
    },
    Status: {
        type: String,
    },

    yos: {
        type: Number,
    },
    Course: {
        type: String
    },
    gender: {
        type: String,
    },
    Account_no: {
        type: Number
    },
    Bank: {
        type: String
    },

    Tuition_fee: {
        type: Number
    },
    Accomodation: {
        type: Number
    },

    specialfacult: {
        type: String
    },
    field: {
        type: Number
    },
    research: {
        type: String
    },

});

var beneficiary = mongoose.model('beneficiary', beneficiarySchema);
module.exports = beneficiary;