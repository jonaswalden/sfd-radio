'use strict';

const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();
app.use(serve('.'));

const port = process.env.port || 3000;
const server = app.listen(port);

module.exports = app;
module.exports.stop = callback => server.close(callback);