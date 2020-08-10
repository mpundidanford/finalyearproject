var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
require('mongoose-type-email');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    email: {
        type: String,
        require: true,

    },
    username: {
        type: String,
        require: true,

    },
    password: {
        type: String,
        require: true,

    },
    type: {
        type: String,
        require: true,

    }
});

UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);