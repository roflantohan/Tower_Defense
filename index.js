const serve = require('koa-static');
const koa = require('koa');
const app = new koa();

app.use(serve(__dirname + '/public'));

app.listen(5000);