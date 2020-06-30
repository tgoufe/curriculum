# 图片上传组件

## 代码片段

```html
<template>
	<tgos-upload-image v-model="image"></tgos-upload-image>
	<tgos-upload-images v-model="images"></tgos-upload-images>
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

| 属性名      | 类型               | 默认值             | 说明                                                         |
| ----------- | ------------------ | ------------------ | ------------------------------------------------------------ |
| width       | String             | 0                  | 限制图片上传宽度，0为不限制                                  |
| height      | number             | 0                  | 限制图片上传高度，0为不限制                                  |
| max         | Number             | 2                  | 允许上传图片的最大体积（兆）                                 |
| value/model | String/ [ String ] | 需要绑定的图片数据 | 需要绑定的图片数据                                           |
| size        | String             | normal             | 图片展示尺寸，可以使用small/normal/big三个值                 |
| limit       | Number             | 8                  | 最多上传图片数量                                             |
| drag        | Boolean            | false              | 是否支持拖拽排序（仅多图上传支持）                           |
| path        | String             | ''                 | 图片在model中的路径，如model=[{url:'1.jpg'}]，则需要将path设置为url |

