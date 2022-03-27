import { NotificationRepository, UserRepository } from '../db/repositories'
import { checkAuthentication } from '../middleware/checkAuthentication'

let notificationRouter = (route, app) => {

  route.get("/notification", checkAuthentication, async (req, res) => {
    const userId = req.user;
    const data = await NotificationRepository.getMyNotify(userId);
    return res.status(200).json(data)
  })

  route.delete("/notification", checkAuthentication, async (req, res) => {
    const userId = req.user;
    const data = await NotificationRepository.deleteAll(userId);
    return res.status(200).json(data)
  })

  route.post("/notification", checkAuthentication, async (req, res) => {
    const userId = req.user;
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
    // @ts-ignore
    const returnNotify = await NotificationRepository.get(newNotification._id);
    return res.status(200).json(returnNotify)

  })


  route.post("/notification/markAllRead", checkAuthentication, async (req, res) => {

    const userId = req.user;
    await NotificationRepository.markAllRead(userId);
    return res.status(200).json({ message: "oke" })

  })

  route.post("/notification/check-new", checkAuthentication, async (req, res) => {

    const userId = req.user;
    const data = await NotificationRepository.checkNewNotify(userId);
    if(data) {
      return res.status(200).json({ data : true })
    } else {
      return res.status(200).json({ data : false })
    }

  })


  return app.use("/api", route);
}

export {
  notificationRouter
}
