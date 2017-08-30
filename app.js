let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');
let fs = require('fs');

let index = require('./routes/index');
let users = require('./routes/users');
let shop = require('./routes/shop');
let coupon = require('./routes/coupon');
let calendar = require('./routes/calendar');
let reserve = require('./routes/reserve');
let form = require('./routes/form');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/*',cors());
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use('/', index);
app.use('/users', users);
app.use('/shop', shop);
app.use('/coupon', coupon);
app.use('/calendar', calendar);
app.use('/reserve', reserve);
app.use('/form', form);
app.get('/admin',function (req, res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     // next(err);
//     res.sendFile(path.join(__dirname+'/public/index.html'));
// });
app.get('/img/:img',function (req, res) {
    let imgs = req.params.img;
    let img = fs.readFileSync('public/images/'+imgs);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
