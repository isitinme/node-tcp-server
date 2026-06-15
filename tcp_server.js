import net from 'node:net';

const IP = '127.0.0.1';
const PORT = ((fallback) => {
    const parsed = parseInt(process.argv[2]);
    return !isNaN(parsed) && parsed.toString().length === 4 ? parsed : fallback;
})(8124);

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
        default:
            console.log('message was not handled');
    }
};

net.createServer((socket) => {
    // socket is an instance of <stream.Duplex> (one's can both brew install ngrokread from it and write to it) and <EventEmitter>    // SYN_SENT
    const { address, family, port } = socket.address();
    const addressFamily = net.isIP(address);
    // socket.setEncoding('utf8');
    console.log(`server socket port: ${port} family: ${family}`);
    console.log('server socket address family is', addressFamily);

    socket
        .on('data', (buf) => onClientDataReceived(socket, buf))
        .on('end', () => {
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
        // ESTABLISHED
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
        // The server is listening on socket 127.0.0.1:8124 means
        // means: "The process has registered a socket with the operating system and is waiting for the kernel to deliver incoming connection requests arriving at port 8124."
        console.log(`TCP server is listening on ${IP}:${PORT}`);
    });

// ========== MONITORING ==========

// netstat: show network status
// -a show the state of all sockets
// -n show network addresses as numbers
// -p (tcp/udp) show statistics about protocol. protocol names are listed in the file /etc/protocols

// socket states:
// CLOSED: the socket is not in use
// LISTEN: the socket is listening for incoming connections
// SYN_SENT: the socket is actively trying to establish a connection to a remote server
// SYN_RCVD: the socket has passively received a connection request from a remote server
// ESTABLISHED: the socket has an established connection between a local application and a remote server
// CLOSE_WAIT: the socket connection has been closed by the remote peer and the system is waiting for the local application to close its half of the connection
// LACT_ACK: the socket connection has been closed by the remote peer and the local application has closed its half of the connection and the system is waiting for the remote peer to acknowledge the close
// CLOSING: the socket connection has been closed by the local application and the remote peer simultaneouslym and the remote peer has not yet acknowledged the close attempt of the local application
// TIME_WAIT:  The socket connection has been closed by the local application, the remote peer has closed its half of the connection, and the system is waiting to be sure that the remote peer received the last acknowledgement.

// listen for socket states change on macos:
// suppose socket PORT is 8124
// while true; netstat -an -t tcp | grep 8124; sleep 2; done

// find PID by socket address
// lsof -l :PORT

// =========== CLIENT CONNECT ===========

// telnet:
// 1. Network administrators use Telnet commands (e.g., telnet <IP> <port>) to manually check if a specific port on a remote server is open and responding
// 2. Debugging Services: It allows administrators to manually send raw commands to test services like web servers (port 80) or mail servers (port 25)
// usage:
// telnet socket_host socket_port: e.g. telnet localhost 8124