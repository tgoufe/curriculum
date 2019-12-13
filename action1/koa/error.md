---
title: Koa从零搭建到Api实现—优雅的处理异常
date: 2019-07-05 18:20:00
top: 999
tags: 
  - Koa
  - Node.js
categories: 
  - Koa
  - Node.js
---

一个良好的编码习惯必然离不开异常处理,而Node中的异常处理一直是令人吐槽的重点，那么如何优雅的处理异常呢？

<!--more-->

# 前言

我们在讲解如何处理异常之前，需要先对Koa中间件机制进行了解。

## Koa中间件机制解析

koa 的请求处理是典型的洋葱模型,下面是官方的配图，而这一模型的组成部分就是 middleware

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562311668576.png)

koa 中间件的执行机制，就是一个洋葱模型，每次请求进来，先执行前面的中间件，遇到 next，执行下一个中间件，以此重复，执行完所有中间件后，再从最后一个中间件往前执行

例子:

```
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  await next()
  console.log(6)
})

app.use(async (ctx, next) => {
  console.log(7)
})

// 输出结果是
1 3 5 7 6 4 2
```

> 思考 - 中间件在处理异常的过程中扮演了什么角色？

# 异常捕获

常见抛出异常和错误类型

- 代码语法不规范造成的JS报错异常
- 程序运行中发生的一些未知异常
- HTTP错误
- 自定义的业务逻辑错误

## 处理异常的方式

### try catch

说起异常捕获，我们最先想到的肯定是 **try catch**， 其在node下是如何实现？例子：

```
const func = async (ctx, next) => {
    try {
        await next()
    } catch () {
        ctx.body = { //返回异常 }
    }
}
app.use(func)
app.use(func1)
app.use(func2)

```
但是try catch 有个问题，它无法处理异步代码块内出现的异常。可以理解为在执行catch时，异常还没发生

```
try {
    asyncError()
} catch (e) {
    /*异常无法被捕获,导致进程退出*/
    console.log(e.message)
}

```

### callback方式

```
fs.mkdir('/dir', function (e) {
    if (e) {
        /*处理异常*/
        console.log(e.message)
    } else {
        console.log('创建目录成功')
    }
})
```

### Promise 方式

```
new Promise((resolve, reject) => {
    syncError()
}).then(() => {
        //...
    }).catch((e) => {
        /*处理异常*/
        console.log(e.message)
    })

```
Promise同样无法处理异步代码块中抛出的异常

### throw方法

Koa提供了ctx.throw(400)的方式，让我们便捷的抛出http错误，但是我们在抛出http错误的同时想返回额外的信息？该如何实现？

```
ctx.throw(400, 'name required', { user: user });

```

若需要定义若干业务逻辑错误码和说明，返回不同的code，在controller层面，你也许可以这样处理：

```
router.get('/', (ctx, next) => {
    if (checkToken(token)) {
        const code = ERROR_CODE.TOKEN_ERROR
        ctx.body = {
            code,
            msg: ERROR_MSG[code]
        }
        return
    }
    // do something
})
```
如果是在model层或者server层，要处理这样的错误怎么办？

1. 通过定义返回值来说明错误，在controller中判断返回值再返回相应错误码，比如：

    ```
    const somefunc = async (token) => {
      const res = await tokenExpire(token)
      if (res) {
        return false
      }
      // do something
    }
    ```

2. 抛出Error，在controller中catch住异常，并对比err.message来返回相应错误码，比如：

    ```
    const somefunc = async (token) => {
       const res = await tokenExpire(token)
       if (res) {
           throw Error(ERROR_MSG.TOKEN_ERROR)
       }
       // do something
     }
   ```
问题来了。
> 如果错误的类型，文言有很多种怎么办？
> 每次都需要进行if判断，烦不烦？


### process
process方式可以捕获任何异常(不管是同步代码块中的异常还是异步代码块中的异常)

```
process.on('uncaughtException', function (e) {
    /*处理异常*/
    console.log(e.message)
});
asyncError()
syncError()

```

