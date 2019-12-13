---
title: Koa从零搭建之文件上传
date: 2019-06-24 16:30:00
tags: 
  - Koa
  - Node
categories: 
  - Koa
---
 
 在日常开发过程中，有很多需求涉及到图片/文件上传，那么用Koa如何实现？
 
<!--more-->

# 前言

之前的课程讲过，Koa框架是一个基于中间件的框架，我们所需要的一些功能都需要安装相对应的中间件库。
而要实现文件上传，有很多插件：
1. koa-body 
2. koa-bodyparser
3. busboy
4. koa-multer
5. ...

这里推荐使用koa-body！我们来仔细研究一下它！

# koa-body

之前使用 koa2 的时候，处理 post 请求使用的是 koa-bodyparser，同时如果是图片上传使用的是 koa-multer。
这两者的组合没什么问题，不过 koa-multer 和 koa-route（注意不是 koa-router） 存在不兼容的问题。

koa-body结合了二者，所以koa-body可以对其进行代替。

## koa-body的基本使用
 
在 koa2 中使用 koa-body,我使用的是全局引入，而不是路由级别的引入，因为考虑到很多地方都有 post 请求或者是文件上传请求，没必要只在路由级别引入。

### 依赖安装

```
npm i koa-body -D
```

### app.js

```
const koaBody = require('koa-body');
const app = new koa();
app.use(koaBody({
  multipart:true, // 支持文件上传
  encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));

```

### 有用的参数

[npm/koa-body](https://www.npmjs.com/package/koa-body)

### 获取文件上传后的信息

```
router.post('/',async (ctx)=>{
  console.log(ctx.request.files);
  console.log(ctx.request.body);
  ctx.body = JSON.stringify(ctx.request.files);
});
```

### 结果

- size - 文件大小
- path - 文件上传后的目录
- name - 文件的原始名称
- type - 文件类型
- lastModifiedDate - 上次更新时间

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561363732768.png)

# 有钱人的选择

为什么起这个标题呢，因为现在很多企业级的项目都不会选择将一些图片文件存储在自己的服务器中，为什么？
1. 占用空间，浪费资源
2. 访问速度慢
3. 安全性低
4. 有待补充...

通常都会选择阿里云，腾讯云，七牛云等对象存储OSS功能。

通常每个平台都会提供自己的SDK，并配套各种示例，方便省心。不适合我们学习。

举个简单的例子

```
var OSS = require('ali-oss')

// 创建客户端
var client = new OSS({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: ''
})
const uploadSDK = async (obj) => {
    var fileName = obj.files.file.name
    var localFile = obj.files.file.path
    try {
      var result = await client.put(fileName, localFile)
      console.log(result.url)
    }
    catch (e) {
      console.log(e)
    }
    return result.url
}
```

其他功能如图

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561364208152.png
)

# koa实现图片上传
- fs - 文件系统
- path - 路径

## 单文件上传

```
var fs = require('fs')
var path = require('path')

const uploadStatic = async (obj) => {
  // 上传单个文件
  const file = obj.files.file
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../static/upload/') + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return "上传成功！";
}

```

## 多文件上传

```
var fs = require('fs')
var path = require('path')

const uploadStatics = async (obj) => {
  // 上传多个个文件
  const files = obj.files.file
  for (let file of files) {
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../static/upload/') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  return "上传成功！";
}

```

# 扩展

## 大文件上传及上传进度获取

涉及到大文件上传，我们就不能采用上面的方法，为什么？因为通常大文件上传耗时很长，刷新/网速差等操作很容易导致文件上传失败，那么如何去避免？

> 分片与并发结合，将一个大文件分割成多块，并发上传，极大地提高大文件的上传速度。
  当网络问题导致传输错误时，只需要重传出错分片，而不是整个文件。另外分片传输能够更加实时的跟踪上传进度。

以vue项目为例

### 基于webuploader封装Vue组件

> webuploader: 一个简单的以H5为主，FLASH为辅的现代文件上传组件


```

<vue-upload
        ref="uploader"
        url="xxxxxx"
        uploadButton="#filePicker"
        multiple
        @fileChange="fileChange"
        @progress="onProgress"
        @success="onSuccess"
></vue-upload>

```

### 分片的原理及流程

当我们上传大文件时，会被插件进行分片，ajax会有多个

1. 多个upload请求均为分片的请求，把大文件分成多个小份一次一次向服务器传递
2. 分片完成后，即upload完成后，需要向服务器传递一个merge请求，让服务器将多个分片文件合成一个文件


原理： 

- 第一步:先对文件进行MD5的加密, 这样有两个好处, 即可以对文件进行唯一的标识, 为秒传做准备, 也可以为后台进行文件完整性的校验进行比对

- 第二步:拿到MD5值以后, 要查询一下, 这个文件是否已经上传过了, 如果上传过了, 就不用再次重复上传, 也就是能够秒传, 网盘里的秒传, 原理也是一样的

- 第三步:对文件进行切片, 假如文件是500M, 一个切片大小我们定义为50M, 那么整个文件就为分为100次上传

- 第四步:向后台请求一个接口, 接口里面的数据是该文件已经上传过的文件块, 为什么要有这个请求呢? 我们经常用网盘, 网盘里面有续传的功能, 一个文件传到一半, 由于各种原因, 不想再传了, 那么再次上传的时候, 服务器应该保留我之前上传过的文件块, 跳过这些已经上传过的块, 再次上传其他文件块, 当然续传方案有很多, 目前来看, 单独发一次请求, 这样效率最高

- 第五步:开始对未上传过的块进行POST上传

- 第六步:当上传成功后, 通知服务器进行文件的合并, 至此, 上传完成!

### 分片

我们来看看upload发送的具体参数：

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561365064412.png)


> 第一个配置(content-disposition)中的guid和第二个配置中的access_token，是我们通过webuploader配置里的formData，即传递给服务器的参数
  后面几个配置是文件内容，id、name、type、size等
  其中chunks为总分片数，chunk为当前第几个分片。图片中分别为12和9。当你看到chunk是11的upload请求时，代表这是最后一个upload请求了。

### 其他
