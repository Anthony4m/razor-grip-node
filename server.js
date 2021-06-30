const express = require('express');
const http = require('http');
const cors = require('cors');
const PORT = 3001 || process.env.PORT;

const app = express();
app.use(cors());
const options = {
    cors:{
        origin:'*',
    },
}

const server = http.createServer(app);

//oh boy use this or you'll go down a rabbit hole of cors errors
const io = require('socket.io')(server,options);

// app.get("/",req,res)=>{
//     res.send("hello")
// }

//runs when a user connects
io.on('connection',socket =>{
    const id = socket.handshake.query.sendor;
    socket.join(id)

    socket.on('send-message',({recipients, text})=>{
        recipients.forEach(recipient=>{
            const newRecipients = recipients.filter(receiver=>receiver !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('received-message',{
                recipients: newRecipients,sender:id,text
            })
        })
    })
})


server.listen(PORT, ()=>{
    console.log(`connected on port ${PORT}`)
})