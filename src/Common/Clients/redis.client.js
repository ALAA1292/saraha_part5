//redis connection

import { createClient } from "redis";
import { redisConfig } from "../../../config/redis.config.js";

export const redisClient = await createClient(redisConfig)
  .on("error", (err) => console.log("Redis Client Error", err))


  export const redisConnection= async()=>{
    try {
          await redisClient.connect()
      console.log("redis connection success")

    } catch (error) {
            console.log("redis connection error",error)

    }





}
