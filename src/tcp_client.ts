import net, { AddressInfo } from 'node:net';
import { getPort } from './utils.js';

const PORT = getPort();

const socket = net.createConnection({ port: PORT }, () => {
    // socket state: SYN_SENT (client sent SYN)
    // socket state: client receives SYN+ACK, sends ACK -> client moves to ESTABLISHED
    console.log('Connected to server: SYN_RCVD');
    const addr = socket.address();
    let address = '';
    let port = 0;
    if (typeof addr === 'string') {
        address = addr;
    } else if (addr && typeof addr === 'object' && 'address' in addr) {
        const a = addr as AddressInfo;
        address = a.address;
        port = a.port;
    }
    const addressFamily = net.isIP(address);
    socket.write(`first hello from client: family ${addressFamily} port ${port}`);
});

socket
    .on('data', (buf: Buffer) => {
        const msg = buf.toString().trim();
        console.log(`Received message from server: ${msg}`);
        socket.write('hello\n');
        if (msg === 'world') {
            socket.write('bye');
        }
    })
    .on('close', (hadError: boolean) => {
        console.log('Client socket has been closed. Had transmission error: ', hadError);
    })
    .on('end', () => {
        // client receives FIN from server, kernel acks it automatically, client moves to CLOSE_WAIT
        console.log('Server disconnected');
        // client sends FIN and moves to LAST_ACK
        socket.end();
    })
    .on('error', (err: Error) => {
        console.error('socket error: ', err);
    });
