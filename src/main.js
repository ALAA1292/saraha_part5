import '../config/config.service.js';
import express from "express";
import messageController from './modules/Message/message.controller.js';
import authController from "./modules/Auth/auth.controller.js";
import userController from "./modules/User/user.controller.js";
import connectDB from "./DB/connection.db.js"
import envConfig from './../config/config.service.js';
import globalErrorHandling from './middleware/global-error-handler.middleware.js';
import cors from 'cors'
import { redisConnection } from './Common/Clients/redis.client.js';

const app = express();
//convert buffer data
app.use(cors(), express.json())
app.use(express.json());

connectDB();
redisConnection();
//application routing
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authController);
app.use("/api/user", userController);
app.use("/api/messages", messageController);


//invalid routing
app.use("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});
// console.log(process.env)
//error-handling
app.use(globalErrorHandling);

app.listen(envConfig.port, () => console.log(` app listening on port ${envConfig.port}!`));
