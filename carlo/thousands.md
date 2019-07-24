
---
title: 【分筋错骨手】如何给数字添加千分位分隔
date: 2019-04-24 17:00:00
tags: JavaScript
categories: 开发技巧
password: tgfe
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---


> 在很多商城或者统计报表的需求中，经常需要前端去把一大串传数字每隔三位添加一个逗号，这样的需求怎么去高逼格实现呢？
先说为什么要加逗号，财会的同学跟我说，他们做账一般是按照千分位作为标准的，每三位加个逗号是通行标准，英语中只有：B=billion,第二逗号 M=million,第三逗号 T=thousand BMT(别摸它)

<!--more-->

现在开始写代码o(╯□╰)o

### **1、数组循环**
将数字转换成字符串，再分隔成字符串数组，每3位前面加逗号，再拼成字符串。
闭着眼睛都知道这么麻烦的方法一定不是我的逼格

```javascript
function thousands(num) {
     var result = [], counter = 0;
     num = (num || 0).toString().split('');
     for (var i = num.length - 1; i >= 0; i--) {
         counter++;
         result.unshift(num[i]);
         if (!(counter % 3) && i != 0) { result.unshift(','); }
     }
     console.log(result.join(''));
 }

thousands(314159265354)
```

### **2.字符串循环**
直接获取字符串下标，不需要转数组

```javascript
function thousands(num) {
     var result = '', counter = 0;
     num = (num || 0).toString();
     for (var i = num.length - 1; i >= 0; i--) {
         counter++;
         result = num.charAt(i) + result;
         if (!(counter % 3) && i != 0) { result = ',' + result; }
     }
     console.log(result);
}
thousands(314159265354)
```


### **3.字符串不循环**
为什么要用循环取3位，直接截取不好吗？

```javascript
function thousands(num) {
     var num = (num || 0).toString(), result = '';
     while (num.length > 3) {
         result = ',' + num.slice(-3) + result;
         num = num.slice(0, num.length - 3);
     }
     if (num) { result = num + result; }
     console.log(result);
}
thousands(314159265354)
```

### **4.正则来了**
为什么不用正则直接取后3位？

```javascript
function thousands(num) {
     var num = (num || 0).toString(), reg = '/\d{3}$/', result = ''; //匹配三个数字字符
     while (reg.test(num) ) {
         result = RegExp.lastMatch + result;//返回上一次正则表达式搜索过程中最后一个匹配的文本字符串。
         if (num !== RegExp.lastMatch) {
             result = ',' + result;
             num = RegExp.leftContext;//返回上一次正则表达式匹配时，被搜索字符串中最后一个匹配文本之前(不包括最后一个匹配)的所有字符。
         } else {
             num = '';
             break;
         }
     }
     if (num) { result = num + result; }
     console.log(result);
};
thousands(314159265354)
```
### **5.正则升级**
用了正则还写了这么长的代码，实在不应该……

```javascript
function thousands(num) {
    // \B 匹配非单词边界，匹配位置的左右两边都是 \w([a-zA-Z0-9_])
    // ?=是先行断言，表示这个位置后面的内容需要满足的条件，注意只是匹配一个位置，并不匹配具体的字符，所以是零宽；
    // ?!后行断言，表示这个位置后面的内容不能满足的条件,(?!\d)表示接下来的位置不是数字,可以是小数点
    // \d{3}匹配三个数字，+表示前面的内容重复1到多次,也就是匹配3个数字一到多次，3的倍数字符串
    // (?=(\d{3})+(?!\d))匹配一个位置，这个位置后面首先是3的倍数个数字的字符串，接下来的位置不是数字
    
    console.log(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
thousands(314159265354.99)
```
其实正则还可更短点的  '/\B(?=(\d{3})+\b)/g'   留个作业，自己理解

### **6.凑整法**
直接凑成3的部分不就简单多了吗？

```javascript
function thousands(num) {
     var num = (num || 0).toString(), temp = num.length % 3;
     switch (temp) {
         case 1:
             num = '00' + num;
             break;
         case 2:
             num = '0' + num;
             break;
     }
     console.log (num.match(/\d{3}/g).join(',').replace(/^0+/, ''));
}
thousands(314159265354)
```

### **7.内置方法**
说了这么多，有没有现成的方法可以使用呢？

```javascript
var number = 314159265354;
//千分位分隔
console.log(number.toLocaleString('en-US'));//314,159,265,354
// nu 扩展字段要求编号系统，e.g. 中文十进制
console.log(number.toLocaleString('zh-Hans-CN-u-nu-hanidec'));// 三一四,一五九,二六五,三五四
//货币格式欧元
console.log(number.toLocaleString('ja-JP', { style: 'currency', currency: 'EUR',currencyDisplay:'name'}))

numObj.toLocaleString([locales [, options]])

locales:'',//可选语言  格式 language[-scripts][-region]-u-nu-*
options:{
    localeMatcher:'',//匹配算法
    style:'',//“decimal”表示纯数字格式 , “currency”表示货币格式, 和"percent"表示百分比格式
    currency:'',//货币代码
    currencyDisplay:'',//如何在货币格式化中显示货币,标志或者名称
    useGrouping:'',//是否使用分隔符
    minimumIntegerDigits:'',//使用的整数数字的最小位数.可能的值是从1到21
    minimumFractionDigits:'',//使用的小数数字的最小位数.可能的值是从0到20 maximumFractionDigits为最大
    minimumSignificantDigits:''//使用的有效数字的最小位数。可能的值是从1到21 maximumSignificantDigits为最大
}
```
### **7.完美方法**
真的完美了吗？让我们试试负数、小数、0、undefined吧

```javascript
function number_format(strInput, decimals, dec_point, thousands_sep) {
    var number = strInput;
    if (typeof(number) === 'string') {
        //字符串转数字
        number = parseFloat(number.replace(/[^\-\d\.]/g, ''));
    }
    var n = !isFinite(+number) ? 0 : +number, //检查整数有限值,隐式转数字类型
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), //检查保留小数位数有限值,并取绝对值
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //设置千分位标志
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point; //设置小数标志
    if (!Number.prototype._toFixed) {
        Number.prototype._toFixed = Number.prototype.toFixed;
    }

    Number.prototype.toFixed = function(prec) {
        return (this + 3e-16)._toFixed(prec);
    };

    s = (prec ? n.toFixed(prec) : Math.round(n)).toString().split('.'); //切割整数和小数
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep); //千分位分隔
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0'); //补充小数
    }
    return s.join(dec);
}

function test(number, decimals, dec_point, thousands_sep) {
    console.log(number_format(number, decimals, dec_point, thousands_sep));
}

test('-1111111.222222', 3, '.', ',');
```
[accounting.js](https://github.com/openexchangerates/accounting.js/blob/master/accounting.js)

[numeral](https://github.com/adamwdraper/Numeral-js/blob/master/src/numeral.js#L241)
