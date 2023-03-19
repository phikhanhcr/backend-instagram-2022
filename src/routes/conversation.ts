import { checkAuthentication } from "../middleware/checkAuthentication";
import { ConversationRepository } from "../db/repositories";

let conversationRouter = (route, app) => {
  route.post("/conversation/create", checkAuthentication, async (req, res) => {
    const { name, receiverId } = req.body;
    const userId = req.user;
    const newConversation = await ConversationRepository.create({
      name,
      members: [receiverId, userId],
    });
    return res.status(200).json({ message: "oke" });
  });

  route.get("/conversation/get", checkAuthentication, async (req, res) => {
    const data = await ConversationRepository.getMyConversation(req.user);
    return res.status(200).json(data);
  });

  route.get(
    "/conversation/remove/:conversationId",
    checkAuthentication,
    async (req, res) => {
      await ConversationRepository.delete(req.params.conversationId);
      return res.status(200).json({ message: "oke" });
    }
  );

  return app.use("/api", route);
};

// when user select other user to send message, create a conversation,
// if the message count === 0, remove this.

export { conversationRouter };
