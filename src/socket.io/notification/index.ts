// @ts-nocheck
import { NotificationRepository, PostRepository } from '../../db/repositories'
import NotificationModel from '../../db/models/Notification';
import { addUser, removeUser } from '../../utils/socketUser'
export let clients = {};

let notificationSocket = io => {

  io.on('connection', socket => {
    // get userId
    socket.on("user-init", (data) => {
      addUser(clients, data._id, socket.id);

    })
    socket.on("disconnect", () => {
      removeUser(clients, socket.currentUserId, socket.id);
    })

    socket.on("notify-comment_on_post", async (data) => {

      const post = await PostRepository.get(data.post_id);
      const newNotification = await NotificationRepository.create({
        sender: data.user_commented_id,
        receiver: post.userId._id,
        type: "comment",
        root_content: post._id,
        images: post.images[0]
      })
      const specificNotify = await NotificationModel.findById(newNotification._id).lean();

      if (clients[post.userId._id] && (data.user_commented_id != post.userId._id)) {
        clients[post.userId._id].forEach(e => {
          io.to(e).emit("response-notify-send_notify", specificNotify);
        });
      }
    })

    socket.on("notify-comment_replied_on_post", async (data) => {

      // user A, user B, user C
      // user A owner
      // user B replied user A 
      // => user A will be received a notify, => user B tagged u on a comment
      const post = await PostRepository.get(data.post_id);
      if (post.userId._id.toString() === data.reply_to._id.toString()) {

        const newNotification = await NotificationRepository.create({
          sender: data.user_commented_id,
          receiver: post.userId._id,
          type: "mentioned",
          root_content: post._id,
          images: post.images[0]
        })
        const specificNotify = await NotificationModel.findById(newNotification._id).populate("sender", "username avatar").lean()

        if (clients[post.userId._id] && (data.user_commented_id != post.userId._id)) {
          clients[post.userId._id].forEach(e => {
            io.to(e).emit("response-notify-comment_replied_on_post", specificNotify);
          });
        }
      } else {

        // user B replied user C on userA's post
        // => user A will be received a notify, somebody comment on my post
        // => user C will be received a notify, somebody tagged u on a comment on userA's post       

        const newNotificationSendAuthor = await NotificationRepository.create({
          sender: data.user_commented_id,
          receiver: post.userId._id,
          type: "comment",
          root_content: post._id,
          images: post.images[0]
        })
        const specificNotify = await NotificationModel.findById(newNotificationSendAuthor._id).populate("sender", "username avatar").lean()
        if (clients[post.userId._id] && (data.user_commented_id != post.userId._id)) {
          clients[post.userId._id].forEach(e => {
            io.to(e).emit("response-notify-comment_replied_on_post", specificNotify);
          });
        }

        const newNotificationSendRootComment = await NotificationRepository.create({
          sender: data.user_commented_id,
          receiver: data.reply_to._id,
          type: "mentioned",
          root_content: post._id,
          images: post.images[0]
        })

        if (clients[data.reply_to._id]) {
          const specificNotifySendRootComment = await NotificationModel.findById(newNotificationSendRootComment._id).populate("sender", "username avatar").lean()
          clients[data.reply_to._id].forEach(e => {
            io.to(e).emit("response-notify-comment_replied_on_post", specificNotifySendRootComment);
          });
        }
      }
    })

    socket.on("handle-post-like", async (data) => {
      const { receiver, rootContent, sender } = data;
      const post = await PostRepository.get(data.rootContent._id);

      const newNotification = await NotificationRepository.create({
        sender: sender,
        receiver,
        type: "like",
        root_content: rootContent._id,
        images: rootContent.images[0]
      })

      const specificNotify = await NotificationModel.findById(newNotification._id).populate("sender", 'username avatar').lean();
      if (clients[rootContent.userId._id] && (sender != rootContent.userId._id)) {
        clients[rootContent.userId._id].forEach(e => {
          io.to(e).emit("response-notify-send_notify", specificNotify);
        });
      }
    })

  });
}

export default notificationSocket;


