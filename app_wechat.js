const express = require('express');
const wechat = require('./wechat/wechat');
const config = require('./config');

var app = express();

var wechatApp = new wechat(config);

// 用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function(req, res) {
  console.log('query', req.query);
  wechatApp.auth(req, res);
});

// 用于请求获取 access_token
app.get('/getAccessToken', function(req, res) {
  wechatApp.getAccessToken().then(function(data) {
    res.send(data);
  });
});

module.exports = app;
