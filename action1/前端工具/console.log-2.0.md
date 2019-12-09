---
title: console.log可带劲啦(特殊字符编码图案)
date: 2019-05-10 17:00:00
tags:
  - JavaScript
categories: JavaScript
---



> 之前已经讲过关于如何调戏`console.log()`的问题了，但是我们想要看起来更“厉害”的。
> 本篇操作在第二节，不推荐跳过余下内容。
<!--more-->

### 一、 看起来更加"厉害"的console.log

![天猫.png](https://upload-images.jianshu.io/upload_images/4128599-a5b4445b61a24bc1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![途牛.png](https://upload-images.jianshu.io/upload_images/4128599-a7861794703126be.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![知乎.png](https://upload-images.jianshu.io/upload_images/4128599-080e9fbd132c8b90.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


看起来就是比单纯的打上汉字厉害一点的样子，当然也可能是程序猿特殊的中二原因。毕竟这类彩蛋只有打开控制台才能看到不是。
这东西，叫FIGlet


### 二、 做起来很“厉害”的console.log

将图片和文字转成特殊字符串，来源已久，久到1991年就有类似工具了，实现大概170行。
当然，现在我们只需要简单的操作一下工具就好。

1. 使用在线工具 [picascii](http://picascii.com/) 或 [img2txt](http://www.degraeve.com/img2txt.php)
2. 上传一张图片(不建议过大)，点击“生成”
3. 查看生成好的text或HTML代码(HTML可以是彩色哦)；
4. 复制出对应的TEXT，利用编辑器在每行最末尾添加`\n`，之后讲换行清楚，即变成一行字符串
5. 扔入console.log()中
6. 因为是字符串，可以配合`%c`使用。


上效果图：
![console效果.png](https://upload-images.jianshu.io/upload_images/4128599-3f67edf431e2fd08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![HTML利用<pre>.png](https://upload-images.jianshu.io/upload_images/4128599-844a8ff9e4e59d8d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### 三、对于非图片的字符串生成

先上工具： [patorjk](http://patorjk.com/software/taag)

![生成text.png](https://upload-images.jianshu.io/upload_images/4128599-2ddc30e6aecf5b25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![console效果.png](https://upload-images.jianshu.io/upload_images/4128599-83ddf7433cb1c431.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 四、 其他的工具
- VS编辑器
  `VSC Figlet`插件

- Node.js
  `figlet`包
```
npm install figlet
```
```
var figlet = require('figlet');
figlet('Hello World', function(err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data)
});
```
执行node，控制台就会显示出来

**PS：IE6/7不支持console且抛出错误**

以上
希望大家玩出更厉害的figlet

引用：
https://segmentfault.com/a/1190000011815578