---
title: 正则火星文第一集(导读课)
date: 2019-09-25 17:00:00
tags: JavaScript
categories: 正则表达式
---
# 正则火星文第一集(导读课)

>正则表达式相信大多数开发者并不陌生，很多开发语言都提供了对正则表达式的支持。JavaScript也不例外。
但是对于前端开发者而言正则表达式是见得多用得少，现用现查，还停留在一个很初级的阶段。一句话总结来说：很强大、很好用、但是我记不住。

本系列文章的**目的**就是争取让每一个系统看完系列文章的前端开发者，都能彻底弄懂JavaScript中的正则表达式，让它不再是你日常开发和面试中的短板。

<!--more-->
## 什么是正则表达式
**首先我们还是再简单介绍一下什么是正则表达式（非初学者请直接略过）**

正则表达式（Regular Expression），常简写为regex、regexp或RE。描述是：使用单个字符串来描述、匹配一系列符合某个句法规则的字符串（wiki），简单来说就是使用某种规则去匹配符合预期结果的字符串。这里面的规则就是我们所说的字符串。

比如下面这个例子：`/^[a-z0-9]+$/i`  就是用来匹配只能以英文和数字组成的字符串。

## RegExp对象
接下来来介绍一下RegExp对象，在JavaScript中使用RegExp对象来支持正则表达式。

### 实例化
实例化RegExp对象有2种方式
#### 1.字面量
使用一个正则表达式字面量，以斜杠表示开始和结束。

```javascript
var regex = /^[a-z0-9]+$/;
```

#### 2.构造函数
调用RegExp对象的构造函数

```javascript
var regex = new RegExp('^[a-z0-9]+$');
```
对应的语法是这样`new RegExp(pattern, attributes);`
其中第二个参数是可选参数，用来表示修饰符（后面介绍）。

```javascript
var regex = new RegExp('^[a-z0-9]+$','i');
等价于
var regex = /^[a-z0-9]+$/i;
```
上面两种实例化的方法是等价的，都新建了一个内容为`/^[a-z0-9]+$/i`的正则表达式对象。它们的主要区别是，第一种方法在引擎编译代码时，就会新建正则表达式对象，而第二种方法则会在运行时新建正则表达式对象，在正则表达式不发生变化时前者的效率较高，同时也更加直观。


### 对象属性
* RegExp.prototype.ignoreCase：返回一个布尔值，表示是否设置了i修饰符。

* RegExp.prototype.global：返回一个布尔值，表示是否设置了g修饰符。

* RegExp.prototype.multiline：返回一个布尔值，表示是否设置了m修饰符。

| 属性           |          修饰符  |            描述|
|:------------- |:---------------:| :-------------:|
| ignoreCase      |i |       执行对大小写不敏感的匹配|
| global      | g        | 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止） |
| multiline | m       |    执行多行匹配|

以上三个属性都是与修饰符相关的，且都是只读的。

* RegExp.prototype.lastIndex：返回一个数值，表示下一次开始匹配的位置。该属性可读写，一般在连续搜索时使用
* （后面会详细介绍）。
* RegExp.prototype.source：返回正则表达式的字符串形式（不包括开始和结束的斜杠），只读属性。

### 对象方法
#### compile()方法
compile() 方法被用于在脚本执行过程中（重新）编译正则表达式。与RegExp构造函数基本一样。
此方法已被废弃。

#### test()方法
test()方法返回一个布尔值，用来查看正则表达式与指定的字符串是否匹配。

当你想判断一个字符串中是否包括另外一个字符串时候，就可以使用 test()（类似于 String.prototype.search() 方法），差别在于test（）返回一个布尔值，而 search（）返回索引或者-1（不包含）

```javascript
let str = 'hello world!';
let result = /^hello/.test(str);
console.log(result); //true

//如果正则表达式是一个空字符串，则匹配所有字符串。
let str = 'hello world!';
let result = new RegExp('').test(str);
console.log(result); //true

//如果正则表达式带有g修饰符，则每一次test()方法都从上一次结束的位置开始向后匹配。
//lastIndex属性不仅可读，还可写，可以手动指定匹配位置。
var r = /o/g;
var s = 'hello world!';

console.log(r.lastIndex) //0
console.log(r.test(s)) 

console.log(r.lastIndex) //5
console.log(r.test(s)) 

console.log(r.lastIndex) //8
console.log(r.test(s)) 
```

