import path from 'path'

import Ora from 'ora'
import Chalk from 'chalk'

import Koa from 'koa'

import KoaCors from '@koa/cors'

import Logger from 'koa-logger'
import Onerror from 'koa-onerror'

import Favicon from 'koa-favicon'
import Static from 'koa-static'

import Bodyparser from 'koa-bodyparser'
import Json from 'koa-json'

import Router from 'koa-router'

import ArtTemplate from 'koa-art-template'

import config from '../config'

import router from './router'

const spinner = Ora('Loading Koa').start()

const app = new Koa()

app.use(KoaCors({
  origin: '*',
}))

app.use(async (ctx, next) => {
  const start = Date.now()

  await next()

  const ms = Date.now() - start

  ctx.set('X-Powered-By', 'koa')

  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(Logger({
  /**
   * [transporter description]
   * @param  {[string]} str  [output string with ANSI Color]
   * @param  {[array]} args [format, method, url, status, time, length]
   * @return {[undefined]}
   */
  transporter: (str, args) => {
    console.log('>>>>>>>>>>logger>>>>>>>>>>')
    console.log(str, '\n', args)
    console.log('<<<<<<<<<<logger<<<<<<<<<<')
  }
}))

Onerror(app)

app.use(Favicon(path.resolve(__dirname, '../', './public/favicon.ico')))
app.use(Static(path.resolve(__dirname, './assets')))

app.use(Bodyparser())
app.use(Json())

ArtTemplate(app, {
  root: path.join(__dirname, 'view'),
  extname: '.html',
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port, () => {
  spinner.succeed()

  console.log(Chalk.blue(`Your application is running here: http://${config.host}:${config.port}`))
})
