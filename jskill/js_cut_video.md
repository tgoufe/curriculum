---
title: JS截取视频第一帧
date: 2019-07-24 17:00:00
tags: 
  - JavaScript
categories: JavaScript
---


> 截取video视频第一帧
<!--more-->





## JS截取视频第一帧

> 接上篇 [js图片/视频预览 - URL.createObjectURL()](https://www.jianshu.com/p/69c57e60c525)

当视频能够预览并上传后，非要来一张视频第一帧的截图贴上，第一帧是黑的怎么办，下一帧。


### 一、文件上传
使用`<input type="file">`上传，`change`事件作为预览`video`的`src`的触发条件
新鲜源码：
```
<video controls width="700" height="300" src="" id="video"></video>
<input type="file" id="input" hidden />
<button id="fileBtn">点击上传视频</button>
```

### 二、canvas截取图片
关于截取或者处理图片/视频/富文本编辑器，`canvas`是一个非常nice的选择。

1. 创建画布`canvas`或在`html`中直接写入。
```
var canvas = document.createElement('canvas');
```

2. 创建基于`canvas`的绘图环境
```
var ctx = canvas.getContext('2d');
```
*附 Q&A:*
- 什么是绘图环境？

网络上的常规理解是“在准备画布后，需要一些‘染料、画笔、绘图工具’的准备工作。”
比较官方的说话是返回`canvas`的上下文环境，
说人话是'你能够更好的操作你的`canvas`'。

- 关于`getContext('2d')`的参数

方法中的`2d`参数目前可以理解为是`固定参数`，表示想要一个`二维`绘制环境。虽然大家都认为有`2d`自然应该有`3d`，然而实际上本身设计时也是这么考虑的，不过大家有点等不起了，所以都去选择`webGL`了。
`webGL`是啥？浏览器端借助系统显卡进行 3D 绘图。这是另一个故事了（`IE`别想了）。

- 关于`canvas.getContext('2d')`的返回值

返回一个`CanvasRenderingContext2D`对象，也就是上文所说的能够支持绝大多数对画布的操作。

3. 在`canvas`上绘制图片
```
    // ctx.drawImage(file,sx,sy,swidth,sheight,x,y,width,height);
    ctx.drawImage(this, 0, 0, swidth, sheight);
```
在不需要剪裁的情况下，使用上述参数即截取操作`file`的全部，绘制到`canvas`上

关于参数([w3school](http://www.w3school.com.cn/html5/canvas_drawimage.asp))
|参数 | 描述 |
| :-------: |:-------------:|
|file|规定要使用的图像、画布或视频。
|sx	|可选。开始剪切的 x 坐标位置。
|sy	|可选。开始剪切的 y 坐标位置。
|swidth	|可选。被剪切图像的宽度。
|sheight	|可选。被剪切图像的高度。
|x	|在画布上放置图像的 x 坐标位置。
|y	|在画布上放置图像的 y 坐标位置。
|width	|可选。要使用的图像的宽度。（伸展或缩小图像）
|height	|可选。要使用的图像的高度。（伸展或缩小图像）

4. 将`canvas`导出成图片放入`src`
```
var src = canvas.toDataURL('image/jpeg');
```
关于`toDataURL()`方法。将`canvas`的内容导出
```
canvas.toDataURL(type, encoderOptions);
```
`type`: 图片格式，默认`image/jpeg`，
`encoderOptions`：图片质量，取值范围为0到1，默认0.92。
`返回值`：包含 `data URI` 的`DOMString`，也就是`base64`格式。


### 三、截取视频第一帧
上传文件OK，用`canvas`截取OK，怎么找`第一帧`呢？（啥时候开始截取呢？）

当然是多媒体的事件来触发。
关于`video`的事件非常多（[全部事件](http://www.w3school.com.cn/tags/html_ref_eventattributes.asp)），这里只讨论能够影响到截取到第一帧的各个事件。

```
    video.addEventListener('loadeddata', consoleString.bind(video, 'loadeddata')) // 当前帧加载完毕
    video.addEventListener('loadedmetadata', consoleString.bind(video, 'loadedmetadata')) // 视频元数据加载完毕
    video.addEventListener('canplay', consoleString.bind(video, 'canplay')) // 视频缓冲能够开始播放
    video.addEventListener('timeupdate', consoleString.bind(video, 'timeupdate')) // 播放位置发生改变时
    video.addEventListener('play', consoleString.bind(video, 'play')) // 开始播放时
    video.addEventListener('waiting', consoleString.bind(video, 'waiting')) // 要播放下一帧而需要缓冲时
    
    function consoleString(string) {
        console.log(string)
    }
```

```
// 执行结果
// timeupdate 
// loadedmetadata 
// loadeddata 
// canplay 
// play（开始播放）
// 没有waiting, 因为视频较小不需要缓冲
```
- 根据顺序，第一个被触发的竟然是`timeupdate`事件，按设想来说，最先执行的应该是`loadedmetadata`，元数据加载完毕。
关于这一点，在MDN上没有明确的说明，但是可以推理一下：

> 当`currentTime`更新时会触发`timeupdate`事件

来源：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/timeupdate_event)

`loadedmetadata`的元数据恰好是指`时长、尺寸（仅视频）以及文本轨道`，也就是说在`video`未定义的时候`currentTime`是`NaN`或`NULL`，当元数据中时长加载完毕后，`currentTime`更新至`0`，因此触发。

结论：虽然最先触发，但是此时视频文件尚未加载，截取的是`canvas`的无内容本身。
**注：`timeupdate`事件根据使用的系统不同，每秒触发4-66次，且由于触发频率高，单位过小(毫秒级别)，事件响应需要延迟等原因，无法完全精准的控制。**


- loadedmetadata 
上文提到，元数据加载完毕之后即触发，但数据中并不包括视频文件本身。
结论：如果视频文件较大，加载时间较长，仍然无法截取到已加载的第一帧。
补充：通过`URL.createObjectURL()`方法能够基本做到无察觉，但并不保险。

- loadeddata 
当前帧数（第一帧）加载完毕触发，没毛病。
结论：可用。
补充：万一第一帧是黑屏想用下一帧怎么办，对不起，余下帧数加没加载完不在它的考虑范围之类，这个事件不管。

- canplay
视频能够开始播放时触发，也就是根据上传的视频帧数决定加载多少帧(24/25/30/60等等)后满足播放画面后触发。
总结：因为加载相对于`loadeddata`的事件来说更多(多一丢丢)，总体可行。
补充：通过控制`currentTime`可以满足(但不可能是第二帧那么准确)，可以看做“当前播放帧”。

- play
开始播放时才会触发，和上传快速截取的需求不是很符合。

- waiting
已播放但下一画面没缓冲好时触发，适合插播小广告。


文件、方法、事件都OK了。截就完事儿了。

```
    video.addEventListener('loadeddata', function (e) {
	        canvas.width = this.videoWidth
	        canvas.height = this.videoHeight
	        width = this.videoWidth
	        height = this.videoHeight
	        ctx.drawImage(this, 0, 0, width, height);
	        var src = canvas.toDataURL('image/jpeg');
	        img.src = src;      
	        // var currentTime = this.currentTime
	        // duration = this.duration
	        // var fps = duration / 30
		
    })
```


[效果](https://243341386.github.io/review_dome/)