### error事件的监听方式
```
const Koa = require('koa')
const app = new Koa()
app.on('error', (err, next) => {
    console.error('server error',err)
})
const main = ctx => {
    ctx.throw(500)
}
app.use(main)
app.listen(3000)
```

### 中间件的处理方式

```
const Koa = require('koa')
const app = new Koa()
app.use( async (ctx, next) =>{
    await next().catch(error => {
        console.log(error)
    });
})
const main = ctx => {
    ctx.throw(500)
}
app.use(main)
app.listen(3000)

```

# 优雅的异常处理方案！


## 断言库-assert

首先我们使用一个一个断言库！
- assert

为什么要使用？参考throw方法中，我们通常需要针对不同的业务逻辑场景进行返回错误。
比如： '用户名不为空'，'密码不能为空'，'起始日大于截止日'，'密码输入错误'，'用户名不存在'...等等
如果采用throw方法，我们需要定义很多code，msg来进行维护，比如：

ERROR_CODE:
```
ERROR_CODE = {
     SOME_CUSTOM_ERROR: 1001,
     EMPTY_PASSWORD: 1002
}
```

ERROR_MSG:

```
ERROR_MSG = {
  1001: 'some custom error msg',
  1002: '密码不能为空'
}

```
但是使用断言库之后，我们不需要去写如下代码，不需要额外维护code，msg

```

if (!ctx.request.body.password) { throw(...) }
if (!ctx.request.body.name) { throw(...) }

```

只需要

```
 assert.ok(data.password, 'password不能为空')
 assert.ok(data.name, '用户名不能为空')
```
即可，返回如下

```
{
    "code": 500,
    "msg": "password不能为空",
    "data": {},
    "success": false
}
```

## 定义HttpError和CustomError

利用koa中间件加上我们自定义的继承于Error构造器的方法便可以实现。

```
function CustomError (code, msg) {
  Error.call(this, '')
  this.code = code
  this.msg = msg || ERROR_MSG[code] || 'unknown error'
  this.getCodeMsg = function () {
    return {
      code: this.code,
      msg: this.msg
    }
  }
}
util.inherits(CustomError, Error)
function HttpError (code, msg) {
  if (Object.values(HTTP_CODE).indexOf(code) < 0) {
    throw Error('not an invalid http code')
  }
  CustomError.call(this, code, msg)
}
util.inherits(HttpError, CustomError)
```
## 抛出错误

```
router.get('/HttpError', (ctx, next) => {
  throw new HttpError(HTTP_CODE.FORBIDDEN)
})
const somefunc = async (token) => {
  const res = await tokenExpire(token)
  if (res) {
    throw new CustomError(CUSTOM_CODE.SOME_CUSTOM_ERROR)
  }
  // do something
}
```

## koa中间件统一catch住Error，并返回相应code,msg

```
app.use((ctx, next) => {
  return next().catch((err) => {
    let code = 500
    let msg = 'unknown error'
    if (err instanceof CustomError || err instanceof HttpError) {
      const res = err.getCodeMsg()
      ctx.status = err instanceof HttpError ? res.code : 200
      code = res.code
      msg = res.msg
    } else {
      console.error('err', err)
    }
    ctx.body = {
      code,
      msg
    }
  })
})

```

通过以上4步，抛出异常只用一行代码就搞定。

- 抛出http错误就 throw new HttpError(HTTP_CODE.FORBIDDEN)
- 抛出统一的业务错误码就throw new CustomError(CUSTOM_CODE.SOME_CUSTOM_ERROR)
- 抛出特殊错误就使用assert断言库

错误抛出后，会统一由koa中间件来处理。通过对Error的继承，我们将错误细分为http error和业务错误，从而可以更好地处理错误返回。


# 日志

日志我们使用 - log4js 插件
在异常捕获中间件进行存储

```
var log4js = require('log4js')
log4js.configure({
  appenders: { koa: { type: 'file', filename: 'koa.log' } },
  categories: { default: { appenders: ['koa'], level: 'error' } }
});
const logger = log4js.getLogger('koa');
logger.error({url: ctx.request.url, error: err, params: ctx.request.body});
```
出现异常时就会生成日志文件，如图

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562317129508.png)

# 最后

努力学习，提高代码水平，少出异常！
