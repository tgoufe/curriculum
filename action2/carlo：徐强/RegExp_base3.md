# 正则火星文第二集(基础篇3——断言)

hi 正则火星文新一期又来了~

## 断言

### 是否支持后行断言
在以往的三篇的教程中，细心的同学一定发现了我们缺少了JavaScript正则表达式中的一点：断言。

~~需要说明的是，JavaScript不同于一些其他语言，只支持先行断言，并不支持后行断言。~~

**这段话本来是上一期基础篇2的一段文字，也是网上各种资料、教程普遍的说法，大多数给出的理由是出于性能的原因。然后我却在最后一刻将这一整段删除了，原因是我真的很认真的去查了资料：**

[tc39/proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md)

[ECMAScript® 2020 Language Specification](https://tc39.es/ecma262/#sec-patterns)


**它是一个stage 4的提案，且已经部分支持了**

![can I use](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/lookbehind.png
)

### 断言介绍
如同我们前面介绍的`^` `$` `\b` `\B` 这些匹配位置的元字符，断言也是针对位置进行匹配。 

在匹配过程中，不占用字符，所以被称为“零宽”。所谓位置，是指字符串中(每行)第一个字符的左边、最后一个字符的右边以及相邻字符的中间（方向：后 -> 先）。 

### 零宽正向先行断言(zero-width positive lookahead assertion) 

**(?=pattern)**

要求接下来的字符都要与pattern匹配，但不能包含匹配pattern的那些字符。
例如对”regular expression”这个字符串，要想匹配regular中的re，但不能匹配expression中的re，可以用”re(?=gular)”，该表达式限定了re右边的位置，这个位置之后是gular，但gular并不会计入返回结果。

```JavaScript
var pattern =  /re(?=gular)/; 
'regular expression'.replace(pattern,'!');
```

### 零宽负向先行断言(zero-width positive lookahead assertion) 

**(?!pattern)**
要求接下来的字符不与pattern匹配。

例如对”regex represents regular expression”这个字符串，要想匹配除regex和regular之外的re，可以用”re(?!g)”，该表达式限定了re右边的位置，这个位置后面不是字符g。

负向和正向的区别，就在于该位置之后的字符能否匹配括号中的表达式。

```JavaScript
var pattern =  /re(?!g)/g; 
'regex represents regular expression'.replace(pattern,'!');
```


### (?<=pattern) 零宽正向后行断言(zero-width positive lookbehind assertion) 

**(?<=pattern)**
要求该位置之前字符都要与pattern匹配。

例如对”regex represents regular expression”这个字符串，有4个单词，要想匹配单词内部的re，但不匹配单词开头的re，可以用”(?<=\w)re”，单词内部的re，在re前面应该是一个单词字符。之所以叫后行断言，是因为正则表达式引擎在匹配字符串和表达式时，是从前向后逐个扫描字符串中的字符，并判断是否与表达式符合，当在表达式中遇到该断言时，正则表达式引擎需要往字符串前端检测已扫描过的字符，相对于扫描方向是向后的。

```JavaScript
var pattern =  /(?<=\w)re/g; 
'regex represents regular expression'.replace(pattern,'!');
```

### (?<!pattern) 零宽负向后行断言(zero-width negative lookbehind assertion) 

**(?<!pattern)**
要求该位置之前字符都不与pattern匹配。

例如对”regex represents regular expression”这个字符串，要想匹配单词开头的re，可以用”(?<!\w)re”。单词开头的re，在本例中，也就是指不在单词内部的re，即re前面不是单词字符。当然也可以用”\bre”来匹配。

```JavaScript
var pattern =  /(?<!\w)re/g; 
'regex represents regular expression'.replace(pattern,'!');
```

### 举例
还记得曾经讲过的千分位加逗号的方法吗？

```javascript
function thousands(num) {
    // \B 匹配非单词边界，匹配位置的左右两边都是 \w([a-zA-Z0-9_])
    // ?=正向正向先行断言
    // ?!负向先行断言，
    // \d{3}匹配三个数字，+表示前面的内容重复1到多次,也就是匹配3个数字一到多次，3的倍数字符串
    // (?=(\d{3})+(?!\d))匹配一个位置，这个位置先行方向首先是3的倍数个数字的字符串，接下来的位置不是数字
    console.log(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
thousands(314159265354.99)

```

看下图理解一下

* 位置图
![位置](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/reg101.png)

* 流程图

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/xianxing.png" width="500px">

### 其他
以上就是所有JavaScript中正则表达式基础篇的所有内容。
鉴于很多小伙伴的需要，分享一下作图常用的两个网站

* [位置](https://regex101.com/)
* [流程](https://regexper.com/)

接下来会在这篇文章的最后或者单独写一个文件，形成一个正则符号的速查表([对老姚的表做了部分修改](https://github.com/qdlaoyao/js-regex-mini-book))，供各位查看。
