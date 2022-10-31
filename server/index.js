const 
    Message = require("./models/Message")
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    PORT = process.env.PORT || 5000;

/**
 * ================================= Mongoose ========================================
 */

mongoose.connect(
    `mongodb+srv://jonG:GosoJbcx2jxdojXW@application.h00aiy3.mongodb.net/Data`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)
.then(
    console.log("\n\tConnected to mongoDB")
)
.catch(error => console.log("Error: ", error))

/* ------------------------------ */

// Listen for changes to Messages model in DB

let tempNewMessageObj = undefined
const messageEventEmitter = Message.watch()

messageEventEmitter.on("change", (change => {
    tempNewMessageObj = change.fullDocument
    console.log(tempNewMessageObj)
}))


/**
 * ================================= Express ========================================
 */

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("../client/public"))


app.get("/", (req, res) => {
    res.render("index.html")
})

app.get("/loadmessages", (req, res) => {
    Message.find({})
    .then(data => res.json(data))
})

app.get("/newmessage", (req, res) => {
    let data = tempNewMessageObj
    res.json(data)
})

app.get("/test", (req, res) => {
    res.json({test: "this is a json test string"})
})

app.post("/", (req, res) => {

    const newMessage = new Message({
        message: req.body.message,
    })

    newMessage.save().then(() => console.log("\nSuccessfully saved message..."))
})

app.listen(PORT, () => console.log(`\n\tListening: http://localhost:${PORT}\n`))

