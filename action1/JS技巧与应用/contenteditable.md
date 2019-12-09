---
title: 截图造谣全靠【designMode || contenteditable || user-modify】
date: 2019-06-11 17:00:00
tags:
  - Html
categories: Html
---

> 首先，对于任何问题，都不要过于片面
> 其次，截图造谣成本在看完本篇以后，将再次降低。
> 最后，保持理智客观的脑袋瓜很重要。


<!--more-->

## 截图造谣全靠【designMode || contenteditable || user-modify】



> 首先，对于任何问题，都不要过于片面
> 其次，截图造谣成本在看完本篇以后，将再次降低。
> 最后，保持理智客观的脑袋瓜很重要。


### 一、效果图

下图是在2019-05-29日，随便在网页上不走心的修改后截到的一张图片。
也就是今天所说的`designMode` , `contenteditable` , `user-modify`的效果。


![image.png](https://upload-images.jianshu.io/upload_images/4128599-80bcaf0434f82969.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### 二、 isContentEditable

在介绍内容之前，先介绍一下`isContentEditable`属性，是一个只读属性，表示HTML标签元素是否可以编辑，
`true`为可编辑，`false`为不可编辑。
记住了它，这是伏笔。

### 三、designMode

> document.designMode 控制整个文档是否可编辑。有效值为 “on”和 “off”。根据规范，这个属性是默认为 “off”。火狐遵循这个标准。早期版本的 Chrome和 IE默认为 "inherit"。从Chrome 43开始，默认值为"off" ，并且不再支持“inherit”。在IE6-10中，该值大写。

[来源：MDN]([https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode)
)

```
const mode = document.designMode;
document.designMode = "on"; // 可编辑
document.designMode = "off"; // 不可编辑
```

非常简单的属性，但是有一些瑕疵：**`document`特有属性**
如果在`document`中应用该属性，那么所有`document`内的元素`isContentEditable`都将变成`true`


### 四、contenteditable

H5新添属性，支持所有HTML标签元素，
```
<p contenteditable="true"></p>
<p contenteditable="false"></p>
```
当改变`contenteditable`属性为`true`时，`isContentEditable`也变为`true`

自制富文本编辑器时可能会使用它。
既然是能够自制富文本编辑器，属性上应该更加强大，所以
```
contenteditable="" // 空值等于'true'
contenteditable="true" // 可编辑, 支持富文本编辑
contenteditable="false" // 不可编辑
contenteditable="plaintext-only" // 纯文本编辑
contenteditable="events" // 目前没有实装，也没查到明确说明，猜测是支持HTML元素标签书写
contenteditable="caret"// 目前没有实装，也没有查到明确说明，猜测是支持表情符号
```

以上全部都是它的属性值，
关于兼容性，`空值/true/false`支持所有IE8以上浏览器，`plaintext-only`只有谷歌浏览器支持。其余未实装。


### 五、user-modify
`user-modify`是CSS属性，理论上适用于所有元素，
```
user-modify: read-only;   // 只读
user-modify: read-write;  // 支持富文本编辑
user-modify: write-only;  // 目前没有实装，只写，能修改信息但不可见内容
user-modify: read-write-plaintext-only;  / /读写，只支持输入纯文本
```
还记得之前的`isContentEditable`属性吗，没错，全·都·是`false`
![image.png](https://upload-images.jianshu.io/upload_images/4128599-02b797b1d3daa7ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


**兼容性：目前只有谷歌支持，也就是要统一前缀`-webkit-`**

### 六、总结

![图1.png](https://upload-images.jianshu.io/upload_images/4128599-0ee40fd47aa8a6da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

PS：
1. 当然，如果不是针对谷歌浏览器，那能选择的只有`contenteditable`
2. 为什么没有`designMode `，什么网页大概都不会允许`document`内的所有东西都可编辑吧
