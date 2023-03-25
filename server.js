const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 8082});
let connectedClients = [];

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        // Client sent a connection
        if (data.type === "connection") {
            // connectedClients.push(data.content);
            // console.log(`Client with ID ${data.content.id} connected`);
            if (
                !connectedClients.find(
                    (client) => client.id === data.content.id
                )
            ) {
                connectedClients.push(data.content);
                console.log(`Client with ID ${data.content.id} connected`);
            } else {
                console.log(
                    `Client with ID ${data.content.id} already connected`
                );
            }
        }

        // Client sent a message
        if (data.type === "message") {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }

        // Client sent a disconnection
        if (data.type === "disconnection") {
            connectedClients = connectedClients.filter(
                (client) => client.id !== data.content.id
            );
            console.log(`Client with ID ${data.content.id} disconnected`);
        }
    });
});

// setInterval(() => {
//     console.log(connectedClients);
// }, 1000);
