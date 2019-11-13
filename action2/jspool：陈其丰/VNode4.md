# 虚拟DOM之更新子节点（二）

[查看本文的示例代码](https://codesandbox.io/s/zen-moore-dr6wd)

## KEY的作用

在之前的内容中，我们通过减少 DOM 操作的次数使得更新的性能得到了提升，但它仍然存在可优化的空间，要明白如何优化，那首先我们需要知道问题出在哪里。

旧子节点：

```js
[
  h('li', null, 1),
  h('li', null, 2),
  h('li', null, 3)
]
```

新子节点：

```js
[
  h('li', null, 3),
  h('li', null, 1),
  h('li', null, 2)
]
```

先来看一下，在没有Key存在时，是如何更新这对新旧子节点的。

```js
h('li', null, 1) // 旧1
// vs
h('li', null, 3) // 新1

h('li', null, 2) // 旧2
// vs
h('li', null, 1) // 新2

h('li', null, 2) // 旧3
// vs
h('li', null, 1) // 新3
```

在这个例子中，新旧子节点会依次进行比较调用patch函数。

但实际上，我们通过观察新旧子节点，可以很容易的发现，新旧子节点中只有顺序是不同的，所以`最佳操作`应该是`通过移动元素的位置来达到更新的目的`。

既然移动元素是最佳期望，那么我们就需要思考一下，能否通过移动元素来完成更新？
能够移动元素的关键在于：我们需要在新旧 children 的节点中保存映射关系，以便我们能够在旧 children 的节点中找到可复用的节点。

这时候我们就需要给 children 中的节点添加唯一标识，也就是我们常说的 key，在没有 key 的情况下，我们是没办法知道新 children 中的节点是否可以在旧 children 中找到可复用的节点的。

所以，我们给h函数添加一个key属性：

```js
export function h(tag, data = null, children = null) {
  // 省略...

  // 返回 VNode 对象
  return {
    // 省略...
    key: data && data.key ? data.key : null
    // 省略...
  }
}
```

再看之前的例子：

```js
// 旧 children
[
  h('li', { key: 'a' }, 1),
  h('li', { key: 'b' }, 2),
  h('li', { key: 'c' }, 3)
]

// 新 children
[
  h('li', { key: 'c' }, 3)
  h('li', { key: 'a' }, 1),
  h('li', { key: 'b' }, 2)
]
```

有了 key 我们就能够明确的知道新旧 children 中节点的映射关系，如下图所示：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e26d4a45728?w=796&h=386&f=png&s=40087)

知道了映射关系，我们就可以判断新子节点是否可被复用。

```js
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  // 遍历旧的 children
  for (let j = 0; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      break // 这里需要 break
    }
  }
}
```

这段代码中有两层嵌套的 for 循环语句，外层循环用于遍历新 children，内层循环用于遍历旧 children，其目的是尝试寻找具有相同 key 值的两个节点，如果找到了，则认为新 children 中的节点可以复用旧 children 中已存在的节点，这时我们仍然需要调用 patch 函数对节点进行更新，如果新节点相对于旧节点的 VNodeData 和子节点都没有变化，则 patch 函数什么都不会做

## 找到需要移动的节点

在我们已经找到了可复用的节点，并进行了合适的更新操作，下一步需要做的，就是判断一个节点是否需要移动以及如何移动。如何判断节点是否需要移动呢？

先看一个不需要移动的例子：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e2984d23bef?w=784&h=390&f=png&s=37343)

+ 取出`新children`的第一个节点，即`li-a`，并尝试在`旧children`中寻找 `li-a`，结果是我们找到了，并且`li-a`在`旧children`中的索引为`0`。
+ 取出`新children`的第二个节点，即`li-b`，并尝试在`旧children`中寻找 `li-b`，也找到了，并且`li-b`在`旧children`中的索引为`1`。
+ 取出`新children`的第三个节点，即`li-c`，并尝试在`旧children`中寻找`li-c`，同样找到了，并且`li-c`在`旧children`中的索引为`2`。

我们在寻找的过程中，先后遇到的索引顺序为：`0->1->2`。这是一个递增的顺序，说明新旧子节点中节点顺序相同，不需要移动。

再看一个需要移动的例子：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e2b2b182881?w=802&h=382&f=png&s=36221)

+ 取出`新children`的第一个节点，即`li-c`，并尝试在`旧children`中寻找 `li-c`，结果是我们找到了，并且`li-c`在`旧children`中的索引为`2`。
+ 取出`新children`的第二个节点，即`li-a`，并尝试在`旧children`中寻找 `li-a`，也找到了，并且`li-a`在`旧children`中的索引为`0`。

此时`递增`的趋势被打破了，我们在寻找中先需要的索引是`2`，接着又遇到了比`2`小的`0`。此时说明`li-a`是那个需要被移动的节点。

