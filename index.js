const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const PORT = process.env.port || 3001;
// Connect To DB
dotenv.config();
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(
  mongoDb,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return;
    }
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://joey-red.github.io/music-with-friends-front-end/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  app.post("/api/v1/token", (req, res, next) => {
    console.log(req, res);
    res.send("completed");
  });
  socket.on("send_message", (data) => {
    socket.broadcast.emit("recieve_message", data);
  });
});

server.listen(PORT, () => {
  console.log("Server is running");
});
