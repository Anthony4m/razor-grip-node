const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const formatMessages = require('./utils/messages');
const { MongoClient } = require('mongodb');
const Chat = require('./models/chats')
const mongoose = require('mongoose');
dotenv.config()
const uri = `mongodb+srv://${process.env["DB_USERNAME"]}:${process.env["DB_PASSWORD"]}@razorgrip.ypazk.mongodb.net/razorgrip?retryWrites=true&w=majority`;
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(uri,connectionParams)
    .then( (result) => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

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

//mongodb sandbox
app.get("/add-chat",(req,res)=>{
   const chat = new Chat({
       sender: 'icod',
       recipient: 'Anthony',
       text: 'message from sandbox'
   })
    chat.save()
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err)
        })
});

app.get("/all-chat",(req,res)=>{
    Chat.find()
        .then((result)=>{
            res.send(result)
        })
        .catch((error)=>{
            console.log(error)
        })
})

//runs when a user connects
io.on('connection',socket =>{
    const id = socket.handshake.query.sendor;
    socket.join(id)

    socket.on('send-message',({recipients, text})=>{
        recipients.forEach(recipient=>{
            const newRecipients = recipients.filter(receiver=>receiver !== recipient)
            newRecipients.push(id)
            const chat = new Chat({
                sender: id,
                recipient: newRecipients,
                text: text
            })
            chat.save()
                .then((result)=>{
                    socket.broadcast.to(recipient).emit('received-message',{
                        recipients: result.recipient,sender:result.sender,text:result.text
                    })
                    console.log(result.sender,result.text)
                })
                .catch((err)=>{
                    console.log(err)
                })
            // socket.broadcast.to(recipient).emit('received-message',{
            //     recipients: newRecipients,sender:id,text
            // })
        })
    })
})


server.listen(PORT, ()=>{
    console.log(`connected on port ${PORT}`)
})