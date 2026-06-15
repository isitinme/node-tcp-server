# Node.js TCP server and network playground

# TL;DR;

## Terminal 1: See the server logs
```js
node tcp_server.js 8080
```

## Terminal 2: Monitor TCP server-client socket states
```bash
while true; netstat -an -t tcp | grep 8080; sleep 2; done
```

## Terminal 3: Establish client socket connection
```bash
telnet localhost 8080
```