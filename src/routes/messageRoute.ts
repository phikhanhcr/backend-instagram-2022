import { MessageRepository } from "../db/repositories";
import { checkAuthentication } from "../middleware/checkAuthentication"

let messageRouter = (route, app) => {

  // get my 
  route.get("/", async (req, res) => {
    res.send(req.user);
  })

  // create new message
  route.post("/create", async (req, res) => {
    const userId = req.user;
    const { conversationId, message, file } = req.body;
    // validate file 
    await MessageRepository.create({
      sender: userId,
      conversationId,
      message,
      file: file ? file : null
    })
    res.send({ message: "oke" })
  })

  route.get("/get-messages/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    const data = await MessageRepository.getMyMessage(conversationId);
    return res.status(200).json(data);
  })

  route.get('/get-more-messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const { lastMessageDate } = req.body; 
    // console.log(new Date('2022-04-10T12:21:43.232Z').toISOString())
    const data = await MessageRepository.getMoreMessage(conversationId, lastMessageDate)
    return res.status(200).json(data);
  })

  return app.use("/api/messages", checkAuthentication, route);
}

export {
  messageRouter
}
