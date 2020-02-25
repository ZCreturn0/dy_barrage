const WebSocket = require('ws');

// 弹幕服务器
const BARRAGE_SERVER = 'wss://danmuproxy.douyu.com:8505/';
const ORIGIN = 'https://www.douyu.com';

const USERNAME = 0;
const UID = 0;

class Barrage {
    constructor(roomId) {
        this.roomId = roomId;
    }
    // 编辑发送包
    encode(msg) {
        let data = Buffer.alloc(msg.length + 13);
        data.writeInt32LE(msg.length + 9, 0);
        data.writeInt32LE(msg.length + 9, 4);
        data.writeInt32LE(689, 8);
        data.write(msg + '\0', 12);
        return data;
    }
    // 小端整数转十进制进制
    littleIntToInt(byteStr) {
        let s = '';
        for (let str of byteStr) {
            s += this.completeHex(str.toString(16));
        }
        return parseInt(s, 16);
    }
    // 补 0
    completeHex(bit) {
        if (bit.length == 1) {
            return '0' + bit;
        } else if (bit.length == 2) {
            return bit;
        }
    }
    // 解析收到的字节包
    decode(bytes, callback) {
        /**
         * 一个数据包可能有多条信息
         * 前 4 个字节为当前条数据的长度
         * 前 24 字节为长度和头部, 过滤掉, 剩下的为数据部分
         * 每条数据会多占 4 个字节, 暂时不知道用处
         */

        // 消息总长度
        let totalLength = bytes.length;
        // 当前消息长度
        let len = 0;
        // 已解析的消息长度
        let decodedMsgLen = 0;
        // 单条消息的 buffer
        let singleMsgBuffer = null;
        // 取长度的 16 进制
        let lenStr;
        while (decodedMsgLen < totalLength) {
            lenStr = bytes.slice(decodedMsgLen, decodedMsgLen + 4);
            len = this.littleIntToInt(lenStr.reverse()) + 4;
            singleMsgBuffer = bytes.slice(decodedMsgLen, decodedMsgLen + len);
            decodedMsgLen += len;
            // 去除头部和尾部的 '\0'
            let byteDatas = singleMsgBuffer.slice(12, singleMsgBuffer.length - 2).toString().split('/');
            // 解析后的消息对象
            let decodedMsg = {};
            for (let item of byteDatas) {
                let arr = item.split('@=');
                try {
                    decodedMsg[arr[0].replace(/@S/g, '\/').replace(/@A/g, '@')] = arr[1].replace(/@S/g, '').replace(/@A/g, '');
                } catch (e) {
                    console.log(arr[0]);
                    console.log(arr[1]);
                }
            }
            callback(decodedMsg);
        }
    }
    // 发送初始化包, 维护连接
    init(ws) {
        // 登录信息
        let login_msg = `type@=loginreq/room_id@=${this.roomId}/dfl@=sn@A=105@Sss@A=1/username@=${USERNAME}/uid@=${UID}/ver@=20190610/aver@=218101901/ct@=0/`;
        ws.send(this.encode(login_msg));
        // 入组信息
        let join_group_msg = `type@=joingroup/rid@=${this.roomId}/gid@=1/`;
        ws.send(this.encode(join_group_msg));
        // 心跳
        let heartbeat_msg = 'type@=mrkl/';
        ws.send(this.encode(heartbeat_msg));
        // 维持心跳
        setInterval(() => {
            ws.send(this.encode(heartbeat_msg));
        }, 45 * 1000);
    }
    start(callback) {
        // 建立连接
        let ws = new WebSocket(BARRAGE_SERVER, {
            origin: ORIGIN
        });
        // 初始化并维护连接
        ws.on('open', () => {
            console.log(`已连接到 ${this.roomId} 房间......`);
            this.init(ws);
        });
        // 处理收到的消息
        ws.on('message', (data) => {
            this.decode(data, (msg) => {
                callback(msg);
            });
        });
        ws.on('close', () => {
            console.log('disconnected');
        });
    }
}

module.exports = Barrage;