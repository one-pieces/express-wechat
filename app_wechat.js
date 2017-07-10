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

module.exports = app;
