var express = require('express');
var router = express.Router();
var http = require("http");
let dbconfig   = require('./config/db.js');
let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);
router.post('/login', function(req, res, next) {
    console.log(req.body)
    let stu_id = req.body.stu_id;
    let pwd = req.body.pwd;

    let sql = ` select user_no , name , stu_id, \`call\` from user where stu_id = ? and pwd = ?`
    let sql2 = ` insert into user  (user_no, stu_id,name,pwd) values (?,?,?,?)`
    let data;
    pool.query(sql,[stu_id,pwd])
        .then(function(rows) {
            console.log(rows)
            if(rows.length == 0) {
                var options = {
                    "method": "GET",
                    "hostname": "stu.handong.edu",
                    "port": null,
                    "path": "/stuinfo.php?user_id="+stu_id+"&password="+pwd,
                    "headers": {
                        "cache-control": "no-cache",
                        "postman-token": "579f2c5f-09b0-bf62-b3ff-97916308334b"
                    }
                };

                var req = http.request(options, function (result) {
                    var chunks = [];

                    result.on("data", function (chunk) {
                        chunks.push(chunk);
                    });

                    result.on("end", function () {
                        var body = Buffer.concat(chunks);
                        data = JSON.parse(body.toString());
                        pool.query(sql2,[data.no,data.user_id,data.user_name,pwd])
                            .then( row =>{
                                res.send({
                                    user_no:data.no,
                                    name:data.user_name,
                                    stu_id:data.user_id,
                                    call:null
                                });
                            })
                            .catch(function (err) {
                                res.status(404).send(err);
                            });
                    });
                });
                req.end();

            } else {
                res.send(rows[0]);
            }
        })
        .catch(function (err) {
            res.status(404).send(err);
        });
});

module.exports = router;
