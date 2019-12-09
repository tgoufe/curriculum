---
title: 冰山工作室--web前端--每日一题--chrome调试技巧之console
date: 2019-04-25 17:00:00
tags: 
    -JavaScript  
    -closure
categories: JavaScript
---
console对象的浏览器实现，包含在浏览器自带的开发工具之中。以Chrome浏览器的“开发者工具”（Developer Tools）为例，首先使用下面三种方法的一种打开它。

- 按F12或者Control + Shift + i（PC平台）/ Alt + Command + i（Mac平台）。

- 在菜单中选择“工具/开发者工具”。

- 在一个页面元素上，打开右键菜单，选择其中的“Inspect Element”。
<!--more-->
console面板如下
![image console](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console1.png)

接下来详细了解一下console的命令~

## console青铜局 –-- 基础输出
console.log、console.error、console.warn、console.dir

###  console.log([data][, ...args])
在控制台打印自定义字符串
第一个参数是一个字符串，包含零个或多个占位符。 每个占位符会被对应参数转换后的值所替换，支持printf风格输出 只支持字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）四种
支持格式化输出，console.log 第一个参数如果有%c，会把%c后面的文案按照你提供的样式输出，此时第二个参数应为css属性的字符串。

```javascript
console.log(666)

//插值输出
console.log("%s年%d月", 2019, 3) //%s 字符串 %d 整数
console.log("%c我是%c自定义样式", "color:red", "color:blue;font-size:25px")

//格式化输出
console.log("%c3D Text"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
```
执行结果
![console2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console2.png)

天狗前端 > 【凯丽】工欲善其事必先利其器 -- chorme调试技巧之console > image2019-3-26 15:17:33.png

###  console.error
在控制台打印自定义错误信息

支持printf风格输出 只支持字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）四种
支持格式化输出，样式规则同console.log

```javascript
console.error(666)
console.error("%s年%d月", 2019, 3)
console.error("%c3D Text"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
```
执行结果

![console3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console3.png)


###  console.warn
打印自定义警告信息

支持printf风格输出 只支持字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）四种
支持格式化输出
```javascript
console.warn(666)
console.warn("%s年%d月", 2019, 3)
console.warn("%c3D Text"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
```
执行结果


![console4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console4.png)


###  console.dir 
dir方法用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示
该方法对于输出DOM对象非常有用，因为会显示DOM对象的所有属性

```javascript
console.dir($('.text-light'))
console.dirxml($('.text-light'))
```
执行结果

console.dir和 console.log执行结果的区别:
![console5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console5.png)

console.dir输出的结果更详细，同学们可以自己试试看

##console白银局 ---- 格式输出
###  console.table
对于某些复合类型的数据，console.table方法可以将其转为表格显示
参数被转为数组的前提条件是必须有主键值，数组的主键是其index，对象的主键是它的最外层键
如果参数不是复合类型的数据，console.table的表现同console.log

```javascript
var text1 = [
	{name:"Bob",age:13,hobby:"playing"},
	{name:"Lucy",age:14,hobby:"reading"},
	{name:"Jane",age:11,hobby:"shopping"}
];
console.table(text1);
 
var test2 = {
  csharp: { name: "C#", paradigm: "object-oriented" },
  fsharp: { name: "F#", paradigm: "functional" }
}
console.table(test2)
 
var test3 = 8888
console.table(test3)
 
console.table('%c我是格式化文字', 'font-size:20px;color:red')
```
执行结果
![console6](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console6.png)
###  console.group 
成组输出，分在一组的信息，可以用鼠标折叠/展开
console.group接受一个字符串作为参数，并把字符串作为这组数据的组名输出到控制台
必须配合console.groupEnd使用，console.groupEnd如果接受参数，则会寻找跟它同名的console.group,如果没有参数，则会采用就近原则配对

```javascript
var stu = [{name:"Bob",age:13,hobby:"playing"},{name:"Lucy",age:14,hobby:"reading"},{name:"Jane",age:11,hobby:"shopping"}];
console.group('group1')
console.log(stu[0])
console.log(stu[1])
console.log(stu[2])
 
console.group('group2')
console.log(stu[2].name)
console.log(stu[2].age)
console.log(stu[2].hobby)
console.groupEnd()
 
console.groupEnd()
```
执行结果
![console7](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console7.png)



##console黄金局 ---- 加入一些运算吧
###  console.count
计数，每次执行到count的位置都输出所在函数的执行次数

```javascript
function fib(n){ //输出前n个斐波那契数列值
  if(n == 0) return;
  console.count("调用次数");//放在函数里，每当这句代码运行输出所在函数执行次数
  //console.trace();//显示函数调用轨迹(访问调用栈）
  var a = arguments[1] || 1;
  var b = arguments[2] || 1;
  console.log("fib=" + a);
  [a, b] = [b, a + b];
  fib(--n, a, b);
}

fib(6);
```
执行结果
![console8](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console8.png)


