const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 8082});
const link = `ws://localhost:${wss.address().port}`;
console.log(`Server started at ${link}`);

const connectedClients = new Map();

// Connection
wss.on("connection", (ws) => {
    // Message
    ws.on("message", (message) => {
        try {
            // Parse message
            const data = JSON.parse(message);

            // Connection
            if (data.type === "connection") {
                const clientId = data.content.id;
                const user = connectedClients.get(clientId);

                // Reconnection
                if (user) {
                    console.log(`Client with ID ${clientId} reconnected`);
                    user.connection = ws;
                } else {
                    // New connection
                    console.log(`Client with ID ${clientId} connected`);
                    connectedClients.set(clientId, {
                        id: clientId,
                        name: data.content.name,
                        created_at: data.content.created_at,
                        connection: ws,
                    });
                }

                // Send current number of connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: "connected_users",
                                content: connectedClients.size,
                            })
                        );
                    }
                });
            } else if (data.type === "message") {
                broadcastMessage(data);
            }
        } catch (error) {
            console.error(error);
            ws.send(
                JSON.stringify({
                    type: "error",
                    content: "Invalid message format",
                })
            );
        }
    });

    // Disconnection
    ws.on("close", () => {
        // Remove client from connected clients
        for (const [clientId, user] of connectedClients) {
            // If the client is the one that disconnected
            if (user.connection === ws) {
                // Remove client from connected clients and log disconnection
                connectedClients.delete(clientId);
                console.log(`Client with ID ${clientId} disconnected`);

                // Send current number of connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                type: "connected_users",
                                content: connectedClients.size,
                            })
                        );
                    }
                });

                break;
            }
        }
    });
});

// Broadcast message to all connected clients
function broadcastMessage(data) {
    for (const [, user] of connectedClients) {
        if (user.connection.readyState === WebSocket.OPEN) {
            user.connection.send(JSON.stringify(data));
        }
    }
}
