import { Router } from 'express'
const messageController = Router(); 
messageController.post("/health", async (req, res, next) => {
    return res.status(200).json({ message: "message is heakthy"
        })
})



export default messageController