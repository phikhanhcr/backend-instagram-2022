import { CommentRepository, PostRepository, UserRepository } from "../db/repositories"
import { getUserIdFromReq, isAuthenticated } from '../utils/isAuthenticated';

class Comment {

  public createComment = async (req, res) => {
    const { post_id, content, reply_to, comment_root_id } = req.body;
    // check user send request for writing a comment
    if (! await isAuthenticated(req, res)) {
      return res.status(500).send({
        message: "You have to login"
      })
    }

    const userId = await getUserIdFromReq(req);
    if (!userId) {
      return res.status(500).send({
        message: "You have to login"
      })
    }

    const currentUser = await UserRepository.get(userId);

    const checkPost = await PostRepository.get(post_id);
    if (!checkPost) {
      return res.status(500).json({
        message: "Post doesn't exist"
      })
    }

    const newComment = await CommentRepository.create({
      post_id,
      user_commented_id: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content,
      reply_to: reply_to ? reply_to : null,
    })

    // comment level 2;
    if (comment_root_id && comment_root_id !== "") {

      const rootComment = await CommentRepository.get(comment_root_id);

      if (!rootComment) return res.status(500).json({ message: "Comment doesn't exist" })

      // user which is mentioned, is replied
      const repliedUser = await UserRepository.get(reply_to);

      rootComment.comment_replied.push({
        comment_id: newComment._id,
        user_id: newComment.user_commented_id,
        username: newComment.username,
        avatar: newComment.avatar,
        reply_to: {
          user_id: reply_to,
          username: repliedUser.username,
        }
      });
      rootComment.comment_replied_count++;
      await rootComment.save();
    }
    const dataCommentReturn = await CommentRepository.get(newComment._id);
    return res.status(200).json(dataCommentReturn)
  }

  public getCommentByPost = async (req, res) => {

    const data = await CommentRepository.getCommentLv1({
      post_id: req.params.post_id,
    });
    return res.status(200).json({ data })
  }

  public getRepliedCommentByRootComment = async (req, res) => {
    const data = await CommentRepository.getCommentLv2({
      comment_id: req.params.comment_root_id,
    });
    let newData = [];

    for (let i = 0; i < data.length; i++) {
      const comment = await CommentRepository.get(data[i].comment_id);
      newData.push({
        comment_id: data[i]._id,
        user_id: data[i].user_id,
        content: comment.content,
        username: data[i].username,
        avatar: data[i].avatar,
        reply_to: { ...data[i].reply_to }
      })
    }
    return res.status(200).json({ newData })
  }
}

const CommentController = new Comment();

export default CommentController;