#### exec()方法
exec()用来返回匹配结果。如果发现匹配，就返回一个数组，数组成员是匹配成功的子字符串，否则返回null。

```javascript
var s = 'hello world!';
var r1 = /l/;
var r2 = /yyyyyy/;

console.log(r1.exec(s)) //["l"]
console.log(r2.exec(s)) //null

//如果正则表示式包含圆括号（即含有“组匹配”），则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。（关于分组捕获会在后面的文章中讲到）
var r = /^(\d{3})-(\d{3,8})$/;
var s = '010-12345';
console.log(r.exec(s)); // ['010-12345', '010', '12345']

//如果正则表达式带有g修饰符，则每一次exec()方法都从上一次匹配成功结束的位置开始向后匹配。
```
在使用exec()这个方法时候，我们会发现返回数组还包含以下两个属性：
![exec](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/QQ20190925-165412.png)

| 属性 / 索引          |描述|
|:------------- | :-------------|
| [0]      |      	匹配的全部字符串|
| groups([1]……)     | 括号中的分组捕获 |
| index  |    匹配到的字符位于原始字符串的基于0的索引值|
| input  |    	原始字符串|




## 支持正则表达式的 String 对象的方法
在JavaScript中的字符串的实例方法之中，有4种与正则表达式有关：

### match()
>在字符串中执行查找匹配的String方法，返回一个数组，在未匹配到时会返回 null。

```javascript
var s = 'hello world!';
var r = /o/g;

console.log(s.match(r)) // ["o", "o"]
console.log(r.exec(s)) // ["o"]
//可以看到如果带有g修饰符，match()与正则对象的exec方法行为不同，会一次性返回所有匹配成功的结果。
//该方法会忽略 RegExp.lastIndex 设置的值,从起始位置检索
```

### matchAll()
>在字符串中执行查找所有匹配的String方法，返回一个迭代器（iterator）。

```javascript
//在 matchAll 出现之前，通过在循环中调用regexp.exec来获取所有匹配项信息（regexp需使用/g)
const regexp = RegExp('foo*','g'); 
const str = 'table football, foosball';
let matches = str.matchAll(regexp);

console.log(matches)
```

### search()
>在字符串中测试匹配的String方法，返回匹配到的位置索引，或者在失败时返回-1。

```javascript
'hello world!'.search(/o/)
//返回第一个满足条件的匹配结果在整个字符串中的位置，test()返回布尔值。
//该方法会忽略 RegExp.lastIndex 设置的值,从起始位置检索
```

### replace()
>在字符串中执行查找匹配的String方法，并且使用替换字符串替换掉匹配到的子字符串。
str.replace(search, replacement)
接受两个参数，第一个是正则表达式，第二个是替换的内容。

```javascript
//正则表达式如果不加g修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值。
console.log('hello world!'. replace(/o/,'a'))
console.log('hello world!'. replace(/o/g,'a'))

//replace()方法中的第二个参数中可以含有变量符号”$”,格式为 $ + n , n 从1开始计。其代表正则表达式的匹配被记住的第n个匹配字符串（即小括号的作用）
console.log('hello world!'.replace(/(\w+)\s(\w+)/, '$2 $1'))
```

### split()
>按照给定规则进行字符串分割的String方法，返回一个数组，包含分割后的各个成员。

str.split(separator, [limit])
该方法接受两个参数，第一个参数是正则表达式，表示分隔规则，第二个参数是返回数组的最大成员数。

```javascript
//该方法忽略附加参数g，即无论是全局匹配还是非全局匹配都不会影响返回结果。
//该方法也会忽略 RegExp.lastIndex 设置的值,从起始位置检索
console.log('hello world!'. split(/ /))
```

*以上match(),matchAll(),search(),split(),replace()这些StringObj对象的方法，不会改变StringObj本身的值，而是将结果作为返回值返回。
并且这些方法中的RegExp参数，也可以用字符串参数替换。其返回结果，除了replace()方法，其他的返回结果还是和RegExp参数时的返回结果一样。*


**在下一期中会给大家结合图形化的方式介绍JavaScript中正则表达式匹配规则的相关内容。敬请期待！如果你有什么好的建议欢迎留言给我们。**
