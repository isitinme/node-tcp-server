import net from 'node:net';
import { getPort } from './utils.js';

const IP = '127.0.0.1';
const PORT = getPort();

const onClientDataReceived = (socket, buf) => {
    const msg = buf.toString().trim();
    console.log('socket got incoming packet: ', msg);
    console.log(`package received from: family ${socket.remoteFamily} port ${socket.remotePort}`);
    switch (msg) {
        case 'hello':
            socket.write('world\n');
            break;
        case 'bye':
            socket.end('good by then!\n');
            // server sends FIN and moves to FIN_WAIT_1
        default:
            console.log('message was not handled');
    }
};

net.createServer((socket) => {
    // socket state: receive SYN = SYNC_RCVD, reply with SYN+ACK
    // socket is an instance of <stream.Duplex> (one's can both brew install ngrokread from it and write to it) and <EventEmitter>    // SYN_SENT
    const { address, family, port } = socket.address();
    const addressFamily = net.isIP(address);
    // socket.setEncoding('utf8');
    console.log(`server socket port: ${port} family: ${family}`);
    console.log('server socket address family is', addressFamily);

    socket
        .on('data', (buf) => onClientDataReceived(socket, buf))
        .on('end', () => {
            // server receives FIN acks it and moves to TIME_WAIT and gets closed
            console.log('client disconnected');
        })
        .on('close', (hadError) => {
            // Emitted once the socket is fully closed. The argument hadError is a boolean which says if the socket was closed due to a transmission error.
            console.log('Socket closed. Had transmission error: ', hadError);
        })
        .on('error', (err) => {
            consol.error('socket error: ', err);
        });

    // SYN_RCVD by client socket
    socket.write(`first hello from server: family ${addressFamily} port: ${port}\n`);
})
    .on('connection', (socket) => {
        // new connection established, handshake completed
        // server receives ACK -> server moves to ESTABLISHED
        // emits each time a new client socket has been received
        console.log('server instance has gotten "connection" event.');
        console.log('socket local address', socket.address());
        console.log(`socket remote address: ${socket.remoteAddress} familly: ${socket.remoteFamily} port: ${socket.remotePort}`);
    })
    .on('error', (err) => {
        console.error('TCP server error', err);
        throw new err;
    })
    .listen(PORT, () => {
        // socket state: LISTEN
        // The server is listening on socket 127.0.0.1:8124 means
        // means: "The process has registered a socket with the operating system and is waiting for the kernel to deliver incoming connection requests arriving at port 8124."
        console.log(`TCP server is listening on ${IP}:${PORT}`);
    });