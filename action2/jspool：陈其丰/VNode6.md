# 虚拟DOM之更新子节点（四）

## 引言

之前我们了解了`React`和`Vue2.x`中的`Diff`实现方式，而在`Vue3.x`中将采用另外一种`Diff`算法，接下来了解一下~

## 预处理

在真正进行核心的`Diff`算法之前，会有一个预处理的过程，先通过比较两个字符串，来理解一下，什么是预处理：

```js
let prevStr = 'use vue for development'
let nextStr = 'use react for development'
```

肉眼可见，两段文本头部和尾部有一段相同的文本:

+ 'use'
+ 'for development'

若将相同的头尾去掉,则真正需要比较的部分则变为：

```js
let prevStr = 'vue'
let nextStr = 'react'
```

这么做的好处是，某些情况下，可以轻松的判断出单独的插入和删除：

```js
let prevStr = 'vue react app'
let nextStr = 'vue app' // 删除 react
```

```js
let prevStr = 'vue app'
let nextStr = 'vue react app' // 新增 react
```

很显然，预处理在上面的例子中，能够避免`Diff`的执行，从而提高`Diff`的效率，再看一个预处理在`VNode`中的例子：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/1576214190.jpg)

先来排除相同前缀的节点：

```javascript
let j = 0
let prevVNode = prevChildren[j]
let nextVNode = nextChildren[j]
// while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  patch(prevVNode, nextVNode, container)
  j++
  prevVNode = prevChildren[j]
  nextVNode = nextChildren[j]
}
```

更新后：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1576220619303)

接着开始排除相同后缀的节点：

```js
// 指向旧 children 最后一个节点的索引
let prevEnd = prevChildren.length - 1
// 指向新 children 最后一个节点的索引
let nextEnd = nextChildren.length - 1

prevVNode = prevChildren[prevEnd]
nextVNode = nextChildren[nextEnd]

// while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  patch(prevVNode, nextVNode, container)
  prevEnd--
  nextEnd--
  prevVNode = prevChildren[prevEnd]
  nextVNode = nextChildren[nextEnd]
}
```

更新后：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1576220675431)

排除头尾key相同的节点后，我们得到了三个变量：

+ j ：1
+ prevEnd ：0
+ nextEnd ：1

他们之间的大小关系，反应了新旧节点目前的状况。

我们发现 `j > prevEnd` 并且 `j <= nextEnd`，此时说明，旧节点中的节点均已更新完毕，而新节点中仍有剩余，则`j`到`nextEnd`之间的所有节点，为需要插入挂载的节点。

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1576220772810)

从图可知，需要插入的节点需要插入到`li-b`节点前，而`li-b`节点，可以用`nextEnd + 1`来表示，则插入挂载的代码如下：

```js
if (j > prevEnd && j <= nextEnd) {
    // 所有新节点应该插入到位于 nextPos 位置的节点的前面
    const nextPos = nextEnd + 1;
    const refNode = nextPos < nextChildren.length ? nextChildren[nextPos].el : null
    // 采用 while 循环，调用 mount 函数挂载节点
    while (j <= nextEnd) {
        mount(nextChildren[j++], container, refNode)
    }
}
```

来看另一种情况：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/222222.png)

去掉key相同的前缀后缀之后，三个索引值为：

+ j: 1
+ prevEnd: 1
+ nextEnd: 0

我们发现 `j > nextEnd` 并且 `j <= prevEnd`，此时说明，新节点中的节点均已更新完毕，而旧节点中仍有剩余，则`j`到`prevEnd`之间的所有节点，为需要移除的节点。

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/11111.png)

代码实现如下：

```js
if (j > nextEnd && j <= prevEnd) {
  // j -> prevEnd 之间的节点应该被移除
  while (j <= prevEnd) {
    container.removeChild(prevChildren[j++].el)
  }
}
```


## 节点移动

经过预处理之后，如果新节点或旧节点被处理完，则我们只需要通过插入新节点或移除旧节点即可完成新旧子节点的比较，但这毕竟是一种特殊情况，如果出现节点需要移动的情况，那么仅仅通过预处理的方式，是无法真正完成DIff的。

看这样一个案例：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/3333333333333.png)

观察这个例子之后，我们发现，在预处理之后，仅有`li-a`和`li-b`节点能够被提前`patch`，也就是说，无法通过预处理的方式结束掉`Diff`的逻辑。

接下来，我们需要做的就是，判断通过预处理后的新旧子节点是否有节点需要移动，以及如何移动，和寻找出那些需要被添加和移除的节点。

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/4444444.png)

预处理后，`j`的值即不大于`prevEnd`，也不大于`nextEnd`，所以我们之前完成的代码得不到执行：

