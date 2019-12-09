---
title: 【leetCode——JavaScript】01-两数之和
date: 2019-06-25 9:00:00
tags: 
  - JavaScript
categories: JavaScript
---


leetCode - 01题, 两数之和
<!--more-->



> 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个**整数**，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
```
示例:
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

--------------


### 一、第一种 - 简单粗暴版

*解题思路：*
既然是数组中两个数相加，且每一个元素不能重复使用，
**那从头到尾遍历数组，将每一个元素都与自身后面所有元素依次相加，得到值和下标。**
这不是**双重循环**就搞定了嘛。
所以，写了下面的代码：


```
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
        let a, b;
        if (nums.length < 1) return -1;

        let res = [];
    
        nums.some((item, idx) => {
            a = -1;
            b = -1;
            let list = nums.slice(idx + 1)
            list.some((i, z) => {
                let val = i + item;
                if (val === target) {
                    a = nums.length - list.length + z;
                    return true
                }
            })

            if (a > -1) {
                b = idx;
                return true
            }
        })

        return res = [b, a]

};
```
- `a`记录结束位置下标，`b`记录开始位置下标，
- `a`的下标使用了比较麻烦的操作，`a = 数组长度 - 当前循环数组长度 + 当前循环数组下标`，
- 其实只要用两个`for`循环就好了，为什么要这么麻烦，因为leetCode有`计算时间`和`占用内存`的测试，我当然是妄图能缩短时间，不过现在回想，`slice`和`some`本身就比`for`要慢。
- 当得到`nums[b] + nums[b] === target`的情况时，`return true`中断循环。理由嘛，同上。

事实证明，虽然好用，但是我太天真了。

执行时间`845ms`，消耗内存`45 MB`



### 第二种 - 逆向思维版
*解题思路*
既然是加法运算，那`减法`也同样能够得到结果，`开始位置 startIndex`依照数组下标，`和`为`target`，
**`lastIndex = target - startIndex`**，只要数组里有这个"差"值，就OK了。
已知两个值，找一个，那用**遍历**就好了嘛。


```
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
        let i = 0;
        let res = [];
        for(i; i < nums.length; i++) {
            const val = target - nums[i];
            let idx = nums.lastIndexOf(val);
            if (idx > -1 && idx !== i) {
                return res = [i, idx]
                
            }
        }

        return res

};
```
- `val`即得到的`差`值，使用`lastIndexOf()`方法得到下标，存在直接返回。（注意判断不要重复使用当前元素）
- 因为两遍遍历（`lastIndexOf()`）都只是`查询`和`数学计算`，比上面第一版强了不少。

执行时间`200 ms`，消耗内存`34.3MB`



### 第三版 - 加强优化版
*解题思路：*
根据上面的第二版代码，`减法`能够节省大量的时间，不过对于查找下标的遍历，略显多余，
使用**映射，访问变量的效率要优于遍历**
所以核心思想就是将查找下标，改为直接获取。



```
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    let map = new Map();
    
    for(let i = 0; i < nums.length; i++) {
        let val = target - nums[i]
        if (map.has(val)) {
            let b = map.get(val);
            return [i, b]
        }
        map.set(nums[i], i)
    }
};
```
- 创建Map对象，储存记录`值: 下标`的映射
- 当`差`值没有对应映射则记录，直到匹配直接读取并中断循环。
- 为了代码阅读所以使用了`has() get() set()`，可以利用`[]`内部直接计算和写入。效率更快。


执行时间`120ms`，消耗内存`35MB`（leetCode百秒内原理几乎相同）

PS:
说到读取和写入，为什么不能使用`Object`对象而要选择`Map`呢。
结论是**可以使用**，且效率与`Map`没有明显差距，不过`Map`对象可以直接访问`数字类型`的key值，
而`Object`需要使用`Object.prototype.hasOwnProperty()`来确认是否存在key值，用`[]`来访问。


作为leetCode入门题，相对还是比较简单，（`for`循环真香！）
