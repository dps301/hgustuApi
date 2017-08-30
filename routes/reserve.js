let express = require('express');
let router = express.Router();
let dbconfig   = require('./config/db.js');

let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);
var http = require("http");
var querystring = require('querystring');
router.get('/', function(req, res){
    let sql = `
            SELECT * from reserve 
                `;
    pool.query(sql,[])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.post('/', function(req, res){
    let title = req.body.title;
    let src = req.body.src;

    let sql = `
            insert into reserve 
            (title , src)
            values
            (?,?)
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
    let src = req.body.src;
    let link_no = req.body.link_no;

    let sql = `
            update reserve set 
            title = ?
             , src =?
            where link_no =?
                `;
    pool.query(sql,[title,src,link_no])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.delete('/', function(req, res){
    let link_no = req.query.link_no
    let sql = `
            delete from reserve where link_no=?
                `;
    pool.query(sql,[link_no])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.get('/bbq', function(req, res){
    let date = req.query.date;
    var options = {
        "method": "GET",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/bbq.php?date="+date,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "579f2c5f-09b0-bf62-b3ff-97916308334b"
        }
    };

    var req1 = http.request(options, function (result) {
        var chunks = [];

        result.on("data", function (chunk) {
            chunks.push(chunk);
        });


        result.on("end", function () {
            var body = Buffer.concat(chunks);
            data = JSON.parse(body.toString());
            res.send({
                data
            });
        });
    });
    req1.end();
});
router.get('/bbq/limit', function(req, res){
    var options = {
        "method": "GET",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/bbqlimit.php",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "579f2c5f-09b0-bf62-b3ff-97916308334b"
        }
    };

    var req1 = http.request(options, function (result) {
        var chunks = [];

        result.on("data", function (chunk) {
            chunks.push(chunk);
        });


        result.on("end", function () {
            var body = Buffer.concat(chunks);
            data = JSON.parse(body.toString());
            res.send({
                data
            });
        });
    });
    req1.end();
});

router.post('/bbq', function(req, res){
    res.header("Content-Type", "application/json; charset=utf-8");
    console.log(req.body)
    let team = req.body.team;
    let purpose = req.body.purpose;
    let name = req.body.name;
    let num = req.body.num;
    let call = req.body.call;
    let row = req.body.row;
    let col = req.body.col;
    let date = req.body.date;

    var post_data = querystring.stringify({
        'team' : team,
        'purpose': purpose,
        'name': name,
        'num' : num,
        'call' : call,
        'row' : row,
        'col' : col,
        'date' : date
    });

    let options = {
        "method": "POST",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/bbqInsert.php?team='"+team+"'&purpose='"+purpose+"'&name='"+name+"'&num="+num+"&call="+call+"&row="+row+"&col="+col+"&date="+date,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        },
        "mutipart":[{
            'content-type' :'text/html;charset=utf-8'
        }],
    };
    console.log(options.hostname+options.path);

    var req1 = http.request(options, function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    req1.write(post_data);
    req1.end();
    res.send("ok")

});
router.get('/david', function(req, res){
    let date = req.query.date;
    var options = {
        "method": "GET",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/david.php?date="+date,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "579f2c5f-09b0-bf62-b3ff-97916308334b"
        }
    };

    var req1 = http.request(options, function (result) {
        var chunks = [];

        result.on("data", function (chunk) {
            chunks.push(chunk);
        });


        result.on("end", function () {
            var body = Buffer.concat(chunks);
            data = JSON.parse(body.toString());
            res.send({
                data
            });
        });
    });
    req1.end();
});

router.post('/david', function(req, res){
    res.header("Content-Type", "application/json; charset=utf-8");
    console.log(req.body)
    let team = req.body.team;
    let purpose = req.body.purpose;
    let name = req.body.name;
    let num = req.body.num;
    let call = req.body.call;
    let row = req.body.row;
    let col = null;
    let date = req.body.date;

    var post_data = querystring.stringify({
        'team' : team,
        'purpose': purpose,
        'name': name,
        'num' : num,
        'call' : call,
        'row' : row,
        'col' : col,
        'date' : date
    });

    let options = {
        "method": "POST",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/davidInsert.php?team='"+team+"'&purpose='"+purpose+"'&name='"+name+"'&num="+num+"&call="+call+"&row="+row+"&col="+col+"&date="+date,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        },
        "mutipart":[{
            'content-type' :'text/html;charset=utf-8'
        }],
    };
    console.log(options.hostname+options.path);

    var req1 = http.request(options, function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    req1.write(post_data);
    req1.end();
    res.send("ok")

});

module.exports = router;
