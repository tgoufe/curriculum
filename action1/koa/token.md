---
title: Koa从零搭建之实现JWT用户认证
date: 2019-05-22 11:00:00
tags: 
  - Koa
  - JavaScript
categories: 
  - Koa
  - JavaScript
---

> Token作为用户的唯一标识，他的作用不过多去说，本文带你从Token生成到验证全过程！
<!--more-->

# 环境准备

## 依赖的选择及安装
基于上节课讲的一些必要依赖以外，我们需要安装一下依赖：

- md5 - 密码加密
- util - 内置模块，视情况安装
- jsonwebtoken - JSON Web Token的实现([JSON Web Token入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html))

## 实现登陆接口

我们依次创建,并实现基础功能
- router
- controller
- service
> 如有忘记，请参阅[Koa从零搭建到Api实现—项目的搭建](http://www.bingshangroup.com/blog/tags/Koa/) 

# 密码加密

一般在涉及到密码等敏感信息存储数据库时，不可能明文存储，必须对其进行加密。而我们最常使用的为md5加密
简单的密码md5加密后可以破解，但是稍微复杂一点的不可破解。故还是很安全的

## 如何使用

使用很简单
```
const md5 = require('md5')
md5(password)

```
通常我们在用户注册时，获取用户录入的密码，加密后存到数据库。而在登录时，先对密码加密，然后再与数据库中加密后的数据进行匹配。

# Token

## Token的组成

- Header - 头部
- Playload - 有效载荷
- Signature - 签名

### Header

```
{ 
    “typ”: “JWT”, 
    “alg”: “HS256” 
} 
```
由上可知，该token使用HS256加密算法，将头部使用Base64编码可得到一串字符串

eyJhbGciOiJIUzI1NiJ91

### Playload

```
{  
  “iss”: “Online JWT Builder”,  
  “iat”: 1416797419,  
  “exp”: 1448333419,  
      ……. 
  “userid”:10001 
}
```
有效载荷中存放了token的签发者（iss）、签发时间（iat）、过期时间（exp）等以及一些我们需要写进token中的信息。有效载荷也使用Base64编码得到一串字符串

eyJ1c2VyaWQiOjB91
### Signature

将Header和Playload拼接生成一个字符串str=“eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjB9”，使用HS256算法和我们提供的密钥（secret,服务器自己提供的一个字符串）对str进行加密生成最终的JWT，即我们需要的令牌（token），形如：str.”签名字符串”。

## Token 在服务端与客户端的交互过程

1. 客户端通过用户名密码登陆
2. 服务器验证用户名密码，若通过，生成token返回客户端
3. 客户端收到token后每次请求时携带该token（相当于一个令牌，表示我有权限访问）
4. 服务器接收token，验证该token的合法性，若通过验证，则通过请求，反之，返回请求失败。

## 如何验证Token是否合法

 由上文所知，token是我们根据Base64编码生成的，反之我们对其进行解析，解析失败即token不合法

# 实战

## 登陆接口的实现： 

```

const md5 = require('md5')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret.json')
const login = async (obj) => {
  try {
    if (!obj.name || !obj.password) {
      return  {
        err: '账号和密码不能为空',
        success: false
      }
    } else {
      const name = await db.user.findAll({where: {name: obj.name}})
      // 密码加密
      obj.password = md5(obj.password)
      // 判断用户是否存在
      if (name.length <= 0) {
        return {success: false, err: '当前用户不存在'}
      } else {
        let results = await db.user.findOne({where: obj})
        // 验证用户密码
        if (results) {
          // 写入token的信息
          const userToken = {
            name: results.name,
            id: results.id
          }
          // 签发Token 1小时后过期
          const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'}) 
          return  {
            success: true,
            token: token,
            data: results
          }
        } else {
          return  {
            success: false,
            err: '密码错误'
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
    return  {
      success: false,
      err: '登录失败,请联系管理员...'
    }
  }
}
module.exports = {
  login
}
```
我们在接口中生成token，将token返回客户端，客户端应在请求时携带此token，服务端根据token验证其身份。

在Koa中，我们可以通过中间件的方式来实现请求拦截。

## Token请求拦截中间件实现

```
const jwt = require('jsonwebtoken')
const secret = require('../config/secret.json')
const util = require('util')
const verify = util.promisify(jwt.verify)

module.exports = function () {
  return async function (ctx, next) {
    // 设置接口白名单，不进行token验证
    if (ctx.url === '/user/login') {
      await next()
    } else {
      try {
        let token = ctx.header.authorization  // 获取请求携带的token
        if (token) {
          let payload
          try {
            payload = await verify(token.split(' ')[1].replace(/\s/g,''), secret.sign)  // 解密payload，获取用户名和ID
            // 验证 合法性
            // if (payload.exp <= new Date()/1000) {
            //   console.log('过期了')
            // }
            await next()
          } catch (err) {
            ctx.body = {success: true, message: '登录密钥失效或过期，请重新登录', code: -1}
            console.log('token verify fail: ', err)
          }
        } else {
          ctx.body = {success: false, message: '验证失败', code: -1}
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}

```
最后将中间件进行引入使用
> 一定在router之前
```
app.use(token())
app.use(router.routes())

```