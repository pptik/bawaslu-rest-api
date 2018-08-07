const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const admin = require("firebase-admin")
const serviceAccount = require('./fcm_service_account.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bin-mobile-client.firebaseio.com"
})


app.admin = admin
app.use(cors());
app.database = null;

onerror(app);
app.use(bodyparser({
  enableTypes:['json', 'form'],
    formLimit:"50mb"
}));
app.use(json());
app.use(logger());
app.use(async (ctx, next) => {
  const start = new Date();
  ctx.body={}
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

const users = require('./routes/users');
app.use(users.routes(), users.allowedMethods());

const regions = require('./routes/regions');
app.use(regions.routes(), regions.allowedMethods());

const tps = require('./routes/tps');
app.use(tps.routes(), tps.allowedMethods());

const forums = require('./routes/forums');
app.use(forums.routes(), forums.allowedMethods());

const classes = require('./routes/classes');
app.use(classes.routes(), classes.allowedMethods());

const tasks = require('./routes/tasks');
app.use(tasks.routes(), tasks.allowedMethods());

const materials = require('./routes/materials');
app.use(materials.routes(), materials.allowedMethods());

const dashboard = require('./routes/dashboard');
app.use(dashboard.routes(), dashboard.allowedMethods());

const news = require('./routes/news');
app.use(news.routes(), news.allowedMethods());

const comments = require('./routes/comments');
app.use(comments.routes(), comments.allowedMethods());

const quizzes = require('./routes/quizzes');
app.use(quizzes.routes(), quizzes.allowedMethods());

const reports = require('./routes/reports');
app.use(reports.routes(), reports.allowedMethods());

const challenges = require('./routes/challenges')
app.use(challenges.routes(), challenges.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
