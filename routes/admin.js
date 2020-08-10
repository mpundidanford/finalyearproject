var express = require('express');
var router = express.Router();
var passport = require('passport')
var allocation = require('../models/allocations');
var beneficiary = require('../models/beneficiary')
var moment = require('moment');
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
var moment = require('moment');
const { get } = require('mongoose');
require('../config/passport')
router = express.router();


router.get('', function viewHomeAdmin(req, res, next) {
    res.render()
})

router.get('add-user', function addUser(req, res, next) {
    var messages = req.flash('error');
    var NewBeneficiary = new beneficiary();
}, beneficiary.create({
    Firstname: req.body.Firstname,
    Middlename: req.body.Middlename,
    Lasttname: req.body.Lastname,
    reg_no: req.body.reg_no,
    F4Index: req.body.F4Index,
    Status: req.body.Status,
    yos: req.body.yos,
    Course: req.body.Course,
    gender: req.body.gender,
    Account_no: req.body.Account_no,
    Bank: req.body.B,
    Tuition_fee: req.body.Tuition_fee,
    Accomodation: req.body.Accomodation,
    specialfacult: req.body.specialfacult,
    field: req.body.field,
    research: req.body.research,
}))