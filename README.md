# Node.js TCP server and network playground

# TL;DR;

## Terminal 1: Start TCP server
```bash
npm start 8080
```

## Terminal 2: Monitor TCP server-client socket states
```bash
./monitor.sh
```

## TCP client options:

### 1. Establish client socket connection via telnet
```bash
telnet localhost 8080
```

### 2. Establish client socket connection via node.js tcp client
```bash
npm run start:client 8080
```