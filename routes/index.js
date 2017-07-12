var express = require('express');
var https = require('https');
var config = require('../config.json');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log('index', req.query);
  var result = await requestGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appID}&secret=${config.appScrect}&code=${req.query.code}&grant_type=authorization_code`);
  result = JSON.parse(result);
  console.log('index accessToken', result);

  var userinfo = await requestGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${result.access_token}&openid=${result.openid}&lang=zh_CN`);
  userinfo = JSON.parse(userinfo);
  console.log('index userinfo', userinfo);

  res.render('index', {
    title: 'Express',
    token: result.access_token,
    openid: result.openid,
    nickname: userinfo.nickname,
    avatar: userinfo.headimgurl
  });
});

function requestGet(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      var buffer = [];
      var result = '';
      // 监听 data 事件
      res.on('data', function(data) {
        buffer.push(data);
      });
      // 监听数据传输完成事件
      res.on('end', function() {
        result = Buffer.concat(buffer).toString('utf-8');
        // 将最后结果返回
        resolve(result);
      });
    }).on('error', function(err) {
      reject(err);
    });
  });
};

module.exports = router;
