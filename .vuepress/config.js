let fs= require('fs');
let path=require('path');
function getFiles(filePath){
    return fs.readdirSync(filePath).reduce((rs,i)=>{
        let tpath=path.join(filePath,i);
        rs=rs.concat(
            fs.statSync(tpath).isDirectory()?
            getFiles(tpath):
            {path:tpath,name:i}
        )
        return rs;
    },[])
}
function getMD(path){
    return getFiles(path).filter(item=>/\.md/.test(item.path)).map(item=>item.path)
}
function setSidebar(){
    let data={
        base:'基础原理',
        function:'高级函数',
        gongfu:'前端武林秘籍',
        algorithm:'算法',
        css:'你学不会的CSS',
        jskill:'js 技巧',
        mode:'设计模式',
        network:'网络',
        vue:'vue',
        react:'react',
        hybird:'混合APP开发',
        tools:'前端工具使用',
        code:'代码片段',
    }
    let rs=[];
    for(let key in data){
        rs.push({
            title:data[key],
            children:getFiles(`./${key}`)
                .filter(item=>/\.md/.test(item.path))
                .map(item=>item.path)
        })
    }
    return rs;
}
module.exports = {
    title: '无论你多NB，在这里你都是冰山一角',
    description: 'Just playing around',
    serviceWorker:true,
    themeConfig:{
        sidebar:[
            ...setSidebar()
        ],
        nav:[
            {text:'冰山工作室官网',items:[
                    {text:'官网',link:'http://www.bingshangroup.com'},
                    {text:'陪你读书',link:'https://www.ximalaya.com/jiaoyu/3740790/'},
                    {text:'立体二维码',link:'http://www.bingshangroup.com#/qc'}
                ]},
            {text:'官网博客',link:'http://www.bingshangroup.com/blog'}
        ]
    }
};