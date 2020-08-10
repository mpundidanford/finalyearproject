var express = require('express')
var multer = require('multer')
var path = require('path')
var moment = require('moment')
var allocation = require('../models/allocations')
var fs = require('fs')
const { count } = require('../models/beneficiary');
var beneficiary = require("../models/beneficiary");
const file = require('../models/files')
const allocations = require('../models/allocations')
var router = express.Router();
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true });
router.use('/', isLoggedIn, function checkAuthentication(req, res, next) {
    next();
});


router.get('/', function viewHome(req, res, next) {
    res.render('UniversityOfficer/index', {
        title: 'loan officer home',
        name: 'loanOfficer'
    })
})

router.use('/', isLoggedIn, function checkAuthentication(req, res, next) {
    next();
});

router.get('/all', (req, res, next) => {
    beneficiary.estimatedDocumentCount({}, function(err, result) {

        if (err) {
            res.send(err)
        } else {
            res.json(result)
        }

    })
    res.render('../views/UniversityOfficer/index.ejs', {
        result: result
    })



})

router.get('/view-all', (req, res, next) => {
    beneficiary.find({


    }).then(row => {
        res.render('../views/UniversityOfficer/view_all.ejs', {
            beneficiary: row,
            name: 'loanOfficer',
            csrfToken: req.csrfToken(),

        })
    });

})

//view list of continous beneficiary
router.get('/view-continuous', (req, res, next) => {
    beneficiary.find({
        Status: "continuous",

    }).then(row => {
        res.render('../views/UniversityOfficer/continous.ejs', {
            beneficiary: row,
            name: 'loanOfficer',
            csrfToken: req.csrfToken(),
            userName: req.session.user

        });

    })

});

router.get('/view-discontinuous', (req, res, next) => {
    beneficiary.find({
        Status: "discontinued"

    }).then(row => {
        res.render('../views/UniversityOfficer/discontinous.ejs', {
            beneficiary: row,
            name: 'loanOfficer'


        })
    })

});
router.get('/view-postponed', (req, res, next) => {
    beneficiary.find({
        Status: "postponed",


    }).then(row => {
        res.render('../views/UniversityOfficer/postponed.ejs', {
            beneficiary: row,
            name: 'loanOfficer'


        })
    })

})




router.get('/import', (req, res, next) => {
    res.render('../views/Loanboard/importBeneficiary.ejs', {
        name: 'loanOfficer'
    })
});




router.post('/upload', csrfProtection, (req, res, next) => {
    const document = req.file.filename;

    const files =
        new file({
            file: document,
            date: moment().format('MMMM Do YYYY, h:mm:ss a')
        })

    files.save(function(err, doc) {
        if (err) {
            console.log('no data in db entered')
        } else {
            res.redirect('/send')
        }
        res.render('../views/UniversityOfficer/send.ejs', {

            csrfToken: req.csrfToken(),
        })
    })

})


// DEFINE ROUTERS

router.get('/manage', function(req, res, next) {
    var query = req.params.query;
    beneficiary.findOne({
        req_no: query
    }, function(err, result) {
        if (err) throw err;
        if (result) {
            console.log(result)
        } else {
            res.send(JSON.stringify({
                error: Error
            }))
        }
    })
    res.render('../views/UniversityOfficer/manage.ejs', {
        title: 'Express',
        name: 'loanOfficer',
        benefeciary: query


    })

})


router.get('/receive/', function(req, res, next) {
    allocations.find({
        // _id: req.params.id

    }).then(row => {
        res.render('../views/UniversityOfficer/received.ejs', {
            title: 'Express',
            name: 'loanOfficer',
            allocations: row

        });
    });
});


router.get('/allocation/:id', (req, res, next) => {
    allocations.find({ _id: req.params.id }, (err, done) => {
        if (err) {
            console.log(err)
        } else {

            var downloadPath = path.join(__dirname, '/documents', req.params.id);
            res.download(downloadPath, function(err) {
                if (err) {
                    console.log("try again")
                } else {
                    console.log("download success full");
                    console.log(done)
                    next();
                }
            });
        }
    })
})



router.get('/send', function(req, res, next) {

    file.find({

        })
        .then(row => {
            res.render('../views/UniversityOfficer/send.ejs', {
                title: 'Express',
                csrfToken: req.csrfToken(),
                name: 'loanOfficer',
                files: row
            });
        })

});
router.get('/file/:id', (req, res, next) => {
    file.findOneAndDelete({ _id: req.params.id }, function(err, done) {
        if (err) {
            console.log(err)
        } else {
            console.log(done)
        }
    }).then(row => {
        res.redirect('/send')
    })

});


router.get('/result', function(req, res, next) {
    file.find({

    }).then(row => {
        res.render('../views/UniversityOfficer/result.ejs', {
            title: 'Express',
            name: 'loanOfficer',
            files: row

        });
    })


});



//edit and save details
router.get("/benefeciary", function(req, res) {
    benefeciary.find({}, function(err, benefeciary) {
        if (err) {
            throw err;
        } else {
            res.render("beneficiary", { benefeciary: benefeciary });
        }
    });
});
router.get("/beneficiary/:id/", function(req, res) {
    benefeciary.findById(req.params.id, function(err, benefeciary) {
        if (err) {
            throw err;
            res.redirect("/upload/beneficiary");
        } else {
            res.render("edit", { benefeciary: benefeciary });
        }
    });
});
router.put("/beneficiary/:id", function(req, res) {
    benefeciary.findByIdAndUpdate(req.params.id, req.body.benefeciary, function(err, updateData) {
        if (err) {
            throw err;
            res.redirect("/upload/beneficiary");
        } else {
            res.redirect("/upload/beneficiary");
        }
    });
});




module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}