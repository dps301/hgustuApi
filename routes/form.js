let express = require('express');
let router = express.Router();
let dbconfig   = require('./config/db.js');

let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);

router.get('/', function(req, res){
    let sql = `
            SELECT * from form 
                `
    pool.query(sql,[])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.send(err);
        })
});

router.post('/', function(req, res){
    let title = req.body.title;
    let link = req.body.link;
    let descript = req.body.descript;

    let sql = `
            insert into form 
            (title , link, descript)
            values
            (?,?,?)
                `;
    pool.query(sql,[title,src])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.put('/', function(req, res){
    let title = req.body.title;
    let link = req.body.link;
    let descript = req.body.descript;
    let form_no = req.body.form_no;

    let sql = `
            update form set 
            title = ?
             , link =?
             , descript =?
            where form_no =?
                `;
    pool.query(sql,[title,link,descript,form_no])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.delete('/', function(req, res){
    let form_no = req.query.form_no
    let sql = `
            delete from form where form_no=?
                `;
    pool.query(sql,[form_no])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
module.exports = router;
