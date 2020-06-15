# 图片上传组件

## 代码片段

```html
<template>
	<tgos-upload-image-single v-model="image"></tgos-upload-image-single>
	<tgos-upload-image-more v-model="images"></tgos-upload-image-more>
</template>
<script>
export default {
  data(){
    return {
      image:'xxx.jpg',
      images:['xxx.jpg','xxx.jpg']
    }
  }
}
</script>
```

## props

| 属性名               | 类型               | 默认值             | 说明                         |
| -------------------- | ------------------ | ------------------ | ---------------------------- |
| width                | String             | 150                | 图片展示的宽度               |
| maxSize              | Number             | 2                  | 允许上传图片的最大体积（兆） |
| value/model          | String/ [ String ] | 需要绑定的图片数据 | 需要绑定的图片数据           |
| ruleHeight/ruleWidth | Number             | 0                  | 需要限制的图片大小           |
| limit                | Number             | 8                  | 最多上传图片数量             |
| drag                 | Boolean            | false              | 是否支持拖拽排序             |

