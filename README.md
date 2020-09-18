# dy_barrage
连接斗鱼弹幕

本项目已上传到npm [dy-barrage](https://www.npmjs.com/package/dy-barrage)

使用方法: 

1.安装 dy-barrage 模块

```
npm install dy-barrage -D
```

2.连接对应的房间号即可
```
const Barrage = require('dy-barrage');
const ROOM_ID = '房间号';
let server = new Barrage(ROOM_ID);
// server.start() 接收一个回调函数,每次有消息时调用,msg为一个json对象
server.start((msg) => {
    console.log(msg);
});
```

3.房间号说明

房间号不一定是房间URL最后的一串数字,要查看真实房间号,进入房间后F12打开调试工具,然后F5刷新页面,第一个请求后的数字才是房间号.

![房间号](https://raw.githubusercontent.com/ZCreturn0/dy_barrage/master/roomId.png)


------------------------------------------------------------------------
2020-09-16 更新:
新增排行榜数据的解析,返回type为'ranklist','frank','fswrank'即为排行榜数据


------------------------------------------------------------------------
2020-09-19 更新
更新了package.json配置,上个版本没检查,入口文件配错了