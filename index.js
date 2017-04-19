const Koa = require('koa')
const axios = require('axios')
const bodyParser = require('koa-bodyparser')
const crypto = require('crypto')
const yaml = require('yamljs')

const config = yaml.load('./config.yml')

if (
  !config.secret      ||
  !config.token       ||
  !config.repository  ||
  !config.branch
) {
  return console.log('Missing configuration information')
}

const $header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Travis-API-Version': 3,
  'Authorization': 'token ' + config.token
}
const $body = {
  request: {
    branch: config.branch
  }
}
const $url = `https://api.travis-ci.org/repo/${encodeURIComponent(config.repository)}/requests`

const server = new Koa()

server.use(bodyParser())

server.use(async (ctx, next) => {
  const { header, method, body } = ctx.request
  const hmac = crypto.createHmac('sha1', config.secret)
  const sign = 'sha1=' + hmac.update(JSON.stringify(body), 'utf-8').digest('hex')

  if (method !== 'POST') {
    return ctx.response.status = 403
  }

  if (header['x-github-event'] === 'ping') {
    return ctx.response.status = 206
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
  await axios({
    method: 'post',
    url: $url,
    headers: $header,
    data: $body
  })
  .then(res => ctx.response.status = res.status)
  .catch(err => ctx.response.status = 500)
})

server.listen(2333)
