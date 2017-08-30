var express = require('express');
var router = express.Router();

let dbconfig   = require('./config/db.js');

let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);

router.get('/',function (req, res) {
    let promiseArr=[];
    let returnVal={};
    let sql = `
            SELECT calendar_no, week, title, SUBSTRING(startDay,6,5) "startDay", DATEDIFF(now(),startDay) "date" FROM hgustu.calendar where active=1;
        `;
    let sql2 = `
            SELECT a.title, a.content, a.rgb , b.startDay, a.link
            FROM hgustu.calendar_schedule a , calendar b 
            where a.calendar_no = b.calendar_no and a.week=? and a.day=?;
        `;
    pool.query(sql,[])
        .then(function(row) {
            returnVal = row[0];
            for(var j = 0; j<row[0].week; j++) {
                for(var k=0; k<7;k++)
                    promiseArr.push(pool.query(sql2, [j,k]))
            }
            return 1;
        })
        .then(function(row) {
            return Promise.all(promiseArr);
        })
        .then(function(row) {
            let item =[]
            for(let j = 0; j<returnVal.week; j++) {
                item.push({ week: [row[j*7+0],row[j*7+1],row[j*7+2],row[j*7+3],row[j*7+4],row[j*7+5],row[j*7+6]]});
            }
            returnVal.item = item;
            res.send(returnVal);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});

router.get('/all',function (req, res) {
    let sql = `
            SELECT * FROM hgustu.calendar
        `
    pool.query(sql,[])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.get('/all2',function (req, res) {
    let no = req.query.no;
    let sql = `
            SELECT a.no ,a.day, a.title, a.content, a.rgb ,a.week,a.link
            FROM hgustu.calendar_schedule a 
            where a.calendar_no = ?
        `;
    pool.query(sql,[no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.post('/',function (req, res) {
    console.log(req.body)
    let data = req.body.data;
    let sql = `
            insert into calendar_schedule 
            (day, title, content, rgb ,week,calendar_no,link)
            values
            (?,?,?,?,?,?,?)
        `;
    pool.query(sql,[data.day,data.title,data.content,data.rgb,data.week,data.calendar_no,data.link])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.put('/',function (req, res) {
    console.log(req.body)
    let data = req.body.data;
    let sql = `
            update calendar_schedule set
            day=?, title=?, content=?, rgb=? ,week=?,link=?
            where no=?
        `;
    pool.query(sql,[data.day,data.title,data.content,data.rgb,data.week,data.link,data.no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.delete('/',function (req, res) {
    let no = req.query.no;
    let sql = `
            delete from calendar_schedule where no=?
        `;
    pool.query(sql,[no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
})
module.exports = router;
