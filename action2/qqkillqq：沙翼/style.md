# 自动生成样式

最近我们发布了面向移动端开发的UI框架CyanMaple，里面包含了诸多提升开发效率的特性，在这其中很多人对动态样式非常感兴趣，那么今天我们就来聊一下动态样式的实现。

## 需求确定

首先我们要明确一下我们的需求，在我们的开发中经常会用到magin padding border-radius width height 等需要用到距离单位的样式属性，但是分离这些样式会让你的开发变得很麻烦，如果你使用组件还是传统的样式表，都需要反复在HTML结构和CSS样式两个模块或文件中来回切换，现在我们希望使用class的方式来自动生成样式。比如我们为某个DOM节点添加名为padding20的class，那么就自动生成一条

```css
.padding20{padding:20px}
```

的样式，并渲染到页面。

## 规则确定

确定了需求，接下来我们就要制定一些规则将样式映射到class名称上，在Cyan中的规则如下

1. 使用padding margin radius等全称表示主样式
2. 使用t r l b 表示top right left bottom
3. 使用h表示水平方向，相当于同时使用规则2中的l和r
4. 使用v表示水平方向，相当于同时使用规则2中的t和b
5. 使用-n表示负数，并添加在主样式后面

根据上面的规则，我们就能确定生成的class名称和对应的样式关系，如下

```css
.padding10{padding:10px}
.paddingh33{padding-left:33px,padding-right:33px}
.paddingt43{padding-top:43px}
.margint-n15{margin-top:-15px}
```



