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

3.字段说明:待续(有时间再写)...
