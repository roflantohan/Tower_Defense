const serve = require('koa-static');
const koa = require('koa');
const app = new koa();
const PORT = process.env.PORT || 3000;

app.use(serve(__dirname + '/public'));

app.listen(PORT);