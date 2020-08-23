var express = require('express')
var fs = require('fs')
var multer = require('multer')
var mongoose = require('mongoose')
var beneficiary = require('../models/beneficiary')
var students = require('../models/beneficiary')
var path = require('path')
var moment = require('moment')
var allocation = require('../models/allocations')
var bodyPerser = require('body-parser')
const file = require('../models/files')

const files = require('../models/files')
var router = express.Router();



router.use('/', isLoggedIn, function isAuthenticated(req, res, next) {
    next();
});



router.get('/', function viewHome(req, res, next) {
    res.render('Loanboard/LoanBoard', {
        title: 'loan board officer home'
    })
})

router.get('/import-Beneficiary', (req, res, next) => {
    res.render('../views//Loanboard/importBeneficiary.ejs', {
        name: 'loanOfficer'
    })
});
router.get('/send-Allocation', (req, res, next) => {
    res.render('../views/Loanboard/sendAllocation.ejs', {
        name: 'loanOfficer',
        // csrfToken: req.csrfToken()

    })
});
router.get('/received-Beneficiary', (req, res, next) => {

    files.find({

    }).then(row => {
        res.render('../views/Loanboard/ReceiveBeneficiary.ejs', {
            name: 'loanOfficer',
            files: row
        })
    })


})
router.post('/upload', (req, res, next) => {
    const document = req.file.filename;

    const allocations =
        new allocation({
            allocation: document,
            date: moment().format('MMMM Do YYYY, h:mm:ss a')
        })

    allocations.save(function(err, doc) {
        if (err) {
            console.log('no data in db entered')
        } else {
            res.redirect('/loanboard/send-Allocation')
        }
        res.render('../views/Loanboard/sendAllocation.ejs', {

            moment: moment
        })
    })

})

console.log(path.join(require.main.filename + '/../documents/'))

router.post('/download/:file', (req, res) => {
    let { file } = req.body;


    var pp = path.join(require.main.filename + `${'/../documents/'+file}`)
    res.download(pp, error => {
        console.log('file failed to download', +error)
    });

})


module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}