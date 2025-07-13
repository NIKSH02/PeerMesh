import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "../src/routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server); 

app.set("port", process.env.PORT || 8000); 
app.use(cors()); 
app.use(express.json({limit: "40kb"}))
app.use(express.urlencoded({limit: "40kb", extended: true}))

app.use("/api/v1/users", userRoutes)


app.get("/hume", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  const connectionDB = await mongoose.connect( 
    "mongodb+srv://nikhilsharma0437:dj0V8xg44df14kJQ@cluster1.tfp4c7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
  );
  console.log(`MONGO Connected to DB Host : ${connectionDB.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("Listening to port 8000");
  });
};

start();
