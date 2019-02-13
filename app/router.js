import Router from 'koa-router'

import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

const api = {
  music: '//c.y.qq.com',
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
        users: [{ name: 'Dead Horse' }, { name: 'Jack' }, { name: 'Tom' }]
      }
    })
  })

  .get('/api/items', async (ctx, next) => {
    console.log('items query:', ctx.request.query)

    ctx.body = {
      code: 0,
      data: {
        count: 0,
        list: []
      }
    }
  })
  .get('/api/items/:id', async (ctx, next) => {
    console.log('items/:id params:', ctx.params)
    console.log('items/:id query:', ctx.request.query)

    ctx.body = {
      code: 0,
      data: `get ${ctx.params.id} succeed`
    }
  })
  .post('/api/items/:id/modify', async (ctx, next) => {
    console.log('items/:id params:', ctx.params)
    console.log('items/:id query:', ctx.request.query)
    console.log('items/:id/modify data:', ctx.request.body)

    ctx.body = {
      code: 0,
      data: `post ${ctx.params.id} succeed`
    }
  })

  .get('/api/music/gethotkey', async (ctx, next) => {
    const url = `${api.music}/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=${+new Date()}`

    console.log(url)

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

    console.log(url)

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

  .all('*', async (ctx, next) => {
    ctx.response.status = 404
    ctx.response.body = '<h1>404 Not Found</h1>'
  })

export default router
