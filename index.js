const Koa = require('koa')
const axios = require('axios')
const bodyParser = require('koa-bodyparser')
const crypto = require('crypto')
const fs = require('fs')

const secret = fs.readFileSync('./secret', 'utf-8')

if (!secret) {
  return console.log('Please set the secret')
}

const hmac = crypto.createHmac('sha1', secret)
const server = new Koa()

server.use(bodyParser())

server.use(async (ctx, next) => {
  const { header, method, body } = ctx.request
  const sign = 'sha1=' + hmac.update(JSON.stringify(body), 'utf-8').digest('hex')

  if (method !== 'POST') {
    return ctx.response.status = 403
  }

  if (header['x-github-event'] !== 'issues') {
    return ctx.response.status = 400
  }

  if (sign !== header['x-hub-signature']) {
    return ctx.response.status = 401
  }

  return await next()
})

server.use(async (ctx, next) => {
  ctx.response.type = 'application/json'
  ctx.response.body = {
    c: 0
  }
})

server.listen(2333)