---
title: 如何优雅地取数值的整数和小数部分
date: 2019-09-05 11:00:00
tags: JavaScript
categories: 开发技巧
---
在处理数值的时候，获取浮点数的整数和小数部分，是一种常见的操作，在JavaScript中有许多方法可以达到目的，但也正因为方法众多，
所以哪种方法更好，也值得我们仔细研究一番。
<!--more-->

在处理数值的时候，获取浮点数的整数和小数部分，是一种常见的操作，在JavaScript中有许多方法可以达到目的，但也正因为方法众多，
所以哪种方法更好，也值得我们仔细研究一番。

一、取整数
parseInt比较常用来取整数部分，在一些项目中经常能看到：

````javascript
let num = 3.75;
console.log(parseInt(num)); // 3
num = -3.75;
console.log(parseInt(num)); // -3
````
用parseInt取整数，结果是没问题的，但是如果严格来说，其实parseInt并不是设计用来取整数的。

![parseInt函数](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1567669850212.png)
parseInt(string, radix) 这个方法是一个将字符串转换为整数的方法，它有两个参数，第一个参数表示要转换的字符串，如果参数不是一个字符串，则将其转换为字符串。第二个参数是基数即进制，默认为10。
所以实际上parseInt(3.75)这个代码，会先将3.75转为字符串"3.75"，然后再将它parseInt成为3。

所以用parseInt方法取整数，有两个不好的地方，一是parseInt这个函数名，看起来就是将字符串转整数的，用在这里不是很适合，另一个是转字符串有点多此一举，而且肯定会带来性能开销，所以使用parseInt虽然方便，但不是最好的办法。

我们会想到用Math的方法来取整，相关的有3个方法，分别是Math.ceil、Math.round和Math.floor。

其中Math.round是四舍五入的，Math.ceil是向上取整，Math.floor是向下取整。

要达到parseInt的结果，我们需要判断数值的符号，如果是负数，要使用Math.ceil，如果是正数，则使用Math.floor：
````javascript

function trunc(num) {
if(num >= 0) return Math.floor(num);
return Math.ceil(num);
}

console.log(trunc(3.75)); // 3

console.log(trunc(-3.75)); // -3
````

使用Math.round和Math.ceil实现trunc方法，要比使用parseInt的性能好，因为省去了转字符串。我们可以用jsperf测一下：
结果如下图:

![快](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1567670944681.png)

实际上，在ES2015之后，提供了原生的Math.trunc，我们可以更方便地使用Math.trunc，不用自己使用Math.floor和Math.ceil去实现了：
````javascript

console.log(Math.trunc(3.75)); // 3
console.log(Math.trunc(-3.75)); // -3

````
我在网上看见有人使用位运算符（按位或）来进行取整 

````javascript
let num = 3.75;
console.log(num | 0); // 3
num = -num;
console.log(num | 0); // -3
````

于是我查找了一下文档，具体可以看ECMA-262
![位运算](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1567671561732.png)


对位操作的处理中，第7、9步，会把操作数转为Int32，所以我们就可以利用这个特点来使用“|”操作符了。

不过bitwise操作将操作数转为Int32，所以它不能处理超过32位的数值取整，而JavaScript有效整数的范围是53位。
````javascript
const num = 17179869184.89;

console.log(num | 0); // 0

console.log(Math.trunc(num)); // 17179869184
````

那么用“|”有什么好处呢？如果考虑js文件大小，那么a|0与其他方式比较，是最短的方式，所以如果要考虑压缩代码的大小，且明确知道数值范围不会超过32位整数的时候，可以考虑使用这个技巧。

二、取小数
取了整数部分，接下来取小数部分就很简单了：
````javascript
function fract(num) {

return num - Math.trunc(num);

}

console.log(fract(3.75)); // 0.75

console.log(fract(-3.75)); // -0.75
````
上面的代码思路就是先用Math.trunc(num)取整，然后再与原数相减，就得到了小数部分。

但是，我们还有更加简单的办法：
JavaScript的取模运算%并不限于整数运算，可以对浮点数取模。
所以，直接将原数对1取模，即可获得小数部分！
````javascript
console.log(3.75 % 1); // 0.75

console.log(-3.75 % 1); // -0.75
````
这是最简单的取小数的方式，然后反过来，还可以倒推出另一种实现trunc取整的方式：
````javascript
function trunc(num) {

return num - num % 1;

}
````
