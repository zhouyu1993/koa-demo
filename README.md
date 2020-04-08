# nodemon / node-supervisor

Monitor for any changes in your node.js application and automatically restart the server - perfect for development

运行热启动

# babel 使 node 支持 es6+

babel-register

`.babelrc`

babel-preset-env、babel-preset-stage-0、babel-plugin-transform-runtime

# ora

Elegant terminal spinner

终端旋转器，运行中提示

# chalk

Terminal string styling done right

终端字符串样式

# koa

* koa

* @koa/cors
  - 跨越

* koa-logger
  - 日志

* koa-onerror
  - 错误处理

* log4js
  - 日志

* koa-favicon
  - favicon 这东西缓存特别强烈，有时候隐私模式啊，清缓存啊，没用的，得多试试

* koa-static
  - 静态资源

* koa-bodyparser
  - 解析请求参数

* koa-json
  - 数据转换为 JSON 格式

* koa-router
  - 路由

* koa-views
  - 视图 view，[模版引擎](https://github.com/tj/consolidate.js#supported-template-engines)
  - koa-ejs、koa-react-view、koa-art-template、koa-hbs

## koa 相关知识

[request](https://github.com/koajs/koa/blob/master/docs/api/request.md)

``` js
const query = ctx.request.query || {}

const body = ctx.request.body || {}
```

[response](https://github.com/koajs/koa/blob/master/docs/api/response.md)

``` js
ctx.status === ctx.response.status

ctx.type === ctx.response.type

ctx.body === ctx.response.body
```

`response.body=`

  Set response body to one of the following:

  * `string` written
  * `Buffer` written
  * `Stream` piped
  * `Object` || `Array` json-stringified
  * `null` no content response

  If `response.status` has not been set, Koa will automatically set the status to `200` or `204`.

koa 可以返回 `Buffer` 或者 `Stream`

https://github.com/koajs/koa/blob/master/lib/response.js#L160

https://github.com/koajs/koa/blob/master/lib/application.js#L237

从而我们可以用 koa 返回一张图片（图片流）、一个文件（文档流）

省去了在 node 中用 `fs.createReadStream` 创建流、转化流的过程

Buffer 转化为 Stream ？

``` js
var stream = require('stream')

var buffer = new Buffer('Test data')

// 创建一个 bufferstream
var bufferStream = new stream.PassThrough()
//将 Buffer写入
bufferStream.end(buffer)

console.log(Buffer.isBuffer(buffer), bufferStream instanceof stream)
```

# pm2

部署

``` bash
npm i -g pm2
```

``` bash
pm2 start index.js
```

# [more](https://www.jianshu.com/p/d3afa36aa17a)

# 本地模拟 post 请求

`curl -i -X POST -H "'Content-type':'application/json'" -d "p1=1&p2=2" http://localhost:6789/api/items/1/modify?time=20180101`
