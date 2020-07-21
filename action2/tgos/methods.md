# tgos通用方法

在src/components/methods下的方法会以文件夹名称作为tgos的通用方法被挂在到Vue.prototype上，如存在log文件夹，则可以在程序中直接使用tgos_log来调用

## 显示日志

```javascript
this.tgos_log({
  dataMethod: baseService.mpRoleLogList,//获取数据的接口地址
  countMethod: baseService.mpRoleLogListCount,//获取分页的接口地址
  params: { id }//需要传递的参数
});
```



