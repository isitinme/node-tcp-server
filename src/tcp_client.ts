import readline from 'node:readline';
import net, { AddressInfo } from 'node:net';
import { getPort, getSocketLocalAddressInfo } from './utils.js';

const PORT = getPort();
const RL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const socket = net.createConnection({ port: PORT }, () => {
    // socket state: SYN_SENT (client sent SYN)
    // socket state: client receives SYN+ACK, sends ACK -> client moves to ESTABLISHED
    console.log('Connected to server: SYN_RCVD');

    const { address, port, family } = getSocketLocalAddressInfo(socket.address() as AddressInfo);
    const addressFamily = net.isIP(address);
    console.log(`socket client info: addressFamily ${addressFamily} port ${port} family ${family}`);

    socket.write('hello\n');
});

socket
    .on('data', (buf: Buffer) => {
        const msg = buf.toString().trim();
        console.log(`Received message from server: ${msg}`);
        RL.question('Reply to server:', (msg) => {
            socket.write(`${msg}\n`)
        });
    })
    .on('close', (hadError: boolean) => {
        console.log('Client socket has been closed. Had transmission error: ', hadError);
        RL.close();
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
