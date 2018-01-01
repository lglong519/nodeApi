
const url = require('url'),
    querystring = require("querystring"),
    sendMail = require("./mail"),
    MongoClient = require('mongodb').MongoClient,
    DBurl = 'mongodb://localhost:27017/userInfo';

let server = () => {

    let app = (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        //获取请求的方式
        let method = req.method;
        if (method != 'POST') {
            res.writeHeader(403, { 'contentType': 'text/html;charset:"utf-8"' });
            res.write('Request method "GET" not supported');
        } else {
            let postStr = '',
                datas;
            //获取post数据
            req.on('data', (chunk) => {
                postStr += chunk;
            });
            //获取数据结束
            req.on('end', (err, chunk) => {
                //将数据转为对象类型
                datas = querystring.parse(postStr, '&', '=');

                res.writeHeader(200, { 'contentType': 'text/html;charset:utf-8' });

                //判断请求的api
                let pathName = url.parse(req.url).pathname.replace('/', '');

                //创建/发送验证码
                if (pathName == 'generateCode') {
                    let letters = 'abcedfghijklmlopqrstuvwxyzABCEEFGHIJKLMLOPQRSTUVWXYZ0123456789';
                    //创建验证码
                    for (var i = 0, codes = ''; i < 4; i++) {
                        codes += letters[parseInt(Math.random() * (letters.length - 1))];
                    }
                    //储存验证码，设置过期时间3分钟

                    MongoClient.connect(DBurl, (err, db) => {
                        if (err) {
                            console.log('connect fail');
                            return;
                        }
                        db.collection('user').createIndex({
                            'overTime': 1
                        }, {
                                expireAfterSeconds: 180
                            });
                        db.collection('user').insert({
                            'overTime': new Date(),
                            'verifyCode': codes,
                            'username': datas.user
                        });
                        db.close();
                    });

                    console.log('generateCode:', codes);
                    console.log('user:', datas.user);
                    if (datas.user && datas.user.indexOf('@') > -1) {
                        sendMail(datas.user, '登录验证码', '登录验证码：' + codes);
                    }
                    res.end();
                }
                //验证 验证码
                if (pathName == 'verifyCode') {
                    MongoClient.connect(DBurl, (err, db) => {
                        if (err) {
                            console.log('connect fail');
                            return;
                        }
                        //数据库获取临时验证码
                        db.collection('user').findOne({ 'username': datas.user }, (err, result) => {
                            if (result) {
                                console.log(result);
                                console.log('codes:',codes);
                                //将数据库的验证和个人输入的验证码对比
                                if (result.verifyCode == datas.verifyCode && result.username == datas.user) {
                                    res.write('success');
                                } else {
                                    res.write('verifyCode error');
                                }
                            } else {
                                res.write('please get your verifyCode');
                            }
                            res.end();
                        });
                        db.close();
                    });
                }
            });
        }

    };
    return app;
}

module.exports = server();