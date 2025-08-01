const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./Models/chat.js");
const methodOverride = require("method-override"); //overrequest put ke jiga delete bejni h to use krna h

const ExpressError = require("./ExpressError");


app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));//ya post ka data ko read krna ka lya hota h
app.use(methodOverride("_method"));


// let chat1 = new Chat({  //Models/chat.js file me iska schema h or ya save ke rhe h
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheets",
//     created_at: new Date()
// });

// chat1.save()    
//     .then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     });


main().then(() => {
    console.log("connection seccessful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb+srv://delta-student:Manishnainway2002@cluster0.ytj0fur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
};

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
// };

// index.ejs route1
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();                 
    console.log(chats);
    res.render("index.ejs", { chats });
});

// new.ejs route 2
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");                     
});

// store data mongo db 
app.post("/chats",(req, res) => {             
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,                              
        created_at: new Date(),
    });
    newChat.save().then
        ((res) => {
            console.log("shat was saved");
        }).catch((err) => {
            console.log(err);
        });
    res.redirect("/chats");
});

// new show route 4
app.get("/chats/:id", async (req, res, next) => {
    let { id } = req.params;//
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
})

app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});

//updete 

app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true });
    // console.log(updateChat);
    res.redirect("/chats");
})

app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedchat = await Chat.findByIdAndDelete(id);
    // console.log(deletedchat);
    res.redirect("/chats");
})
app.get("/", (req, res) => {
    res.send("root is working");                  // ya 1 route h 
});

app.use((err, req, res, next) => {
    let { status = 500, message = "some Error occurred" } = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is Listening on port 8080");
});