###  console.trace
访问调用栈
打印当前执行位置到console.trace()的路径信息

```javascript
function doTask(){
    doSubTask(1000,10000);
}
 
function doSubTask(countX,countY){
    for(var i=0;i<countX;i++){
        for(var j=0;j<countY;j++){} 
    }
    console.trace();
}
doTask();
```
执行结果

![console9](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console9.png)

###  console.time
启动一个计时器（timer）来跟踪某一个操作的占用时长
每一个计时器必须拥有唯一的名字，页面中最多能同时运行10,000个计时器。当以此计时器名字为参数调用 console.timeEnd() 时，浏览器将以毫秒为单位，输出对应计时器所经过的时间
该方法在使用时不会将输出的时间返回到js,它只能用于控制台调试

```javascript
var oldList = new Array(1000);
var oldList1 = new Array(1000);
for(let i = 0;i<1000;i++){
	oldList[i] = Math.floor(Math.random()*1000);
	oldList1[i] = Math.floor(Math.random()*1000);
}

// 冒泡排序
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {        //相邻元素两两对比
                var temp = arr[j+1];        //元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
console.time('bubbleSort');
bubbleSort(oldList);
console.timeEnd('bubbleSort');
console.time('sort');
oldList1.sort();
console.timeEnd('sort');
```

执行结果
![console10](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console10.png)

###  console.assert
如果断言为false，则将一个错误消息写入控制台。如果断言是true，没有任何反应
在浏览器中当console.assert()方法接受到一个值为假断言（assertion）的时候，会向控制台输出传入的内容，但是并不会中断代码的执行，而在Node.js中一个值为假的断言将会导致一个AssertionError被抛出，使得代码执行被打断
显示样式同console.warn
```javascript
var testList = [{name:'aa',age:19},{name:'bb',age:25},{name:'cc',age:22}];
testList.forEach((item, index) => {
	console.assert(true , '666');
	console.assert(false, 'false message')
	console.log(index)
})
```
执行结果
![console11](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/console11.png)

在node中遇到false会报错

##附录
用console干点好玩的事情

### console.log模拟loading动画

function print(len){
	let oldStr = '';
	for(let i = 0;i < len ;i++){
		setTimeout(()=>{
			oldStr = oldStr + ' ';
			console.log(oldStr+'%c>', 'color:green;font-size:20px');
			_.delay(() => {
				console.clear();
			}, 500)
		}, 700*i);
	}
}
print(10);
### v8 sort的源码

源码地址 arrayV8 源码    Line760
```javascript
var QuickSort = function QuickSort(a, from, to) {
    var third_index = 0;
    while (true) {
      // Insertion sort is faster for short arrays.
      if (to - from <= 10) {                                           //数组长度小于10，快速排序
        InsertionSort(a, from, to);
        return;
      }                                                                //数组长度大于10，插入排序
      if (to - from > 1000) {                                          //取基准值
        third_index = GetThirdIndex(a, from, to);
      } else {
        third_index = from + ((to - from) >> 1);
      }
      // Find a pivot as the median of first, last and middle element.
      var v0 = a[from];
      var v1 = a[to - 1];
      var v2 = a[third_index];
      var c01 = comparefn(v0, v1);
      if (c01 > 0) {
        // v1 < v0, so swap them.
        var tmp = v0;
        v0 = v1;
        v1 = tmp;
      } // v0 <= v1.
      var c02 = comparefn(v0, v2);
      if (c02 >= 0) {
        // v2 <= v0 <= v1.
        var tmp = v0;
        v0 = v2;
        v2 = v1;
        v1 = tmp;
      } else {
        // v0 <= v1 && v0 < v2
        var c12 = comparefn(v1, v2);
        if (c12 > 0) {
          // v0 <= v2 < v1
          var tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
      }
      // v0 <= v1 <= v2
      a[from] = v0;
      a[to - 1] = v2;
      var pivot = v1;
      var low_end = from + 1;   // Upper bound of elements lower than pivot.
      var high_start = to - 1;  // Lower bound of elements greater than pivot.
      a[third_index] = a[low_end];
      a[low_end] = pivot;

      // From low_end to i are elements equal to pivot.
      // From i to high_start are elements that haven't been compared yet.
      partition: for (var i = low_end + 1; i < high_start; i++) {
        var element = a[i];
        var order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[low_end];
          a[low_end] = element;
          low_end++;
        } else if (order > 0) {
          do {
            high_start--;
            if (high_start == i) break partition;
            var top_elem = a[high_start];
            order = comparefn(top_elem, pivot);
          } while (order > 0);
          a[i] = a[high_start];
          a[high_start] = element;
          if (order < 0) {
            element = a[i];
            a[i] = a[low_end];
            a[low_end] = element;
            low_end++;
          }
        }
      }
      if (to - high_start < low_end - from) {
        QuickSort(a, high_start, to);
        to = low_end;
      } else {
        QuickSort(a, from, low_end);
        from = high_start;
      }
    }
  };
```









