import { redisClient } from "../Clients/redis.client.js"


export const get = (key) => {

    return redisClient.get(key)
}

export const del = (key) => {

    return redisClient.del(key)
}


export const set = ({ key, value, options }) => {

    return redisClient.set(key, value, options)
}

export const ttl = (key) => {

    return redisClient.ttl(key)
}

export const expire = (key, expiresIn) => {

    return redisClient.expire(key, expiresIn)
}


export const calculateTTL=(expiration)=>{
const curretTime=Math.floor(Date.now()/1000) 
return expiration-curretTime
}