var express = require('express');
var router = express.Router();

let dbconfig   = require('./config/db.js');

let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);

router.get('/',function (req, res) {
    let userNo = req.query.userNo;
    let sql = `
            SELECT 
                a.coupon_no, a.shopName, a.amt, a.expDttm, b.no
            FROM
                hgustu.coupon a,
                hgustu.coupon_publish b
            WHERE
                b.user_no = ?
                and a.coupon_no = b.coupon_no
                and b.use_yn = 1
                and a.expDttm > now()
        `
    pool.query(sql,[userNo])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.get('/all',function (req, res) {
    let sql = `
            SELECT 
                a.coupon_no, a.shopName, a.amt, CONCAT(SUBSTRING(a.expDttm,1,4) ,'-', SUBSTRING(a.expDttm,6,2) ,'-', SUBSTRING(a.expDttm,9,2)) "expDttm"
            FROM
                hgustu.coupon a
        `
    pool.query(sql,[])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.get('/publish',function (req, res) {
    let couponNo = req.query.couponNo;
    let sql = `
            SELECT 
               b.coupon_no,(select a.name from user a where a.user_no = b.user_no) "name", b.user_no,b.pubDt
            FROM
                hgustu.coupon_publish b
            where 
                b.coupon_no = ?
        `
    pool.query(sql,[couponNo])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.put('/use',function (req, res) {
    let no = req.body.no;
    let sql = `
            update coupon_publish set
            use_yn = 0,
            useDt=now()
            where
            no=?
        `
    pool.query(sql,[no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});

router.post('/', function(req, res){
    console.log(req.body)
    let shopName = req.body.shopName;
    let amt = req.body.amt;
    let expDttm = req.body.expDttm;
    let sql = `
            insert into  coupon
                ( shopName, amt, expDttm)
            values (?,?,DATE_FORMAT(CONCAT(SUBSTRING(?,1,10),\' \',SUBSTRING(?,12,8)),GET_FORMAT(DATETIME,\'ISO\')))   
        `

    pool.query(sql,[shopName,amt,expDttm,expDttm])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.post('/publish', function(req, res){
    let userNo = req.body.userNo;
    let couponNo = req.body.couponNo;
    let sql = `
            insert into  coupon_publish
                (  coupon_no, user_no)
            values (?,?)   
        `
    pool.query(sql,[couponNo,userNo])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});

router.get('/user',function (req, res) {
    let stu_id = req.query.stu_id;
    let sql = `
            select user_no, name, stu_id from user where stu_id = ?
        `
    pool.query(sql,[stu_id])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
module.exports = router;
