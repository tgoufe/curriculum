let fs= require('fs');
let path=require('path');
function getFiles(filePath,deep=true){
    return fs.readdirSync(filePath).reduce((rs,i)=>{
        let tpath=path.join(filePath,i);
        return rs.concat(
            fs.statSync(tpath).isDirectory()?
            (deep?getFiles(tpath):[]):
            {path:tpath,name:i}
        )
    },[])
}
function getFolders(filePath,deep=true){
	return fs.readdirSync(filePath).reduce((rs,i)=>{
        let tpath=path.join(filePath,i);
        if(!fs.statSync(tpath).isDirectory()){
        	return rs;
        }
        return rs.concat({path:tpath,name:i},deep?getFolders(tpath,deep):[]);
    },[])
}
function setSidebar(){
    return getFolders('./',false)
    .filter(item=>!/^\./.test(item.name))
    .map(item=>{
    	return {
    		title:item.name,
    		children:getFiles(item.path)
                .filter(item=>/\.md/.test(item.path))
                .map(item=>item.path)
    	}
    })
}
function getSideBar(filepath){
    return getFolders(`./${filepath}`,false)
        .filter(item=>!/^\./.test(item.name))
        .reduce((rs,item)=>{
            rs.push({
                title:item.name,
                children:getFiles(item.path)
                    .filter(item=>/\.md/.test(item.path)&&item.name!=='README.md')
                    .map(item=>item.path.replace(filepath,'.').replace('.md',''))
            });
            return rs;
        },[''])
}
module.exports = {
    title: '无论你多NB，在这里你都是冰山一角',
    base:'/blog2/',
    dest:'../public',
    description: 'Just playing around',
    serviceWorker:true,
    themeConfig:{
        // sidebar:[
        //     ...setSidebar()
        // ],
        sidebar:{
            '/action1/':getSideBar('action1'),
            '/action2/':getSideBar('action2'),
            '/':['',{title:'技术赛',children:[
                    '/action1/',
                    '/action2/'
                ]}]
        },
        nav:[
            {text:'第一赛季',link:'/action1/'},
            {text:'冰山工作室官网',items:[
                    {text:'官网',link:'http://www.bingshangroup.com'},
                    {text:'陪你读书',link:'https://www.ximalaya.com/jiaoyu/3740790/'},
                    {text:'立体二维码',link:'http://www.bingshangroup.com#/qc'}
                ]},
        ]
    }
};