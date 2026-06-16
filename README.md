# Node.js TCP server and network playground

# TL;DR;

## Terminal 1: See the server logs
```js
node tcp_server.js 8080
```

## Terminal 2: Monitor TCP server-client socket states
```bash
./monitor.sh
```

## TCP client options:

### Terminal 3: Establish client socket connection via telnet
```bash
telnet localhost 8080
```

### Terminal 3: Establish client socket connection via node.js tcp client
```js
node tcp_client.js
```