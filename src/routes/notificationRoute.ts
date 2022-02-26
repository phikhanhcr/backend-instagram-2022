import { checkAuthenticationAndReturnUserId } from '../utils/isAuthenticated'
import { NotificationRepository, UserRepository } from '../db/repositories'

let notificationRouter = (route, app) => {

  route.get("/notification", async (req, res) => {
    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const data = await NotificationRepository.getMyNotify(userId);
    return res.status(200).json(data)
  })

  route.delete("/notification", async (req, res) => {
    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const data = await NotificationRepository.deleteAll(userId);
    return res.status(200).json(data)
  })

  route.post("/notification", async (req, res) => {
    const userId = await checkAuthenticationAndReturnUserId(req, res);
    const { receiver, type, rootContent } = req.body;
    const receiverUser = await UserRepository.get(receiver);

    if (!receiverUser) {
      return res.status(500).json({
        message: "User doesn't exist"
      })
    }

    const newNotification = await NotificationRepository.create({
      sender: userId,
      receiver,
      type,
      rootContent: rootContent ? rootContent : null
    })

    const returnNotify = await NotificationRepository.get(newNotification._id);
    return res.status(200).json(returnNotify)

  })


  route.post("/notification/markAllRead", async (req, res) => {

    const userId = await checkAuthenticationAndReturnUserId(req, res);
    await NotificationRepository.markAllRead(userId);
    return res.status(200).json({ message: "oke" })

  })

  return app.use("/api", route);
}

export {
  notificationRouter
}
