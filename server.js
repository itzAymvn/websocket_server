const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 8082});
let connectedClients = [];

// When a client connects
wss.on("connection", (ws) => {
    // When a client sends a message
    ws.on("message", (message) => {
        // Parse the message because it's received as a string (JSON.stringify)
        const data = JSON.parse(message);

        // Client sent a connection
        if (data.type === "connection") {
            const user = connectedClients.find(
                (client) => client.id === data.content.id
            );

            if (user)
                console.log(`Client with ID ${data.content.id} reconnected`);
            else console.log(`Client with ID ${data.content.id} connected`);
        }

        // Client sent a message from the chat
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
