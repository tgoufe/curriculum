# 正则火星文第二集(基础篇2)

hellow大家好，在上期的正则火星文的课程中，我们向大家介绍了正则表达式基本匹配规则中的部分元字符，包括字符类`[]`，字符类取反 `^`，范围类 `-`，预定义类 `\`，位置边界 `^` `$` `\b` `\B`，细心的同学可能发现我们还有一部分元字符还没讲到，今天我们就来解决一下剩下的元字符。

开始写代码~

## 元字符

### 量词
现在我们做这样一个需求，匹配一个11位的字符串是否是都是由数字组成，类似于验证手机号码。通过上节课的学习，我们可以这样去写`/\d\d\d\d\d\d\d\d\d\d\d/`,特别麻烦特别长，要是匹配100个呢，是不是就非常的不方便。

量词给我们提供了解决办法,**量词用来设定某个模式出现的次数。**

| 正则  | 描述  |
|:------------- |:---------------| 
| `?`     |  出现0次或一次|  
| `*`     |  出现0次或多次（任意次数）|  
| `+`     |  出现一次或多次（至少一次） |  
| `{n}`    |  出现n次|  
| `{n,m}`    |  出现n到m次(闭区间)|  
| `{n,}`     |  至少出现n次|  
| `{0,m}`     |  至多出现m次|  

上面可以写成

```javascript
/\d{11}/.test(12345678901);
```
来看一下过程图解

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/11times.png
" width="300px"></img>

然后我们再来辨认一下下面这个`/a?b*c+d{5}e{4,7}f{6,}g{0,9}/`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/liangci.png"></img>


### 贪婪与懒惰
讲贪婪模式之前我们先看下面这个例子。

```javascript
'12345678901'.replace(/\d+/g,'!')
//上面的+我们知道是用来匹配一个或者多个的，那么这个替换的结果究竟是11个!还是1个!？
//同样的如果是{3,5}那么匹配的究竟是3还是5呢？
```

这里我们引入一个贪婪的概念，所谓的贪婪模式，是指最大可能匹配，即匹配直到下一个字符不满足匹配规则为止，比如{3,5}。在匹配过3次后，依然继续向下匹配。

与之对应的是懒惰模式，懒惰模式匹配到尽可能少的次数。

JavaScript的正则默认是贪婪模式，要开启对应的懒惰模式只需要在量词后面加一个`？`

举几个例子

`{3,5}?`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/24wen.png
" width="300px"></img>

然后我们再来辨认一下下面这个`/a??b*?c+?d{5}?e{4,7}?f{6,}?g{0,9}?/`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/liangciwen.png"></img>


### 分组与反向引用
我们在来考虑一个现实的需求，如果有这样的匹配规则，要匹配连续3个wangzong，我们该怎么写？
当然可以这样`wangzongwangzongwangzong `,
或者可以这样用量词吗？`wangzong{3}`????
第二种实际上匹配的是wangzonggg，
正则表达式的默认匹配是字符匹配并不会识别单词，有没有办法解决呢？


正则表达式给我们提供了一个组的概念：正则表达式的括号表示分组匹配，括号中的模式可以用来匹配分组的内容。

上面的可以写成`(wangzong){3}`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/wangzong3time.png
" width="300px"></img>


我们写个两个例子，加强理解

```javascript
var html = `<div class="text-darker marginb20">使用说明：</div>`

var reg = __________________;

var str = reg.exec(html);
console.log(str);
```
* 一步步去写

`/<div ([^>]*)>(.*?)<\/div>/g`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep1.png
"></img>

* 不一定是div标签，可能使任意标签

`/<\w+ ([^>]*)>(.*?)<\/\w+>/g`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep2.png
"></img>

* 如果遇到前后标签不一致，我们是不应该匹配的，比如下面这样的例子。
`<div class="text-darker marginb20">使用说明：</span>`
理清一下思路，我们想要的是前后的匹配的文本是一致的，或者我们可以直接使用前面的匹配结果。

**反向引用：正则表达式内部，还可以用`\n`引用括号匹配的内容，n是从1开始的自然数，表示对应顺序的括号**

所以上面的我们可以这样写，

`/<(\w+)([^>]*)>(.*?)<\/\1>/g`

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep3.png
"></img>


**再写一个例子**
很常见的需求，时间的格式转换

```javascript
var html = `2019-11-04`;//期待结果04/11/2019

var reg = __________________;

var str = html.replace(reg,__________);
console.log(str);

html.replace(/(\d{4})-(\d{2})-(\d{2})/,`$2/$1/$3`)

```
`/(\d{4})-(\d{2})-(\d{2})/`

看下图解

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep4.png
" width="500px"></img>

在正则表达式外部可以使用`$n`引用括号匹配的内容。


**再来**

```javascript

var url =  /(http|https):\/\/([^/\r\n]+)(\/.*)?/; // 

url.exec('http://www.bingshangroup.com/blog');

```

`|`是最后一个剩下的元字符，表示或的意思。
上面的这个例子，我们就比较熟悉了，匹配和两个分组分别是协议头和域名内容以及路径

看一下图解

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep5.png
" width="500px"></img>

如果我们只想保留http和https的选择，又不想让这个分组被捕获到，该怎么办呢？

加上 `?:` 即可

```javascript

var url =  /(?:http|https):\/\/([^/\r\n]+)(\/.*)?/; // 

url.exec('http://www.bingshangroup.com/blog');

```

<img src="https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regstep6.png
" width="500px"></img>


到目前为止，我们正则火星文的基础篇，也就是基本规则给大家介绍完了。
下节课将带领大家剖析一些复杂且常用的正则表达式，请期待~




