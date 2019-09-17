---
title: Koa从零搭建之验证码实现
date: 2019-06-05 16:30:00
tags: 
  - Koa
  - Node
categories: 
  - Koa
---

验证码的本质属性——安全性，它除了能够防止恶意破解密码、刷票、论坛灌水、 刷页等行为外，还是用户与网站信息安全的有力保障。本文

<!--more-->

# 前言
目前我们所能接收到的验证码有
  - 短信/邮件 - 使用数/字符串随机组合，一般长度为4～6
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713365587.png)
  - 识别图片 - 字符串/运算
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713497772.png)
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713488331.png)
  - 滑块 - 拼图
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713061985.png)
  - 点选 - 点击目标文字/图片，顺序点击等
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713155140.png)
    - ![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559713235492.png)
    
# 准备

接下来我们使用Koa实现上述的集中验证码，在此之前我们需要安装一些插件

- svg-captcha - 实现图片识别类验证码
- gm - 实现滑动解锁
- GraphicsMagick - 图片处理
- ImageMagick - 图片处理
- nodemailer - 发送邮件

图片识别类的验证码有很多，比如
 - captchapng
 - ccap
 - trek-captcha

基础功能不尽相同，可以自行尝试。

由于本文需要与前端进行交互，还需要

  - koa2-cors 
  
来解决跨域。

# 实现

## 跨域
在开始写代码之前 我们当然要解决跨域的问题，在app.js中写入配置

```
const cors = require('koa2-cors')
app.use(cors({
  origin: function (ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

```
## 随机字符

随机字符，很简单，我们使用svg-captcha来随机生成字符及图片，将图片返回前端，服务端存取其对应值来进行验证即可。
直接上代码
```
const svgCaptcha = require('svg-captcha')

const getString = async () => {
  const cap = svgCaptcha.create({
    size: 4, // 验证码长度
    width:160,
    height:60,
    fontSize: 50,
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#eee' // 验证码图片背景颜色
  })
  let img = cap.data // 验证码
  var text = cap.text.toLowerCase() // 验证码字符，忽略大小写
  return {svg: `${img}<span >${text}</span>`}
}

```
我们会返回给客户端"svg"，直接渲染即可。

## 计算类

同样我们也使用svg-captcha来实现
```
const svgCaptcha = require('svg-captcha')
const getNumber = async () => {
  const cap = svgCaptcha.createMathExpr({
    size: 4, // 验证码长度
    width:160,
    height:60,
    fontSize: 50,
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#eee' // 验证码图片背景颜色
  })
  let img = cap.data // 验证码
  var text = cap.text.toLowerCase() // 验证码字符，忽略大小写
  return {svg: `${img}<span>${text}</span>`}
}
```
同上。
## 滑动
滑动模块实现较为复杂，但其逻辑还是很简单，我们先来梳理一下实现逻辑。

服务端：
1. 一张大图，其中拥有50*50px的缺块
2. 一张 50*50px的图来填补空缺
3. 大图空缺位置的坐标（随机生成）

服务端生成上述信息返回客户端(坐标值返回y)。

客户端：
1. 渲染大图
2. 初始化小图位置（y已知，left:0）
3. 滑动结束后像服务端发送x坐标进行验证

### 图片生成

```
const gm = require('gm').subClass({imageMagick: true});
var arrBuffer = []
const getSlide = async () => {
  arrBuffer = []
  const width = 420
  const height = 250
  const fragmentSize = 50
  try {
    // 生成图片
    const filePath = getRandomPath()
    const x = (Math.floor(Math.random() * 1000) % (width - 2 * fragmentSize)) + fragmentSize
    const y = Math.floor(Math.random() * 1000) % (height - fragmentSize)
    const { image, fragment } = await createImage(filePath, width, height, fragmentSize, x, y)
    // 缓存记录
    arrBuffer.push({x})
    console.log(arrBuffer)
    return { msg: "ok", data: { image, fragment, y } }
  } catch (err) {
    return {  msg: "服务器错误:" + err, data: null }
  }
}
function getRandomPath() {
  const fileLength = 4
  const index = Math.floor(Math.random() * 1000) % fileLength
  return path.resolve(__dirname, `../static/images/${index + 1}.jpg`)
}
function createImage(filePath, w, h, s, x, y) {
  return new Promise((resolve, reject) => {
    const res = { image: "", fragment: "" }
    gm(filePath)
    .resize(w, h, "!")
    .fill("rgba(0,0,0,.5)")
      //绘制由坐标对、宽度和高度指定的矩形。
      .drawRectangle(x, y, x + s - 1, y + s - 1)
      .noProfile()
      .setFormat('jpeg')
      .toBuffer( (err, buffer) => {
      if (err) {
        reject(err)
      }
      res.image = "data:image/jpg;base64," + buffer.toString("base64")
      gm(filePath)
      .resize(w, h, "!")
      .crop(s, s, x, y)
      .noProfile()
      .setFormat('jpeg')
      .toBuffer((err, buffer) => {
        if (err) {
          reject(err)
        }
        res.fragment = "data:image/jpg;base64," + buffer.toString("base64")
        resolve(res)
      })
    })
  })
}
```
这样我们就可以拿到，两张图片及其坐标。

- 大图

  - ![1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559715154835.png)
  
- 小图

  - <img itemprop="url image" style="width: 50px;height: 50px" src="http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559715289883.png">
  
前端根据两张图及y坐标就可以实现滑块的初始化

![1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559715632444.png)

滑动的过程相信大家都会写！在这不尽行详细描述。当我们监听到滑动结束后，将此时小图的 clienX值记录返回服务端，与服务端缓存的X坐标进行匹配。

那么我们来实现Check接口

```
const check = async (data) => {
  const {x} = data
  const isMatch = Math.abs(x - arrBuffer[0].x) < 5
  if (isMatch) {
    return {success: true, msg: '验证成功,已超过99.9%的用户'}
  } else {
    return {success: false, msg: '验证失败'}
  }
}
```
## 邮件
 
邮件验证码难点在于发送邮件。我们只需要将随机生成的字符串通过邮件发送至目标客户端即可，短信也是同样的道理。

我们来实现一个简单的邮件发送接口。

```
const nodemailer = require('nodemailer')
const smtpConfig = {
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: '',
    pass: ''
  }
}

const mail = async (data) => {
  var transporter = nodemailer.createTransport(smtpConfig);
  let mailOptions = {
    from: '',
    to: '',
    subject: '验证码',
    text: Math.random().toString(36).substr(2,4)
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log(info)
  })
  return {success: true}
}
```
