const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
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
const mailboxes = require('./routes/mail_boxes');
const terminals = require('./routes/terminals');
const versions = require('./routes/versions');
const upload = require('./routes/upload');
const prison_terms = require('./routes/prison_terms');
const items = require('./routes/items');
const orders = require('./routes/orders');
const jails = require('./routes/jails');
const news = require('./routes/news');
const prison_reward_punishment = require('./routes/prison_reward_punishment');
const prisoner_orders = require('./routes/prisoner_orders');

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

//设置跨越请求
app.use(cors({
    origin: function (ctx) {
        return ctx.request.header['origin'];
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

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
app.use(mailboxes.routes(), mailboxes.allowedMethods());
app.use(terminals.routes(), terminals.allowedMethods());
app.use(versions.routes(), versions.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());
app.use(prison_terms.routes(), prison_terms.allowedMethods());
app.use(items.routes(), items.allowedMethods());
app.use(orders.routes(), orders.allowedMethods());
app.use(jails.routes(), jails.allowedMethods());
app.use(news.routes(), news.allowedMethods());
app.use(prison_reward_punishment.routes(), prison_reward_punishment.allowedMethods());
app.use(prisoner_orders.routes(), prisoner_orders.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
    // ctx.assert(err, err.status || 500, err.message)
});

module.exports = app;
