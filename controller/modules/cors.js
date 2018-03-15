/**
 * Created by Administrator on 2018/3/14/014.
 */

class Cors {
    constructor() {
    }

    //设置跨域请求头
    async cors(ctx, next) {
        //获取客户端请求源
        let reqOrigin = ctx.request.header['origin'];
        //设置允许请求源请求
        ctx.response.set({
            'Access-Control-Allow-Origin': reqOrigin,
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
            'Access-Control-Allow-Credentials': true
        });
        await next();
    }
}

module.exports = new Cors();