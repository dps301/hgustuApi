var express = require('express');
var router = express.Router();
let multer = require('multer');
let Q = require('q');
var http = require("http");

router.get('/notice',function (req, res) {
    let offset = req.query.offset;
    let pageSize = req.query.pageSize;

    var options = {
        "method": "GET",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/noticeinfo.php?offset="+offset+"&pageSize="+pageSize,
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
})
router.get('/complain',function (req, res) {
    let offset = req.query.offset;
    let pageSize = req.query.pageSize;

    var options = {
        "method": "GET",
        "hostname": "stu.handong.edu",
        "port": null,
        "path": "/complain.php?offset="+offset+"&pageSize="+pageSize,
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
router.get('/mainImg',function (req, res) {
    res.send([{img:"http://52.78.230.42:3200/img/1.png"},{img:"http://52.78.230.42:3200/img/2.png"},{img:"http://52.78.230.42:3200/img/3.png"}])
})

router.post('/img/:filename', function(req, res, next) {
    upload(req, res).then(function (file) {
        res.json(file);
    }, function (err) {
        res.sendStatus(500, err);
    });
});
var upload = function (req, res) {

    var deferred = Q.defer();
    var imagePath = "public/images";
    var storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, imagePath);
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {
            file.uploadedFile = {
                name: req.params.filename,
                ext: file.mimetype.split('/')[1]
            };
            cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
        }
    });

    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        console.log(req.file)
        if (err) deferred.reject();
        else deferred.resolve(req.file.uploadedFile);
    });
    return deferred.promise;
};
// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//     }
// });
//
// var upload = multer({ //multer settings
//     storage: storage
// }).single('file');
//
// /** API path that will upload the files */
// router.post('/img', function(req, res) {
//     upload(req,res,function(err){
//         console.log(req.file);
//         if(err){
//             res.json({error_code:1,err_desc:err});
//             return;
//         }
//         res.json({error_code:0,err_desc:null});
//     });
// });
module.exports = router;
