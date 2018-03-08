const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const controller = require('./controller');
//引入路由文件
const index = require('./routes/index');
const users = require('./routes/users');
const token = require('./routes/token');
const registrations = require('./routes/registrations');
const prisoners = require('./routes/prisoners');
const families = require('./routes/families');
const accounts = require('./routes/accounts');
const meetings = require('./routes/meetings');
//引用数据库模型
require('./model/index');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//token拦截器
app.use(controller.getTokenController().verifyToken);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(token.routes(), token.allowedMethods());
app.use(registrations.routes(), registrations.allowedMethods());
app.use(prisoners.routes(), prisoners.allowedMethods());
app.use(families.routes(), families.allowedMethods());
app.use(accounts.routes(), accounts.allowedMethods());
app.use(meetings.routes(), meetings.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
    // ctx.assert(err, err.status || 500, err.message)
});

module.exports = app;
