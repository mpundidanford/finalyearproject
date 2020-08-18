var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var csrf = require('csurf');

router.get('/signup', function signUp(req, res, next) {

    var messages = req.flash('error');
    res.render('signup', {
        // csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.get('/', function viewLoginPage(req, res, next) {
    var messages = req.flash('error');

    res.render('login', {
        title: 'Heslb',
        // csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});


router.get('/logout', isLoggedIn, function logoutUser(req, res, next) {

    req.logout();
    res.redirect('/');
});


router.get('/dummy', function(req, res, next) {
    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    User.find({ type: 'employee' }, function(err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('dummy', { title: 'Dummy', users: userChunks });
    });

});




router.get('/check-type', function checkTypeOfLoggedInUser(req, res, next) {
    // req.session.user = req.user
    if (req.user.type == "loanofficer") {
        res.redirect('/loanofficer');
    } else {
        res.redirect('/loanboard');
    }

});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/check-type',
    failureRedirect: '/',
    failureFlash: true

}));

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}