```js
if (j > prevEnd && j <= nextEnd) {
    // j -> nextEnd 之间的节点应该被添加
}
else if (j > nextEnd && j <= prevEnd) {
    // j -> prevEnd 之间的节点应该被移除
}else{
    // 即将要处理的逻辑
}
```

思如如下：

构造一个数组`source`，数组长度等于新子节点预处理后的剩余节点数量，并且初始值为-1

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/555555555.png)

```js
let source = Array.from({length:nextEnd - j + 1}).fill(-1)
```

从图中可得知，数组中每个元素分别与新子节点中剩余未处理的节点对应，实际上`source`用于存贮新子节点中节点在旧子节点中的位置：

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/6666666666.png)

先构建新节点key到位置索引的索引表：

```js
// 构建索引表
const keyIndex = {}
for(let i = nextStart; i <= nextEnd; i++) {
  keyIndex[nextChildren[i].key] = i
}
```

循环旧节点，通过索引表，构建`source`

```js
const prevStart = j
const nextStart = j
// 遍历旧 children 的剩余未处理节点
for(let i = prevStart; i <= prevEnd; i++) {
  const prevVNode = prevChildren[i]
  // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
  const k = keyIndex[prevVNode.key]

  if (typeof k !== 'undefined') {
    const nextVNode = nextChildren[k]
    // patch 更新
    patch(prevVNode, nextVNode, container)
    // 更新 source 数组
    source[k - nextStart] = i
  } else {
    //如果没有找到对应的新节点，则可认为该旧节点需要被移除：
    container.removeChild(prevVNode.el)
  }
}
```

通过判断每个旧节点在新子节点中的出现顺序，来判断是否需要移动：

```js
const prevStart = j
const nextStart = j
let moved = false
let pos = 0
// 遍历旧 children 的剩余未处理节点
for(let i = prevStart; i <= prevEnd; i++) {
  const prevVNode = prevChildren[i]
  // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
  const k = keyIndex[prevVNode.key]

  if (typeof k !== 'undefined') {
    const nextVNode = nextChildren[k]
    // patch 更新
    patch(prevVNode, nextVNode, container)
    // 更新 source 数组
    source[k - nextStart] = i
    // 判断是否需要移动
    if (k < pos) {
      moved = true
    } else {
      pos = k
    }
  } else {
    //如果没有找到对应的新节点，则可认为该旧节点需要被移除：
    container.removeChild(prevVNode.el)
  }
}
```

## 移动方式

在上一节，我们通过`moved`变量，来保存了，当前Diff中是否需要移动DOM节点，通过`source`记录了新节点在旧节点中的位置。

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/7777777777.png)

```js
if (moved) {
  // 如果 moved 为真，则需要进行 DOM 移动操作
}
```

需要移动时，根据`source`数组的内容，计算一个最长递增子序列

::: tip
什么是最长递增子序列

例如给定数值序列为：[ 0, 8, 4, 12 ]

那么它的最长递增子序列就是：[0, 8, 12]

当然答案可能有多种情况，例如：[0, 4, 12] 也是可以的
:::

当前`source`为：`[2, 3, 1, -1]`,则最长递增子序列为：`[ 2, 3 ]`,而我们需要的是最长递增子序列中各元素在`source`中的位置索引：

此时，我们可以判断出，位于位置0和位置1的节点是不需要移动的节点

而`source`中值扔为`-1`的节点，就是需要插入挂载的节点

使用两个索引 `i` 和 `j` 分别指向新子节点中剩余未处理节点的最后一个节点和最长递增子序列数组中的最后一个位置，并从后向前遍历，如下代码所示：

```js
if (moved) {
  const seq = lis(source) // 最长递增子序列
  // j 指向最长递增子序列的最后一个值
  let j = seq.length - 1
  // 从后向前遍历新 children 中的剩余未处理节点
  for (let i = source.length - 1; i >= 0; i--) {
    if(source[i] === -1){
        // 该节点在新 children 中的真实位置索引
        const pos = i + nextStart
        const nextVNode = nextChildren[pos]
        // 该节点下一个节点的位置索引
        const nextPos = pos + 1
        mount(
            nextVNode,
            container,
            nextPos < nextChildren.length
            ? nextChildren[nextPos].el
            : null
        )
    }
    else if (i !== seq[j]) {
      // 说明该节点需要移动
      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 移动
      insertBefore(
        nextVNode.el,
        nextPos < nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else {
      // 当 i === seq[j] 时，说明该位置的节点不需要移动
      // 并让 j 指向下一个位置
      j--
    }
  }
}
```


::: tip
完整代码&在线体验地址：https://codesandbox.io/s/zen-moore-dr6wd
:::