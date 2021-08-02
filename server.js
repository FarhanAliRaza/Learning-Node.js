const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const io = new Server(server);
msgs = [];
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// s8U5d4jaejV##DY
// const dburi = "mongodb://farhan:s8U5d4jaejV##DY@cluster0.lg3je.mongodb.net/test";
const mongoAtlasUri = "mongodb+srv://test:test@learning.pfqmj.mongodb.net/test";
var Message = mongoose.model("Message", {
  usr: String,
  msg: String,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages/", (req, res) => {
	Message.find({}, (err, msgs) => {
		console.log("msgs",  msgs);
		res.send(msgs);
		
	});
  })
app.post("/msg/", (req, res) => {
  console.log(req.body);
  msg = req.body;
  var msg = new Message(req.body);
  msg.save((err) => {
    if (err) 
		sendStatus(500);
	msgs.push(msg);
  	io.emit("newmsg", req.body);

  });
  
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
}
server.listen(8000, () => {
  console.log("listening on *:8000");
});
