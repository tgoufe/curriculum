---
title: Koa从零搭建到Api实现—项目的搭建
date: 2019-04-24 18:20:00
top: 999
tags: 
  - Koa
  - JavaScript
categories: 开发技巧
---


Koa 文档过于精简，虽然将每一个API都进行解释说明，但还是很难将其组织起来进行应用，对于初学者来说可谓是很不友好。很多人第一个Koa项目，将所有接口，逻辑，配置等全部写在了app.js中，虽说完美运行，但是可读性，可维护性极差，所以一个好的目录结构尤为重要



<!--more-->


# Koa从零搭建到Api实现—项目的搭建

## 什么是Koa？

> Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

### Koa vs Express 

Koa使用promises和async函数来摆脱回调地狱的应用并简化错误处理。它暴露自己ctx.request和ctx.response对象而不是节点req和res对象。另一方面，Express 使用其他属性和方法扩充节点req和res对象，并包括许多其他“框架”功能，例如路由和模板，Koa没有。

因此，如果你希望更接近node.js和传统的node.js样式编码，你可能希望坚持使用Connect / Express或类似的框架。如果你想摆脱回调，请使用Koa。


### 总结
Koa是一个比Express更精简，使用node新特性的中间件框架，相比之前express就是一个庞大的框架
- 如果你喜欢diy，很潮，可以考虑Koa，它有足够的扩展和中间件，而且自己写很简单
- 如果你想简单点，找一个框架啥都有，那么先Express

如果你有兴趣了解更多不同，请访问[Koa vs Express](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md)

## Koa 项目搭建

注意，本篇教程面向有一定Koa使用经验的用户。如果，你还不了解Koa,请先看下面的文档[Koa 中文文档](https://koa.bootcss.com/)

Koa 文档过于精简，虽然将每一个API都进行解释说明，但还是很难将其组织起来进行应用，对于初学者来说可谓是很不友好。

笔者第一个Koa项目，将所有接口，逻辑，配置等全部写在了app.js中，虽说完美运行，但是可读性，可维护性极差，所以一个好的目录结构尤为重要


### 目录创建

 - config - 配置
 - models - 数据库模型（ROM）
 - controller - 控制器
 - middlewares - 中间件
 - public - 静态资源
 - service - 服务
 - router - 路由
 - app.js - 启动文件
 
### 依赖安装
 创建好项目目录后我们需要安装一些依赖，来供我们使用
 
 - babel-core/babel-preset-es2015 - 让 nodeJs 支持 es6 modules
 - koa - koa2
 - koa-body - request body 解析
 - koa-cache-control - 缓存控制
 - koa-compress - gzip
 - koa-cors - 跨域
 - koa-logger - 日志
 - koa-onerror - 错误处理
 - koa-router - 路由
 - koa-session - session
 - koa-static - 静态资源服务
 - koa-helmet - 安全
 - md5 - md5 加密
 - mkdirp - 递归创建目录
 
 
 可以根据自己的需求进行选择，但是一些依赖是必须安装的
 
 
 - koa - koa2
 - koa-body - request body 解析
 - koa-router - 路由

后面的内容会讲解每个插件有什么用，如何去用。



## 目录详解
### config

config是我们的配置文件，比如：

- 数据库(mysql,oracle,redis等)
- OSS
- ...

实际运用：

 - confirg
    - database.config.js(新建)

#### database.config.js

```javascript

export default {
  database: '',
  username: '',
  password: '',
  dialect: '',
  host: '',
  port: 3306
}
```
具体配置之后会跟大家仔细讲解。

### models 

models文件夹主要是我们的数据库模型（ORM），存储数据库映射文件，eg：

- models
    - index.js - 入口文件
    - user.js - 对应数据库中的user表

#### index.js

 ```javascript
import Sequelize from 'sequelize'
import config from '../config/database.config'
const sequelize = new Sequelize(config)
export const user = sequelize.import(__dirname + '/user')
export default {
  user,
  sequelize
}
```
以下序号代表代码行号：

   1. 引入sequelize,它是一个ORM框架，之后会详细讲解它的使用
   2. 引入我们之前在**config**中创建的数据库配置文件呢
   3. 使用sequelize连接数据库
   4. 将本地数据库映射文件导出供我们使用
   
### controller

controller为控制层，主要处理外部请求。调用service层，将service返回的内容整合后返回给调用方


举例：
```javascript
const user = require('../service/user')
const findAllUser = async (ctx) => {
  const data = ctx.request.body
  const result = await user.findAllUser(data)
  ctx.body =  send({data: result})
}
module.exports = {
  findAllUser
}
```
以下序号代表代码行号：

3. 获取请求体
4. 调用service层
5. 将service返回的内容返回给调用者（send是自定义的数据格式化方法）

### service

service作为服务层主要做相信的业务逻辑处理，数据处理等，将结果返回给controller层

举例：

```javascript
const db = require('../models/')
const findAllUser = async () => {
  const result = await db.user.findAll()
  return result
}
module.exports = {
  findAllUser
}

```
以下序号代表代码行号：

1. 获取数据库映射文件,因为要操作数据库
3. 从数据库中查寻全部用户（db.user.findAll()为sequelize中提供的查询方法）
4. 返回给controller

### routers

router管理我们的路由，也就是接口地址

举例：

```javascript
const user = require('../controller/user')
const koa_router = require('koa-router');
const router = koa_router();
router.post('/findAll', user.findAllUser)
module.exports = router
```

以下序号代表代码行号：

1. 引入controller层
4. 定义接口类型，地址，调用方法（post, '/findAll''，findAllUser)

### app.js

app.js是我们的入口文件及主文件,我们将**router**里配置的路由在此引入

```javascript
const
  koaBody = require('koa-body')
  Koa = require('koa'),
  Router = require('koa-router')
  router = new Router()

const user = require('./routers/user');
router.use("/user",user.routes());
```
这样我们就可以访问：ip:port/user/findAll 接口。
