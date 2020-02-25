const Barrage = require('./dy_barrage');
const ROOM_ID = '2550505';

let server = new Barrage(ROOM_ID);
server.start((msg) => {
    console.log(msg);
});