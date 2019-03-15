import fs from 'fs'
import stream from 'stream'

import Router from 'koa-router'

import fetch from 'isomorphic-fetch'
import queryString from 'query-string'
import nodeXlsx from 'node-xlsx'

const api = {
  domain: 'http://dev.zhouyu.com:6789',
  music: '//c.y.qq.com',
  weixin: '//api.weixin.qq.com',
}

const router = new Router({
  prefix: '/koa-demo'
})

router
  .get('/', async (ctx, next) => {
    ctx.redirect('/koa-demo/home')
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

  .get('/test/json2html', async (ctx, next) => {
    const data = {
      "name": "点名册正面",
      "data": [
        [
          "课程名称：快乐童声4"
        ],
        [
          "温馨提示：                                                                   "
        ],
        [
          null,
          "1.起始课提前10分钟进教室，衔接课提前5分钟进教室、不早退、不拖堂；",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "教师姓名：陈继芸"
        ],
        [
          null,
          "2.着专业规定服装；",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "课程时段：周二19:00-20:30"
        ],
        [
          null,
          "3.日常教务请使用呼叫器。                                                            ",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "授课教室：2B"
        ],
        [
          null,
          "所在中心：万达金街     电话：86368275/86368295         ",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "课间休息时间:(5分钟)"
        ],
        [
          "序号",
          "小名",
          "学员姓名",
          "性别",
          "出生年月",
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          "已报学科及备注"
        ],
        [
          null,
          null,
          null,
          null,
          null,
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日",
          "月   日"
        ],
        [
          1,
          null,
          "徐国祯",
          "男",
          "2014/8/21"
        ]
      ]
    }

    const length = Math.max(...data.data.map(item => item.length))

    data.data = data.data.map(item => {
      const arr = Array.from(new Array(length - item.length)).map(value => null)

      return item.concat(arr)
    })

    await ctx.render('index', {
      data: {
        title: 'test/json2html',
        feature: './feature/test/json2html/index',
        data: data
      }
    })
  })

  .get('/test/json2excel', async (ctx, next) => {
    const json = {
      "errorCode": 0,
      "reason": null,
      "result": {
        "data": [
          [
              "10",
              [
                  [
                      "1550246400000",
                      5450
                  ],
                  [
                      "1550332800000",
                      5453
                  ],
                  [
                      "1550419200000",
                      5543
                  ],
                  [
                      "1550505600000",
                      5491
                  ],
                  [
                      "1550592000000",
                      5852
                  ],
                  [
                      "1550678400000",
                      5670
                  ],
                  [
                      "1550764800000",
                      0
                  ]
              ]
          ],
          [
              "151",
              [
                  [
                      "1550246400000",
                      5451
                  ],
                  [
                      "1550332800000",
                      5454
                  ],
                  [
                      "1550419200000",
                      5543
                  ],
                  [
                      "1550505600000",
                      5493
                  ],
                  [
                      "1550592000000",
                      5875
                  ],
                  [
                      "1550678400000",
                      5675
                  ],
                  [
                      "1550764800000",
                      0
                  ]
              ]
          ],
          [
              "152",
              [
                  [
                      "1550246400000",
                      1566
                  ],
                  [
                      "1550332800000",
                      1569
                  ],
                  [
                      "1550419200000",
                      1609
                  ],
                  [
                      "1550505600000",
                      1557
                  ],
                  [
                      "1550592000000",
                      1750
                  ],
                  [
                      "1550678400000",
                      1628
                  ],
                  [
                      "1550764800000",
                      0
                  ]
              ]
          ],
          [
              "156",
              [
                  [
                      "1550246400000",
                      7144
                  ],
                  [
                      "1550332800000",
                      7144
                  ],
                  [
                      "1550419200000",
                      7249
                  ],
                  [
                      "1550505600000",
                      7201
                  ],
                  [
                      "1550592000000",
                      7631
                  ],
                  [
                      "1550678400000",
                      7381
                  ],
                  [
                      "1550764800000",
                      0
                  ]
              ]
          ]
        ]
      },
      "status": null
    }

    const data = json.result.data

    const logType = { '10': '送达呀', '151': '实际下发', '152': '点击', '156': '计划推送' }

    const xlsxData = [
      {
        name: 'Sheet1',
        data: [
          ['日期'].concat(data[0][1].map(item => {
            const time = new Date(+item[0])

            return [time.getFullYear(), time.getMonth() + 1, time.getDate()].join('-')
          })),
          ...data.map((item, index) => {
            return [logType[item[0]]].concat(data[index][1].map(item => item[1]))
          })
        ]
      }
    ]

    const buffer = nodeXlsx.build(xlsxData)

    // fs.writeFile('test-json2excel.xlsx', buffer, 'utf-8', function (err) {
    //   if (err) {
    //     console.log('debug', err)
    //   } else {
    //     console.log('debug', 'The file has been saved!')
    //   }
    // })

    // const bufferStream = new stream.PassThrough()
    // bufferStream.end(buffer)
    // ctx.type = 'xlsx'
    // ctx.body = bufferStream

    ctx.type = 'xlsx'
    ctx.body = buffer

    console.log('debug', buffer instanceof stream, Buffer.isBuffer(buffer))
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
   * /api/xmpush/sendOpenId?open_id=${open_id}
   */
  .post('/api/xmpush/sendOpenId', async (ctx, next) => {
    const body = ctx.request.body

    const app_key = body.app_key || ''
    const open_id = body.open_id || ''
    const user_info = body.user_info || {}

    // 写入数据库

    ctx.body = {
      errcode: 0,
      errmsg: 'ok',
      data: null
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
   * /api/wx/sendTemplateMessage?app_key=${app_key}&code=${code}
   * template_id, page, form_id, data, emphasis_keyword
   */
  .post('/api/wx/sendTemplateMessage', async (ctx, next) => {
    const body = ctx.request.body || {}

    const app_key = body.app_key || ''
    const code = body.code

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

        const res = await fetch(`${api.weixin}/cgi-bin/message/wxopen/template/send`, {
          method: 'POST',
          body: JSON.stringify({
            access_token,
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
        ctx.body = {
          errcode: -1,
          errmsg: 'failed to get access_token'
        }
      } else {
        ctx.body = {
          errcode: -2,
          errmsg: 'failed to get openid'
        }
      }
    })
  })

  /*
   * /api/wx/sendUniformMessage?app_key=${app_key}&code=${code}
   * mp_template_msg 或 weapp_template_msg
   */
  // .post('/api/wx/sendUniformMessage', async (ctx, next) => {
  //   const body = ctx.request.body || {}
  //
  //   const app_key = body.app_key || ''
  //   const code = body.code
  //
  //   return Promise.all([
  //     await fetch(`${api.domain}/api/wx/getAccessToken?app_key=${app_key}`),
  //     await fetch(`${api.domain}/api/wx/code2Session?app_key=${app_key}&code=${code}`)
  //   ]).then(async result => {
  //     const accessTokenInfoJson = await result[0].json()
  //
  //     const access_token = accessTokenInfoJson.access_token
  //     // access_token 在7200秒内有效 (expires_in); access_token 的存储与更新
  //
  //     const code2SessionInfoJson = await result[1].json()
  //
  //     const openid = code2SessionInfoJson.openid
  //
  //     if (access_token && openid) {
  //       const mp_template_msg = body.mp_template_msg || {
  //         appid: 'wx7208a4af2628818b',
  //
  //       }
  //
  //       const template_id = body.template_id || '0yvXL0d8HjAUrSuwxORkLErehefyJS0NUyh8S86-FUk'
  //       const page = body.page || '/pages/index/index'
  //       const form_id = body.form_id
  //       const data = body.data || {
  //         keyword1: {
  //           value: '123456789'
  //         },
  //         keyword2: {
  //           value: '520元'
  //         },
  //         keyword3: {
  //           value: '2019年2月14日'
  //         },
  //         keyword4: {
  //           value: '节日快乐'
  //         }
  //       }
  //       const emphasis_keyword = body.emphasis_keyword || 'keyword1.DATA'
  //
  //       const res = await fetch(`${api.weixin}/cgi-bin/message/wxopen/template/send`, {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           access_token,
  //           touser: openid,
  //           mp_template_msg,
  //           weapp_template_msg,
  //         })
  //       })
  //
  //       const json = await res.json()
  //
  //       ctx.body = json
  //     } else if (!access_token) {
  //       ctx.body = {
  //         errcode: -1,
  //         errmsg: 'failed to get access_token'
  //       }
  //     } else {
  //       ctx.body = {
  //         errcode: -2,
  //         errmsg: 'failed to get openid'
  //       }
  //     }
  //   })
  // })

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

      const res = await fetch(`${api.weixin}/cgi-bin/wxopen/template/list`, {
        method: 'POST',
        body: JSON.stringify({
          access_token,
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

  .all('*', async (ctx, next) => {
    ctx.status = 404
    ctx.body = '<h1>404 Not Found</h1>'

    console.log('debug', ctx.status === ctx.response.status, ctx.type === ctx.response.type, ctx.body === ctx.response.body)
  })

export default router
