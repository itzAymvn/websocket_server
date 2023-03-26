# WebSocket Server

This is a websocket server written in [Node.js](http://nodejs.org/). It's used to receive messages and broadcast them to all connected [clients]()

## Requirements

-   [Node.js](http://nodejs.org/)
-   [npm](https://npmjs.org/)

## Installation

1. Clone the repository
2. Run `npm install` to install all dependencies
3. Run `node server.js` to start the server (If you're willing to edit the code, use the --watch flag to restart the server on every change)

\*Running the server will open a websocket server on port 8082. You can change this in the server.js file.

## Usage

The server will broadcast every message it receives to all connected clients. The message will be a JSON object with the following structure:

    ```json
    {
        "type": "message" / "connection" / "disconnection",
        "data": {
            "content": {
                "id": "123",
                "name": "Aymvn",
                "message": "Hello World!",
                "timestamp": 123456789
            }
        }
    }
    ```