+ 取出`新children`的第三个节点，即`li-b`，并尝试在`旧children`中寻找`li-b`，同样找到了，并且`li-b`在`旧children`中的索引为`1`。

我们发现`1`同样小于`2`，这说明在`旧children`中节点`li-b`的位置也要比`li-c`的位置靠前，所以`li-b`也需要被移动。

以上我们过程就是我们寻找需要移动的节点的过程，在这个过程中我们发现一个重要的数字：2，是这个数字的存在才使得我们能够知道哪些节点需要移动，我们可以给这个数字一个名字，叫做：`寻找过程中在旧节点中所遇到的最大索引值`。如果在后续寻找的过程中发现存在索引值比`最大索引值`小的节点，意味着该节点需要被移动。

```js
// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  // 遍历旧的 children
  for (let j = 0; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动...
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
```

## 移动节点

现在我们已经有办法找到需要移动的节点了，接下来要解决的问题就是：应该如何移动这些节点？


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e2d3460feb1?w=802&h=382&f=png&s=36221)

`新children`中的第一个节点是`li-c`，它在`旧children`中的索引为`2`，由于`li-c`是`新children`中的第一个节点，所以它始终都是不需要移动的，只需要调用`patch函数`更新即可，如下图：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e2f7db9b9eb?w=820&h=576&f=png&s=62051)

`li-c`节点更新完毕，接下来是`新children`中的第二个节点`li-a`，它在`旧children`中的索引是`0`，由于 0 < 2 所以`li-a`是需要移动的节点，那应该怎么移动呢？很简单，`新children`中的节点顺序实际上就是更新完成之后，节点应有的最终顺序，通过观察`新children`可知，`新children`中`li-a`节点的前一个节点是`li-c`，所以我们的移动方案应该是：把`li-a`节点对应的`真实 DOM`移动到`li-c`节点所对应`真实DOM`的后面。

```js
// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  // 遍历旧的 children
  for (let j = 0; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动
        // refNode 是为了下面调用 insertBefore 函数准备的
        const refNode = nextChildren[i - 1].el.nextSibling
        // 调用 insertBefore 函数移动 DOM
        container.insertBefore(prevVNode.el, refNode)
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
```


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e3142607db2?w=1032&h=698&f=png&s=76556)


## 添加新元素

在上面的讲解中，我们一直忽略了一个问题，即`新children`中可能包含那些不能够通过移动来完成更新的节点，例如`新children`中包含了一个全新的节点，这意味着在`旧children`中是找不到该节点的，如下图所示：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e32e6585098?w=994&h=374&f=png&s=43836)

节点`li-d`在`旧的children`中是不存在的，所以当我们尝试在`旧的children`中寻找`li-d`节点时，是找不到可复用节点的，这时就没办法通过移动节点来完成更新操作，所以我们应该使用`mount`函数将`li-d`节点作为全新的`VNode`挂载到合适的位置。

```js
let lastIndex = 0
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let find = false
  for (let j = 0; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    if (nextVNode.key === prevVNode.key) {
      find = true
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动
        const refNode = nextChildren[i - 1].el.nextSibling
        container.insertBefore(prevVNode.el, refNode)
        break
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
    }
  }
  if (!find) {
    // 挂载新节点
    // 找到 refNode
    const refNode =
      i - 1 < 0
        ? prevChildren[0].el
        : nextChildren[i - 1].el.nextSibling
    mount(nextVNode, container, false, refNode)
  }
}
```

## 删除元素

除了要将全新的节点添加到容器元素之外，我们还应该把已经不存在了的节点移除，如下图所示：


![](https://user-gold-cdn.xitu.io/2019/11/13/16e63e348905a4ad?w=780&h=368&f=png&s=34630)

可以看出，`新的children`中已经不存在`li-c`节点了，所以我们应该想办法将`li-c`节点对应的`真实DOM`从容器元素内移除。


```js
// 移除已经不存在的节点
// 遍历旧的节点
for (let i = 0; i < prevChildren.length; i++) {
  const prevVNode = prevChildren[i]
  // 拿着旧 VNode 去新 children 中寻找相同的节点
  const has = nextChildren.find(
    nextVNode => nextVNode.key === prevVNode.key
  )
  if (!has) {
    // 如果没有找到相同的节点，则移除
    container.removeChild(prevVNode.el)
  }
}
```

## 结语

至此，第一个完整的`Diff`算法我们就讲解完毕了，这个算法就是`React`所采用的`Diff`算法。但该算法仍然存在可优化的空间，在下一次分享中继续讨论。


<div style="display:none;">
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(".page p code,.page li code{background-color: #fff5f5!important;color: #ff502c!important;padding: .065em .4em!important;}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
</div>