let express = require('express');
let router = express.Router();

let multer = require('multer');
let Q = require('q');
let dbconfig   = require('./config/db.js');

let mysql = require('promise-mysql');
let pool = mysql.createPool(dbconfig);
router.get('/test',function (req, res) {
    res.send(req.query)
})
router.get('/', function(req, res){
    let type = req.query.type;
    let loca = req.query.loca;
    let sql = `
            SELECT 
                a.shop_no 'shopNo',
                a.name,
                a.category_detail,
                a.contents,
                a.call,
                a.address,
                a.img1,
                a.img2,
                a.img3,
                a.x,
                a.y,
                a.time,
                a.category_loca_No "locaNo",
                a.category_type_no "typeNo",
                (SELECT 
                        b.name
                    FROM
                        hgustu.shop_category_loca b
                    WHERE
                        a.category_loca_no = b.no) 'loca',
                (SELECT 
                        c.name
                    FROM
                        hgustu.shop_category_type c
                    WHERE
                        a.category_type_no = c.no) 'type'
            FROM
                hgustu.shop a
            where 
                1=1 and a.use_yn=1
        `
    if(type) {
        sql += ` and a.category_type_no=${type}`
    }

    if(loca) {
        sql += ` and a.category_loca_no=${loca}`
    }
    let ord = ` order by a.name`
    pool.query(sql+ord,[])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.post('/', function(req, res){
    console.log(req.body)
    let name = req.body.name;
    let category_detail = req.body.category_detail;
    let contents = req.body.contents;
    let call = req.body.call;
    let address = req.body.address;
    let typeNo = req.body.typeNo;
    let locaNo = req.body.locaNo;
    let x = req.body.x;
    let y = req.body.y;
    let time = req.body.time;
    let sql = `
            insert into shop
            (name, category_detail,contents,\`call\`,address,category_loca_no,category_type_no,x,y,time)
            values 
            (?,?,?,?,?,?,?,?,?,?)
        `

    pool.query(sql,[name, category_detail,contents,call,address,locaNo,typeNo,x,y,time])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.put('/', function(req, res){
    console.log(req.body)
    let shop_no = req.body.shop_no;
    let name = req.body.name;
    let category_detail = req.body.category_detail;
    let contents = req.body.contents;
    let call = req.body.call;
    let address = req.body.address;
    let typeNo = req.body.typeNo;
    let locaNo = req.body.locaNo;
    let x = req.body.x;
    let y = req.body.y;
    let time = req.body.time;
    let sql = `
            UPDATE shop SET 
            name=?,
            category_detail=?,
            contents=?,
            \`call\`=?,
            address=?,
            category_type_no=?,
            category_loca_no=?,
            x=?,
            y=?,
            time=?
             WHERE shop_no=?;

        `

    pool.query(sql,[name, category_detail,contents,call,address,locaNo,typeNo,x,y,time,shop_no])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            res.status(404).send(err);
        })
});
router.delete('/', function(req, res){
    let userNo = req.header('userNo')
    let shopNo = req.query.shopNo;
    let sql = `
            update shop set
            use_yn = 0
            where shop_no=?
        `

    pool.query(sql,[shopNo])
        .then(function(rows) {
            res.send(rows);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});
router.get('/detail', function(req, res){
    let shopNo = req.query.shopNo;
    let sql = `
            SELECT 
                a.shop_no 'shopNo',
                a.name,
                a.category_detail,
                a.contents,
                a.call,
                a.address,
                a.img1,
                a.img2,
                a.img3,
                a.x,
                a.y,
                a.time,
                (SELECT 
                        b.name
                    FROM
                        hgustu.shop_category_loca b
                    WHERE
                        a.category_loca_no = b.no) 'loca',
                (SELECT 
                        c.name
                    FROM
                        hgustu.shop_category_type c
                    WHERE
                        a.category_type_no = c.no) 'type'
            FROM
                hgustu.shop a
            where
                a.shop_no =? and a.use_yn=1
        `
    pool.query(sql,[shopNo]).
    then(function(row) {
        res.send(row[0]);
    })
        .catch(function (err) {
            res.send(err);
        })
});
router.get('/type', function(req, res){
    let sql = `
            SELECT 
                no, name
            from shop_category_type   
            where use_yn = 1
        `
    pool.query(sql,[]).
    then(function(row) {
        res.send(row);
    })
        .catch(function (err) {
            res.send(err);
        })
});
router.post('/type', function(req, res){
    let name = req.body.name;
    let sql = `
            insert into shop_category_type
                ( name)
            values
                 (?)
        `
    pool.query(sql,[name]).
    then(function(row) {
        res.send(row);
    })
        .catch(function (err) {
            res.send(err);
        })
});
router.delete('/type', function(req, res){
    let no = req.query.no;
    let sql = `
            update  shop_category_type set
                use_yn=0
            where
                 no=?
        `
    pool.query(sql,[name]).
    then(function(row) {
        res.send(row);
    })
        .catch(function (err) {
            res.send(err);
        })
});
router.get('/loca', function(req, res){
    let sql = `
            SELECT 
                no, name
            from shop_category_loca  
         where use_yn = 1
        `
    pool.query(sql,[]).
    then(function(row) {
        res.send(row);
    })
        .catch(function (err) {
            res.send(err);
        })
});

router.post('/loca', function(req, res){
    console.log(req.body)
    let name = req.body.name;
    let sql = `
            insert into  shop_category_loca
                ( name)
            values (?)   
        `
    pool.query(sql,[name])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.delete('/loca', function(req, res){
    let no = req.query.no;
    let sql = `
            update   shop_category_loca set
                use_yn=0
            where no = ? 
        `
    pool.query(sql,[no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.get('/problem',function (req, res) {
    let check = req.query.check;
    let shopNo = req.query.shopNo;
    let sql = `
            SELECT 
                a.no, a.content, a.shop_no, 
                (select b.name from shop b where b.shop_no = a.shop_no) "shopName",
                 a.\`read\`,
                 (select b.name from user b where b.user_no = a.user_no) "userName"
            from shop_problem  a
         where 1=1
        `
    if(check){
        sql += ` and a.read = ${check}`
    }
    if(shopNo){
        sql += ` and a.shop_no = ${shopNo}`
    }
    pool.query(sql,[])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.post('/problem', function(req, res){
    console.log(req.body)
    let content = req.body.content;
    let shopNo = req.body.shopNo;
    let userNo = req.body.userNo;
    let sql = `
            insert into  shop_problem
                ( content, shop_no, user_no)
            values (?,?,?)   
        `
    pool.query(sql,[content,shopNo,userNo])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
router.put('/problem', function(req, res){
    console.log(req.body)
    let no = req.body.no;
    let sql = `
            update  shop_problem set
            \`read\` = 1
            where no = ?
        `
    pool.query(sql,[no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            res.send(err);
        })
});
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
module.exports = router;
