# node文件操作
## 获取文件夹下的所有文件
```javascript
let fs= require('fs');
let path=require('path');
function getFiles(filePath){
    return fs.readdirSync(filePath).reduce((rs,item)=>{
        let tpath=path.join(filePath,i);
        return rs.concat(
            fs.statSync(tpath).isDirectory()?
            ...getFiles(tpath):
            {path:tpath,name:i}
        )
        return rs;
    },[])
}
```