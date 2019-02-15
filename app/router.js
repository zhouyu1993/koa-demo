import Router from 'koa-router'

import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

const api = {
  domain: 'http://dev.zhouyu.com:6789',
  music: '//c.y.qq.com',
  weixin: '//api.weixin.qq.com',
}

const router = new Router()

router
  .get('/', async (ctx, next) => {
    ctx.redirect('/home')
  })
  .get('/home', async (ctx, next) => {
    ctx.body = '<h1>Hello World</h1>'
  })
  .get('/test', async (ctx, next) => {
    await ctx.render('index', {
      data: {
        title: 'test',
        feature: './feature/test/index',
        users: [
          {
            name: 'Dead Horse'
          },
          {
            name: 'Jack'
          },
          {
            name: 'Tom'
          }
        ]
      }
    })
  })

  .get('/api/items', async (ctx, next) => {
    console.log('debug', ctx.request.query)

    ctx.body = {
      code: 0,
      message: 'ok',
      data: {
        count: 0,
        list: []
      }
    }
  })
  .get('/api/items/:id', async (ctx, next) => {
    console.log('debug', ctx.params)
    console.log('debug', ctx.request.query)

    ctx.body = {
      code: 0,
      message: 'ok',
      data: `get ${ctx.params.id} succeed`
    }
  })
  .post('/api/items/:id/modify', async (ctx, next) => {
    console.log('debug', ctx.params)
    console.log('debug', ctx.request.query)
    console.log('debug', ctx.request.body)

    ctx.body = {
      code: 0,
      message: 'ok',
      data: `post ${ctx.params.id} succeed`
    }
  })

  .get('/api/music/gethotkey', async (ctx, next) => {
    const url = `${api.music}/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=${+new Date()}`

    const res = await fetch(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
    })

    const json = await res.json()

    ctx.body = json
  })
  .get('/api/music/search', async (ctx, next) => {
    const query = ctx.request.query || {}
    const option = {
      w: '',
      perpage: 20,
      n: 20,
      p: 1,
      ...query,
    }
    const url = `${api.music}/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&catZhida=1&_=${+new Date()}&${queryString.stringify(option)}`

    const res = await fetch(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
    })

    const json = await res.json()

    ctx.body = json
  })
  .get('/api/music/singer', async (ctx, next) => {
    const query = ctx.request.query || {}
    const option = {
      singermid: '',
      begin: 0,
      num: 20,
      ...query,
    }
    const url = `${api.music}/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&order=listen&from=h5&_=${+new Date()}&${queryString.stringify(option)}`

    const res = await fetch(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
    })

    const json = await res.json()

    ctx.body = json
  })
  .get('/api/music/vkey', async (ctx, next) => {
    const query = ctx.request.query || {}
    const songmid = query.songmid || ''
    const option = {
      songmid,
      filename: `C400${songmid}.m4a`,
    }
    const url = `${api.music}/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&cid=205361747&guid=123456789&_=${+new Date()}&${queryString.stringify(option)}`

    console.log('debug', url)

    const res = await fetch(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
    })

    const json = await res.json()

    ctx.body = json
  })
  .get('/api/music/lyric', async (ctx, next) => {
    const query = ctx.request.query || {}
    const songid = query.songid || ''
    const option = {
      musicid: songid,
    }
    const url = `${api.music}/lyric/fcgi-bin/fcg_query_lyric.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&nobase64=1&musicid=5536869&_=${+new Date()}&${queryString.stringify(option)}`

    const res = await fetch(url, {
      headers: {
        origin: 'https://y.qq.com',
        referer: 'https://y.qq.com/m/index.html',
      },
    })

    const test = await res.text()

    const json = JSON.parse(test.slice(18, test.length - 1))

    ctx.body = json
  })

  /*
   * /api/xmpush/getAppInfo?app_key=${app_key}
   */
  .get('/api/xmpush/getAppInfo', async (ctx, next) => {
    const query = ctx.request.query || {}
    const app_key = query.app_key || ''

    if (app_key === 'abcdef') {
      ctx.body = {
        errcode: 0,
        errmsg: 'ok',
        data: {
          app_id: 'wx8d1d9b1abb35ca02',
          app_secret: '59cf75d7f05d41167ac3ddff2733d88c'
        }
      }
    } else {
      ctx.body = {
        errcode: -1,
        errmsg: 'error app_key'
      }
    }
  })

  /*
   * /api/wx/getAccessToken?app_key=${app_key}
   */
  .get('/api/wx/getAccessToken', async (ctx, next) => {
    const query = ctx.request.query || {}
    const app_key = query.app_key || ''

    const appInfo = await fetch(`${api.domain}/api/xmpush/getAppInfo?app_key=${app_key}`)

    const appInfoJson = await appInfo.json()

    if (appInfoJson.errcode === 0) {
      const { app_id, app_secret } = appInfoJson.data

      const res = await fetch(`${api.weixin}/cgi-bin/token?grant_type=client_credential&appid=${app_id}&secret=${app_secret}`)

      const json = await res.json()

      ctx.body = json
    } else {
      ctx.body = appInfoJson
    }
  })
  /*
   * /api/wx/code2Session?app_key=${app_key}&code=${code}
   */
  .get('/api/wx/code2Session', async (ctx, next) => {
    const query = ctx.request.query || {}
    const app_key = query.app_key || ''

    const appInfo = await fetch(`${api.domain}/api/xmpush/getAppInfo?app_key=${app_key}`)

    const appInfoJson = await appInfo.json()

    if (appInfoJson.errcode === 0) {
      const { app_id, app_secret } = appInfoJson.data
      const code = query.code

      const res = await fetch(`${api.weixin}/sns/jscode2session?appid=${app_id}&secret=${app_secret}&js_code=${code}&grant_type=authorization_code`)

      const json = await res.json()

      ctx.body = json
    } else {
      ctx.body = appInfoJson
    }
  })
  /*
   * /api/wx/getTemplateList?app_key=${app_key}&page=${page}&number=${number}
   */
  .get('/api/wx/getTemplateList', async (ctx, next) => {
    const query = ctx.request.query || {}
    const app_key = query.app_key || ''

    const accessTokenInfo = await fetch(`${api.domain}/api/wx/getAccessToken?app_key=${app_key}`)

    const accessTokenInfoJson = await accessTokenInfo.json()

    const access_token = accessTokenInfoJson.access_token
    // access_token 在7200秒内有效 (expires_in); access_token 的存储与更新

    if (access_token) {
      const page = +query.page
      const number = +query.number

      const res = await fetch(`${api.weixin}/cgi-bin/wxopen/template/list?access_token=${access_token}`, {
        method: 'POST',
        body: JSON.stringify({
          offset: page > 0 ? page - 1 : 0,
          count: (number > 0 && number < 21) ? number : (number < 1 ? 1 : 20)
        })
      })

      const json = await res.json()

      ctx.body = json
    } else {
      ctx.body = {
        errcode: -1,
        errmsg: 'failed to get access_token'
      }
    }
  })
  /*
   * /api/wx/sendTemplateMessage?app_key=${app_key}&code=${code}
   * template_id, page, form_id, data, emphasis_keyword
   */
  .post('/api/wx/sendTemplateMessage', async (ctx, next) => {
    const query = ctx.request.query || {}
    const app_key = query.app_key || ''
    const code = query.code

    return Promise.all([
      await fetch(`${api.domain}/api/wx/getAccessToken?app_key=${app_key}`),
      await fetch(`${api.domain}/api/wx/code2Session?app_key=${app_key}&code=${code}`)
    ]).then(async result => {
      const accessTokenInfoJson = await result[0].json()

      const access_token = accessTokenInfoJson.access_token
      // access_token 在7200秒内有效 (expires_in); access_token 的存储与更新

      const code2SessionInfoJson = await result[1].json()

      const openid = code2SessionInfoJson.openid

      if (access_token && openid) {
        const body = ctx.request.body

        const template_id = body.template_id || '0yvXL0d8HjAUrSuwxORkLErehefyJS0NUyh8S86-FUk'
        const page = body.page || '/pages/index/index'
        const form_id = body.form_id
        const data = body.data || {
          keyword1: {
            value: '123456789'
          },
          keyword2: {
            value: '520元'
          },
          keyword3: {
            value: '2019年2月14日'
          },
          keyword4: {
            value: '节日快乐'
          }
        }
        const emphasis_keyword = body.emphasis_keyword || 'keyword1.DATA'

        const res = await fetch(`${api.weixin}/cgi-bin/message/wxopen/template/send?access_token=${access_token}`, {
          method: 'POST',
          body: JSON.stringify({
            touser: openid,
            template_id,
            page,
            form_id,
            data,
            emphasis_keyword,
          })
        })

        const json = await res.json()

        ctx.body = json
      } else if (!access_token) {
        ctx.body = ctx.body = {
          errcode: -1,
          errmsg: 'failed to get access_token'
        }
      } else {
        ctx.body = ctx.body = {
          errcode: -2,
          errmsg: 'failed to get openid'
        }
      }
    })
  })

  .all('*', async (ctx, next) => {
    ctx.response.status = 404
    ctx.response.body = '<h1>404 Not Found</h1>'
  })

export default router
