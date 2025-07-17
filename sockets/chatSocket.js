import http from "http"
import {Server} from "socket.io"

export const chatEvents = (app) => {



let onlineUserArray = {};

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
      origin: process.env.CLIENT_ORIGIN, // ✅ from env // The frontend URL that you want to allow
      methods: ['GET', 'POST'],        // Allow GET and POST methods
      allowedHeaders: ['Content-Type'], // Allow specific headers
      credentials: true,                // Allow credentials (cookies, etc.)
    }
  })

io.on("connection",(socket)=>{
    

  console.log('Client connected:', socket.id);
    socket.on('updateConnectStatus', (data) => {
      if(data.status == "online" && data.userData){
        
       const {email ,userName} = data.userData 

        if(onlineUserArray?.[email]){
          onlineUserArray[email].socketId = socket.id
        }else{
          onlineUserArray[email] = {email,userName,socketId:socket.id}
        }

      
        
      }else if(data.status == "offline" && data.userData){
       

      }
      console.log("user active",Object.values(onlineUserArray))
      io.emit('onlineUserListUpdate', { userList: Object.values(onlineUserArray) });

    });

    socket.on("sendMessage",(data)=>{
      console.log(data)
      console.log(onlineUserArray)
      const {message, partnerId ,email} = data
      

      socket.to(partnerId).emit("incomingMessage", {
        from: socket.id,
        email: email,
        message: message,
      });
    })
  })


return server



}

