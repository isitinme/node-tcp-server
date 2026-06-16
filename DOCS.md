## MONITORING

### socket states:
* CLOSED: the socket is not in use
* LISTEN: the socket is listening for incoming connections
* SYN_SENT: the socket is actively trying to establish a connection to a remote server
* SYN_RCVD: the socket has passively received a connection request from a remote server
* ESTABLISHED: the socket has an established connection between a local application and a remote server
* CLOSE_WAIT: the socket connection has been closed by the remote peer and the system is waiting for the local application to close its half of the connection
* LACT_ACK: the socket connection has been closed by the remote peer and the local application has closed its half of the connection and the system is waiting for the remote peer to acknowledge the close
* CLOSING: the socket connection has been closed by the local application and the remote peer simultaneouslym and the remote peer has not yet acknowledged the close attempt of the local application
* FIN_WAIT_1:  The socket connection has been closed by the local application, the remote peer has not yet acknowledged the close, and the system is waiting for it to close its half of the connection.
* FIN_WAIT_2:  The socket connection has been closed by the local application, the remote peer has acknowledged the close, and the system is waiting for it to close its half of the connection.
* TIME_WAIT:  The socket connection has been closed by the local application, the remote peer has closed its half of the connection, and the system is waiting to be sure that the remote peer received the last acknowledgement.

## TOOLS

### netstat: show network status
* -a show the state of all sockets
* -n show network addresses as numbers
* -p (tcp/udp) show statistics about protocol. protocol names are listed in the file /etc/protocols

* listen for socket states change on macos:
* suppose socket PORT is 8124
```bash
while true; do netstat -an -t tcp | grep 8124; sleep 2; done
```

### telnet: client tcp socket
* Network administrators use Telnet commands (e.g., telnet <IP> <port>) to manually check if a specific port on a remote server is open and responding
* Debugging Services: It allows administrators to manually send raw commands to test services like web servers (port 80) or mail servers (port 25)
```bash
telnet localhost 8124
```

### lsof: (List Open Files) is the most effective command to see which apps, scripts, or services are occupying specific network sockets
* Sockets for a specific port:
```bash
lsof -i :8124
```
* All listening and established network connections
```bash
lsof -i -P -n
```
* Only active listening ports (good for checking what servers are running)
```bash
sudo lsof -iTCP -sTCP:LISTEN -n -P
```