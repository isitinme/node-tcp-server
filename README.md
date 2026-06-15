# Node.js TCP server and network playground

# TL;DR;

## Terminal 1: See the server logs
```js
node tcp_server.js
```

## Terminal 2: Monitor TCP server-client socket states
```bash
while true; netstat -an -t tcp PORT | grep 8124; sleep 2; done
```

## Terminal 3: Establish client socket connection
```bash
telnet localhost 8124
```