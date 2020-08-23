var express = require('express')
var multer = require('multer')
var path = require('path')
var moment = require('moment')
var allocation = require('../models/allocations')
var fs = require('fs')
const { count } = require('../models/beneficiary');
var beneficiary = require("../models/beneficiary");
const file = require('../models/files')
const files = require('../models/files')
const allocations = require('../models/allocations')
const pdfMake = require('../config/pdfmake');
const PDFDocument = require('pdfkit')
const vfsFonts = require('../config/vsf_font');

const exceljs =
    require('exceljs');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();



router.use('/', isLoggedIn,
    function checkAuthentication(req, res, next) {
        next();
    });


router.get('/', function viewHome(req, res, next) {
    res.render('UniversityOfficer/index', {
        title: 'loan officer home',
        name: 'loanOfficer'
    })
})



router.get('/update/:id', (req, res, next) => {
    beneficiary.findOneAndUpdate({

    })

    render('../views/UniversityOfficer/index.ejs', {
        result: result
    })



})

router.get('/view-all', (req, res, next) => {
    beneficiary.find({


    }).then(row => {
        res.render('../views/UniversityOfficer/view_all.ejs', {
            beneficiary: row,
            name: 'loanOfficer',


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




router.post('/upload', (req, res) => {
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
            res.redirect('/loanofficer/send')
        }
        res.render('../views/UniversityOfficer/send.ejs', {


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


// router.get('/allocation/:id', (req, res, next) => {
//     allocations.find({ _id: req.params.id }, (err, done) => {
//         if (err) {
//             console.log(err)
//         } else {

//             var downloadPath = path.join(__dirname, '/documents', req.params.id);
//             res.download(downloadPath, function(err) {
//                 if (err) {
//                     console.log("try again")
//                 } else {
//                     console.log("download success full");
//                     console.log(done)
//                     next();
//                 }
//             });
//         }
//     })
// })



router.get('/send', function(req, res, next) {

    file.find({

        })
        .then(row => {
            res.render('../views/UniversityOfficer/send.ejs', {
                title: 'Express',

                name: 'loanOfficer',
                files: row
            });
        })

});
// router.post('/delete-file/:id', function deletefile(req, res) {
//     var id = req.params.id;
//     file.findByIdAndRemove({ _id: id }, function deletefile(err) {
//         if (err) {
//             console.log('unable to delete file');
//         } else {
//             res.redirect('/loanofficer/send')
//         }
//     });
// });
router.get('/file/:id', async(req, res, next) => {
    file.findOneAndDelete(await { _id: req.params.id }, function(err, done) {
        if (err) {
            console.log(err)
        } else {
            console.log(done)
        }
    }).then(row => {
        res.redirect('/loanofficer/send/')
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
console.log(path.join(require.main.filename + '/../documents/'))


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
console.log(path.join(require.main.filename + '/../documents/'))

router.post('/download/:file', (req, res) => {
    let { file } = req.body;


    var pp = path.join(require.main.filename + `${'/../documents/'+file}`)
    res.download(pp, error => {
        console.log('file failed to download', +error)
    });

});
router.post('/download/:allocations', (req, res) => {
    let { allocations } = req.body;


    var pp = path.join(require.main.filename + `${'/../documents/'+allocations}`)
    res.download(pp, error => {
        console.log('file failed to download', +error)
    });

})

router.get('/loanofficer/generate', async(req, res, next) => {
    const startDate = moment(new Date()).startOf('month').toDate();
    const endDate = moment(new Date()).endOf('month').toDate();
    try {
        const files = await file.find({ created_at: { $gte: startDate, $lte: endDate } });
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('/documents');
        worksheet.columns = [
            { header: 'File', key: 'file', width: 100 },
            { header: 'Date', key: 'date', width: 10 },

        ];
        let count = 1;
        files.forEach(file => {
            (file).s_no = count;
            worksheet.addRow(file);
            count += 1;
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        const data = await workbook.xlsx.writeFile('file.xlsx')
        res.send('done');
    } catch (e) {
        res.status(500).send(e);
    }
    res.render('../views/UniversityOfficer/manage.ejs')
})

router.post('/pdf', (req, res, next) => {
    file.find({

    })
    var documentDefinition = {
        content: [

        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="filename.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

});
router.get("/generatePdf/:id", async(req, res, next) => {
    const id = req.params.id;
    const documents = await file.findAll({ where: { id } });
    const document = file[0];
    const stream = await new Promise((resolve, reject) => {
        pdf.create(document.file).toStream((err, stream) => {
            if (err) {
                reject(reject);
                return;
            }
            resolve(stream);
        });
    });
    const fileName = `${+new Date()}.pdf`;
    const pdfPath = `${__dirname}/../../documents${fileName}`;
    stream.pipe(fs.createWriteStream(pdfPath));
    const doc = await file.update({ pdfPath: fileName }, { where: { id } });
    res.json(doc);
});

router.get('/pdf', function(req, res, next) {

    var id = req.query.id;

    const doc = new PDFDocument();

    var result = req.models.file.find({ id: id }, function(error, file) {

        if (error) throw error;

        var file = req.body.file;

        var date = req.body.date;

        var filename = encodeURIComponent(title) + '.pdf';

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');

        res.setHeader('Content-type', 'application/pdf');

        doc.font('Times-Roman', 18)
            .fontSize(25)
            .text(title, 100, 50);

        doc.fontSize(15)
            .fillColor('blue')
            .text('Read Full Article', 100, 100)
            .link(100, 100, 160, 27, link);

        doc.moveDown()
            .fillColor('red')
            .text("Author: " + author_name);

        doc.moveDown()
            .fillColor('black')
            .fontSize(15)
            .text(content, {
                align: 'justify',
                indent: 30,
                height: 300,
                ellipsis: true
            });

        doc.pipe(res);

        doc.end();
    })
    res.redirect('../views/UniversityOfficer/manage.ejs', {
        file: row
    })
});

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}