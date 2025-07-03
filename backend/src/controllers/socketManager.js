import { Server } from "socket.io";

let connections = {};
let messages ={};
let timeOnline = {};


export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: { 
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    },
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {

    console.log("somthing is connected ")
    
    socket.on("join-call", (path) => {
      
      if ( connections[path] === undefined ) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date() //.getTime();

      // connections[path].forEach( elem => {
      //   io.to(elem.emit("user-joined ", socket.id, connections[path]));
      // })

      for ( let i = 0 ; i < connections[path].length ; i++ ) {
        //if ( connections[path][i] !== socket.id ) {
          io.to(connections[path][i]).emit("user-joined", socket.id, connections[path]);
          // console.log(`User ${socket.id} joined room ${path}`);
        //}
      }

      if ( messages[path] !== undefined ) {
        for (let i = 0 ; i < messages[path].length ; ++i ) {
          io.to(socket.id).emit("chat-message", messages[path][i]['data'],
            messages[path][i]['sender'], messages[path][i]['socket-id-sender']
          )
        }
      }

    })

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal",socket.id, message);
      // console.log(`Signal sent from ${socket.id} to ${toId}`);
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    })

    socket.on("chat-message", (data, sender) => {
      
      const [ matchingRoom, found ] = Object.entries(connections)
      .reduce(([room , isFound], [roomKey, roomValue]) => {

        if (!isFound && roomValue.includes(socket.id)) {
          return [roomKey, true ]
        }

        return [room , isFound];
      } , ["", false]);

      if ( found === true) { 
        if ( messages[matchingRoom] === undefined ) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          'sender': sender,
          'data': data,
          'socket-id-sender': socket.id
        })

        // console.log('Message', 'received : ', data, 'from:', sender, 'in room:', matchingRoom);

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });

        for (let i = 0 ; i < connections[matchingRoom].length ; i++ ) {
          io.to(connections[matchingRoom][i]).emit("chat-message", data, sender, socket.id);
        }
      }

    }) 

    socket.on("disconnect", () => {

      var diffTime = Math.abs(timeOnline[socket.id] - new Date())

      var key

      for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

          for (let a = 0; a < v.length; ++a) {
              if (v[a] === socket.id) {
                  key = k

                  for (let a = 0; a < connections[key].length; ++a) {
                      io.to(connections[key][a]).emit('user-left', socket.id)
                  }

                  var index = connections[key].indexOf(socket.id)

                  connections[key].splice(index, 1)


                  if (connections[key].length === 0) {
                      delete connections[key]
                  }
              }
          }

      }


    })

    // socket.on("disconnect", () => {
    //   let diffTime = Math.abs(new Date() - timeOnline[socket.id]);

    //   let key ; 

    //   for ( const [room, users] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

    //     for ( let i = 0 ; i < users.length ; i++ ) {
    //       io.to(users[i]).emit("user-disconnected", socket.id , diffTime);
    //     };

    //     let index = connections[key].indexof(socket.id);
    //     if (index !== -1) {
    //       connections[key].splice(index, 1);
    //     }
    //     if (connections[key].length === 0) {
    //       delete connections[key];
    //       delete messages[key];
    //     }
    //     console.log(`User ${socket.id} disconnected from room ${room}`);
    //   }
    // });

    socket.on("error", (error) => {
      console.error(`Socket error: ${error}`);
    });
  })


  return io;
};
