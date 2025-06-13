import { Server } from "socket.io";

let connections = {};
let messages ={};
let timeOnline = {};


export const connectToSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    
    socket.on("join-room", (path) => {
      
      if ( connections[path] === undefined ) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date().getTime();

      // connections[path].forEach( elem => {
      //   io.to(elem.emit("user-joined ", socket.id, connections[path]));
      // })
      for ( let i = 0 ; i < connections[path].length ; i++ ) {
        //if ( connections[path][i] !== socket.id ) {
          io.to(connections[path][i]).emit("user-joined", socket.id, connections[path]);
          console.log(`User ${socket.id} joined room ${path}`);
        //}
      }

      if ( messages[path] === undefined ) {
        for (let i = 0 ; i < connections[path].length ; i++ ) {
          io.to(socket.id).emit("chat-message", messages[path][i]['data'],
            messages[path][i]['sender'], messages[path][i]['socket-id-sender']
          )
        }
      }

    })

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal",socket.id, message);
      console.log(`Signal sent from ${socket.id} to ${toId}`);
    });

    socket.on("chat-message", (data, sendet) => {
  
    }) 

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error: ${error}`);
    });
  })


  return io;
};
