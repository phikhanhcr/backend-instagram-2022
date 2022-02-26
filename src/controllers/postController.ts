import { PostRepository } from "../db/repositories"
import { getUserIdFromReq, isAuthenticated } from '../utils/isAuthenticated';
class Post {

  public createPost = async (req, res) => {
    const { description, images, tags, type, with_other } = req.body;
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
    // get following user 
    const data = await PostRepository.create({
      description: description ? description : "",
      images,
      tags: tags ? tags : [],
      type: type ? type : "post",
      with_other: with_other ? with_other : [],
      userId
    });
    const findData = await PostRepository.get(data._id);
    return res.status(200).json(findData);
  }

  public getPostNewFeed = async (req, res) => {
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
    // get me 
    // get following user 
    const data = await PostRepository.getPostFollowing(userId);
    return res.status(200).json(data);
    // getPostFollowing(me);

    // get post by userId

  }

  public getSpecificPost = async (req, res) => {
    // get post by userId
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
    const postId = req.params.post_id
    if (postId.match(/^[0-9a-fA-F]{24}$/)) {
      const specificPost = await PostRepository.get(postId)
      return res.status(200).json(specificPost);
    }

  }

  public getPostByType = async (req, res) => {
    // get post by userId
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

    // view others post
    const { user_id } = req.body;

    const specificPost = await PostRepository.getByType({
      userId: user_id ? user_id : userId,
      type: req.params.type
    })
    return res.status(200).json(specificPost);
  }

  public getPostByUserId = async (req, res) => {
    // get post by userId
    console.log("body", req.body)
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

    const data = await PostRepository.getPostsFromUserId(req.body.userId ? req.body.userId : userId);
    console.log({ data })
    return res.status(200).json(data);
  }


}

const PostController = new Post();

export default PostController;
