var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/finalproject');

var users = [

    new User({
        email: 'loanofficer@gmail.com',
        username: 'loanofficer',
        password: bcrypt.hashSync('loanofficer1', bcrypt.genSaltSync(5), null),
        type: 'loanofficer',
    }),
    new User({
        email: 'lbloanofficer@gmail.com',
        username: 'lbloanofficer',
        password: bcrypt.hashSync('loanofficer2', bcrypt.genSaltSync(5), null),
        type: 'lbloanofficer',
    }),

];
//save function is asynchronous
//so we need to ceck all itmes are saved before we disconnect to db
done = 0;
for (i = 0; i < users.length; i++) {
    users[i].save(function(err, result) {
        done++;
        if (done == users.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}