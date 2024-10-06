const { Server } = require("socket.io");

const io = new Server(8000,{
  cors:true,
});

let emailtosocketid = new Map();
//to get then email from socket id
const socketidtoemail = new Map();

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on("room:join",(data)=>{

      const {email,roomid} = data
emailtosocketid.set(email,socket.id);
socketidtoemail.set(socket.id,email);
io.to(roomid).emit("user:joined", {email, id: socket.id});
socket.join(roomid);
io.to(socket.id).emit("room:join",data);
    })
    socket.on("user:call", ({to,offer})=>{
      io.to(to).emit("incoming:call", {from:socket.id,offer});
    })
    socket.on("call:accepted", ({to,ans})=>{
      io.to(to).emit("call:accepted",{from:socket.id,ans});
    })
  
    socket.on("peer:nego:needed", ({to,offer})=>{
      io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
    })
    socket.on("peer:nego:done", ({to,ans})=>{
      console.log(ans);
      io.to(to).emit("peer:nego:final",{from:socket.id,ans});
    })
  });