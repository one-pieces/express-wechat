var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

// 用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function(req, res) {
  console.log('query', req.query);
  // 1. 获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature, // 微信加密签名
    timestamp = req.query.timestamp, // 时间戳
    nonce = req.query.nonce, // 随机数
    echostr = req.query.echostr; // 随机字符串

  // 2. 将token、timstamp、nonce三个参数进行字典序排序
  var array = [config.token, timestamp, nonce];
  array.sort();

  // 3. 将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join('');
  const hashCode = crypto.createHash('sha1'); // 创建加密类型
  var resultCode = hashCode.update(tempStr, 'utf-8').digest('hex'); // 对传入的字符串进行加密

  // 4. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (resultCode === signature) {
    res.send(echostr);
  } else {
    res.send('mismatch');
  }
});

module.exports = app;
