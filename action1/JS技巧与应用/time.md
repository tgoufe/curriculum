
---
title: 【飞雷神】关于时间，你常用的都在这里
date: 2019-08-13 17:00:00
tags: JavaScript
categories: 开发技巧 
---
 

> 这篇文章专治懒癌患者

<!--more-->

众所周知，JavaScript核心包含Data()构造函数，用来创建表示时间和日期的对象。
如果给大家分享的是整篇的api，想必大家都没有什么看的欲望，如果你还对Data对象不是很了解，请先移步**[陪你读书](https://www.ximalaya.com/zhubo/30018073/album/)**


**今天主要跟大家梳理一下，常用的时间、日期处理方法，方便大家使用和理解**

### **格式化时间**
老生常谈，大概会这么写

```JavaScript
var format = function (time) { 
        var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
        var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
        return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
}

var time1 = format(new Date());
```
但是有什么问题呢？一般来说小于10的值，要在前面添加字符串‘0’的，我们大可以写个判断来解决他，但是太麻烦了~

**其实可以这样**

```JavaScript
var format = function (time) { 
      var date = new Date(+time + 8 * 3600 * 1000);
    	return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}
var time1 = format(new Date());

//Date的‘toJSON’方法返回格林威治时间的JSON格式字符串，转化为北京时间需要额外增加8个时区，然后把‘T’替换为空格，即是我们需要的时间格式，后面可以通过正则将日期分隔符换成任何想要的字符。
//一元加操作符可以把任何数据类型转换成数字，所以获取时间对象对应毫秒数的另一个方法是+Date或Number(Date)
```

### **获取当月最后一天**
一个月可能有28/29/30/31天，使用写死数据的方式来解决闰年和大小月显然是不科学的。

```JavaScript
function getLastDayOfMonth (time) {
    var month = time.getMonth();
    time.setMonth(month+1);
    time.setDate(0);
    return time.getDate()
}
getLastDayOfMonth(new Date())
//先月份加一，再取上个月的最后一天
```
### **获取这个季度第一天**
用来确定当前季度的开始时间，常用在报表中

```JavaScript
function getFirstDayOfSeason (time) {
    var month = time.getMonth();
    if(month <3 ){
        time.setMonth(0);
    }else if(2 < month && month < 6){
        time.setMonth(3);
    }else if(5 < month && month < 9){
        time.setMonth(6);
    }else if(8 < month && month < 11){
        date.setMonth(9);
    }
    time.setDate(1);
    return time;
}
getFirstDayOfSeason(new Date())
//先月份加一，再取上个月的最后一天
```

### **获取中文星期**
这也是个比较常见的雪球，完全没必要写一长串switch啦，直接用charAt来解决。

```JavaScript
let time ="日一二三四五六".charAt(new Date().getDay());
```

### **获取今天是当年的第几天**
来看看今年自己已经浪费了多少时光~

```JavaScript
var time1 = Math.ceil(( new Date() - new Date(new Date().getFullYear().toString()))/(24*60*60*1000));

//需要注意的是new Date()不设置具体时间的话new Date(2019)得到的不是0点而是8点 
//Tue Jan 01 2019 08:00:00 GMT+0800 (中国标准时间)
```
### **获取今天是当年的第几周**
日历、表单常用
```JavaScript
var week = Math.ceil(((new Date() - new Date(new Date().getFullYear().toString()))/(24*60*60*1000))/7);

//在获取第几天的基础上除7，向上取整
```


### **获取今天是当年还剩多少天**
再来看看今年还有多少天可以浪费~

```JavaScript
function restOfYear(time) {
    var nextyear = (time.getFullYear() + 1).toString();
    var lastday = new Date(new Date(nextyear)-1); //获取本年的最后一毫秒：
    console.log(lastday)
    var diff = lastday - time;  //毫秒数
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
restOfYear(new Data())
//先取下一年第一秒，再减1毫秒。顺便思考一下为什么👆是Math.ceil，👇是Math.floor。
```

### **计算两个时间的间隔**
可以拓展为倒计时、有效期等用途

```JavaScript
function diffTime(startDate,endDate,location) {
    var diff=new Date(endDate).getTime() - startDate;//时间差的毫秒数

    //计算出相差天数
    var days=Math.floor(diff/(24*3600*1000));

    //计算出小时数
    var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));

    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));

    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    if(location === "Day") {
       return returnStr = "还有" + days + "天";
    }else if(location === "Hours") {
       return returnStr = "还有" + (hours+days*24) + "小时";
    }else if(location === "Minutes") {
       return returnStr = "还有" + (minutes+(hours+days*24)*60) + "分钟";
    }else if(location === "Seconds") {
       return returnStr = "还有" + (seconds+(minutes+(hours+days*24)*60)*60) + "秒";
    }else{
        return returnStr = "还有" + days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
    }
}
console.log(diffTime(new Date(), '2019-8-19 16:00:00','Minutes'))
//没有写的很复杂，方便各位修改拓展。
```

### **计算指定时间间隔前后的日期**
可用于时间追溯、活动预告等用途

```JavaScript
function GetDate(time,count) {   
    time.setDate(time.getDate() + count);//获取N天后的日期  
    var date = new Date(+time + 8 * 3600 * 1000);
        return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}  
GetDate(new Date(),100)
```

### **计算当周开始和结束时间**
很常见的需求，可用来做签到等

```JavaScript
function getwholetWeek(now){
  var weekday = now.getDay();    // 获取当前是周几（周日：0）
  weekday = weekday === 0 ? 7 : weekday;
  var firstDay = GetDate(now,-weekday); //周日开始
  var lastDay = GetDate(now,7 - 1); //周六结束
  return {
    firstDay: firstDay,
    lastDay: lastDay
  };
}

console.log(getwholetWeek(new Date()))
//调用前面日期间隔函数，可根据情况改成，周一开始，周日结束
```
[沙翼-喜马拉雅-陪你读书-JavaScript](https://www.ximalaya.com/zhubo/30018073/album/)
