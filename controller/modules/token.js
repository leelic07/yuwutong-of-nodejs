/**
 * Created by Administrator on 2018/3/2/002.
 */
const db = require('../../model');
const jwt = require('jsonwebtoken');
const config = require('../../config');

class Token {
    constructor() {
    }

    //生成token信息
    async authentication(ctx, next) {
        await db.getUsers().find(ctx.request.body).then(user => {
            if (user.length) {
                let token = jwt.sign({...user[0]}, config.secret, {'expiresIn': 1440});
                ctx.body = {
                    code: 200,
                    msg: '获取token成功',
                    result: {
                        token: token
                    }
                }
            } else ctx.body = {
                code: 404,
                msg: '用户名或者密码错误',
                result: ''
            }
        }).catch(err => ctx.throw(err.status || 500, err.message));
    }

    //验证token
    async verifyToken(ctx, next) {
        let decode;
        if (ctx.originalUrl === '/authentication') await next();
        else {
            //检查post的信息或者url查询参数或者头信息
            let token = ctx.request.body.token || ctx.request.query.token || ctx.request.header['authorization'];
            // 解析 token
            if (token) {
                // 确认token
                jwt.verify(token, config.secret, async (err, decoded) => {
                    // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                    ctx.request.users = decoded._doc;
                    decode = decoded;
                });
                if (decode)
                    await next();
                else ctx.throw(403, '用户未授权或者授权超时，请重新登录');
            } else {
                // 如果没有token，则返回错误
                ctx.throw(403, '用户没有授权');
            }
        }
    }
}

let token = new Token();

module.exports = token;
