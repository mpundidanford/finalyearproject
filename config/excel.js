const fs = require('fs');
const beneficiary =
    require('../models/beneficiary');
const excel = require('exceljs');

// Create a connection to the MongoDB database
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;

    let dbo = db.db("gkzdb");

    dbo.collection("beneficiary").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('beneficiary'); //creating worksheet

        //  WorkSheet Header
        worksheet.columns = [
            { header: 'Id', key: '_id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Address', key: 'address', width: 30 },
            { header: 'Age', key: 'age', width: 10, outlineLevel: 1 }
        ];

        // Add Array Rows
        worksheet.addRows(result);

        // Write to File
        workbook.xlsx.writeFile("customer.xlsx")
            .then(function() {
                console.log("file saved!");
            });

        db.close();
    });
});