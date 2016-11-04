const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({server});

SocketServer.prototype.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
    console.log("AFTER BROADCAST: ", data)
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
var usersOnline = 0;
wss.on('connection', (client) => {
  console.log('Client connected');

  client.on('message', function incoming(message) {
    var data = JSON.parse(message);
    data.id = uuid.v1()
    console.log(data)
    switch(data.type) {
      case "message":
      wss.broadcast(data);
      break;
    case "notification":
      wss.broadcast(data);
      break;
    default:
      console.log("Error in processing client request");
      throw new Error("Unknown event type: " + data.type);
    }
  })

  usersOnline += 1;

  wss.broadcast({
    type: 'userCount',
    usersOnline: usersOnline
  });

  client.on('close', () => {
   console.log('Client disconnected');
    usersOnline -= 1;
    wss.broadcast({
        type: 'userCount',
        usersOnline: usersOnline
    })
  })
  });

  // ws.send('something');

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
