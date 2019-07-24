
---
title: URL编解码那些事
date: 2019-07-10 17:00:00
tags: JavaScript
categories: 开发技巧 
---
 

> 坐云独酌杯盘湿，穿竹微吟路径斜。

<!--more-->

### URL URN 还是URI？ 
### escape 和 unescape 又是什么？
### decodeURI encodeURIComponent 有什么区别？


## **URL URN 还是URI**

### **URI定义**
> URI（Uniform Resource Identifier，统一资源标识符）：一个资源的唯一标识。HTTP 请求的内容通称为"资源"。”资源“这一概念非常宽泛，它可以是一份文档，一张图片，或所有其他你能够想到的格式。每个资源都由一个 (URI) 来进行标识。

### **URL定义**
> URL（Uniform Resource Locator，统一资源定位器）：也被称作web地址，它是一种具体的URI，即URL可以用来标识一个资源，而且还指明了如何定位这个资源(网络位置)。通俗地说，URL是Internet上用来描述资源的字符串，主要用在各种www客户端和服务器程序。

### **URN定义**
> URN（Universal Resource Name， 统一资源名称）：URN是基于某命名空间通过名称指定资源的URI。人们可以通过URN来指出某个资源，而无需指出其位置和获得方式。资源无需是基于互联网的。


![URI](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/1379609-9429b4a099fe07d8.png)

URI可以分为URL,URN或同时具备locators 和names特性的一个东西。URN作用就好像一个人的名字，URL就像一个人的地址。换句话说：URN确定了东西的名称，URL提供了找到它的方式，而URI代表资源的唯一标识。

URL和URN都是URI的子集。

 * ftp://ftp.is.co.za/rfc/rfc1808.txt (also a URL because of the protocol)
 * http://www.ietf.org/rfc/rfc2396.txt (also a URL because of the protocol)
 * ldap://[2001:db8::7]/c=GB?objectClass?one (also a URL because of the protocol)
 * mailto:John.Doe@example.com (also a URL because of the protocol)
 * news:comp.infosystems.www.servers.unix (also a URL because of the protocol)
 * tel:+1-816-555-1212
 * telnet://192.0.2.16:80/ (also a URL because of the protocol)
 * urn:oasis:names:specification:docbook:dtd:xml:4.1.2

## **URL编解码**
>"只有字母和数字[0-9a-zA-Z]、一些特殊符号"$-_.+!*'(),"[不包括双引号]、以及某些保留字，才可以不经过编码直接用于URL。"

>如果URL中有汉字,就必须编码后使用,但是麻烦的是,RFC1738没有规定具体的编码方法,
而是交给应用程序(浏览器)自己决定,这导致'URL编码'成为了一个混乱的领域.。

接下来我们介绍一下URL编解码的几种方式。

### **escape 和 unescape**
>	该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。

古老的escape()不能直接用于URL编码，它的真正作用是返回一个字符的Unicode编码值。
它的具体规则是，除了ASCII字母、数字、标点符号"@ * _ + - . /"以外，对其他所有字符进行编码。在u0000到u00ff之间的符号被转成%xx的形式，其余符号被转成%uxxxx的形式。对应的解码函数是unescape()。

```javascript
escape("王总");   
escape("abc123");
escape("@*_+-./"); 
escape("http://www.bingshangroup.com?name=王总&slogen=属实"); 

// %u738B%u603B
// abc123
// @*_+-./
// http%3A//www.bingshangroup.com%3Fname%3D%u738B%u603B%26slogen%3D%u5C5E%u5B9E
```

### **encodeURI 和 decodeURI**

> 它着眼于对整个URL进行编码，因此除了常见的符号以外，对其他一些在网址中有特殊含义的符号也不进行编码。编码后，它输出符号的utf-8形式，并且在每个字节前加上%。

> 它对应的解码函数是decodeURI()。

encodeURI 会替换所有的字符，但不包括以下字符，即使它们具有适当的UTF-8转义序列：

|类型  | 包含  | 
|:------------- |:---------------:| 
| 保留字符        | `; , / ? : @ & = + $` | 
| 非转义的字符      | 字母 数字 `- _ . ! ~ * ' ( )` | 
| 数字符号 | `# `  | 

```javascript
encodeURI('http://www.bingshangroup.com?name=王总&slogen=属实');
encodeURI('http://www.bingshangroup.com?group=wangzong&mayi=web');

// http://www.bingshangroup.com?name=%E7%8E%8B%E6%80%BB&slogen=%E5%B1%9E%E5%AE%9E
// http://www.bingshangroup.com?group=wangzong&mayi=web
```
**`&` `=` 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符,导致了请求参数获取的错误**

### **encodeURIComponent 和 decodeURIComponent**

>与encodeURI()的区别是，它用于对URL的组成部分进行个别编码，而不用于对整个URL进行编码。
>它对应的解码函数是decodeURIComponent()。

encodeURIComponent 转义除了字母 数字 `(`  `)`  `.`  `!`  `~`  `*`  `'` `-` 和`_`之外的所有字符。

```javascript
encodeURIComponent('http://www.bingshangroup.com?name=王总&slogen=属实');
encodeURIComponent('http://www.bingshangroup.com?group=wangzong&mayi=web');

// http%3A%2F%2Fwww.bingshangroup.com%3Fname%3D%E7%8E%8B%E6%80%BB%26slogen%3D%E5%B1%9E%E5%AE%9E
// http%3A%2F%2Fwww.bingshangroup.com%3Fgroup%3Dwangzong%26mayi%3Dweb
```

## 讲点其他

### **RFC 3986**
为了更严格的遵循 RFC 3986（保留 `!`  `'`  `(` `)` 和 `*`），即使这些字符并没有正式划定 URI 的用途，下面这种方式是比较安全的：

```javascript
function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
```
`[`和	`]`保留给了IPV6

```javascript
function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
```

如何把对象转换成查询字符串

```javascript
var objectToQueryString = (obj) => Object.keys(obj).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
objectToQueryString({name:王总, slogen:属实})
```
又或者你可以这样玩(想一下原理是什么)

```javascript
class FormData {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    
    toString() {
        return encodeURIComponent(this.key) + '=' + encodeURIComponent(this.value);
    }
}

let items = [
    new FormData('王总', '属实'),
    new FormData('mayi', 'yahei')
];

console.log(items.join('&'));
```
