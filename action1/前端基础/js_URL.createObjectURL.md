---
title: js图片/视频预览  - URL.createObjectURL()
date: 2019-07-09 11:00:00
tags: 
  - JavaScript
categories: JavaScript
---


> 很多业务场景需要搞定图片/视频上传，同时又要求能够快速预览效果，避免图片或视频稍大或请求响应较慢，使用`createObjectURL()`本地预览实用性更加。
<!--more-->



# js图片/视频预览  - URL.createObjectURL()



> 很多业务场景需要搞定图片/视频上传，同时又要求能够快速预览效果，避免图片或视频稍大或请求响应较慢，使用`createObjectURL()`本地预览实用性更加。

### 一、什么是URL.createObjectURL()

> **`URL.createObjectURL()`** 静态方法会创建一个 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString "DOMString 是一个UTF-16字符串。由于JavaScript已经使用了这样的字符串，所以DOMString 直接映射到 一个String。")，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 `document` 绑定。这个新的URL 对象表示指定的 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File "文件（File）接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容。") 对象或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob "Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。") 对象。

[来源: MDN]([https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)
)

简单的理解一下就是将一个`file`或`Blob`类型的对象转为`UTF-16`的字符串，并保存在当前操作的`document`下。

*扩展1：*
*`UTF-8`与`UTF-16`与`GBK`到底有啥区别，
都是* **可变长度的编码方式**
*通过对`Unicode`码值进行对应规则转换后，编码保持到内存/文件中*

细说起来就是另一个故事了，不要在意细节。

### 二、URL.createObjectURL()有什么用

当然是本篇主题的预览功能了。

等等。预览用`FileReader.readAsDataURL(file)`转`base64`搞定啊。

好的，下一话题。

### 三、URL.createObjectURL()与FileReader.readAsDataURL()

如果你会用`FileReader.readAsDataURL(file)`方法，那可以往下读类比一下两者优劣。

1. 返回值
    - `FileReader.readAsDataURL(file)`可以得到一段`base64`的字符串。
    - `URL.createObjectURL(file)`可以得到当前文件的一个`内存URL`。

2. 内存使用
    - `FileReader.readAsDataURL(file)`的返回值是转化后的超长`base64`字符串(长度与要解析的文件大小正相关)。
    - `URL.createObjectURL(file)`的返回值虽然是字符串，但是是一个`url`地址。

3. 内存清理
    - `FileReader.readAsDataURL(file)`依照JS垃圾回收机制自动从内存中清理。
    - `URL.createObjectURL(file)`存在于当前`doucment`内，清除方式只有`unload()`事件或`revokeObjectURL()`手动清除 。

4. 执行机制
     - `FileReader.readAsDataURL(file)`通过回调的形式返回，异步执行。
     - `URL.createObjectURL(file)`直接返回，同步执行。

5. 兼容性
      - 兼容性兼容`IE10`以上，其他浏览器均支持。

6. 其他
    - `FileReader.readAsDataURL(file)`当多个文件同时处理时，需要每一个文件对应一个新的`FileReader`对象。
      ![FileReader_error.png](https://upload-images.jianshu.io/upload_images/4128599-c72251bb2a3fb499.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    - `URL.createObjectURL(file)`依次返回无影响。

--------------------------

#### 总体来说
`URL.createObjectURL(file)`得到本地内存容器的`URL`地址，方便预览，多次使用需要注意手动释放内存的问题，性能优秀。
`FileReader.readAsDataURL(file)`胜在直接转为`base64`格式，可以直接用于业务，无需二次转换格式。


关于使用`canvas`截取视频第一帧的问题，下篇再来。

--------------------------

*附1：Base64 to Blob*
```
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
```