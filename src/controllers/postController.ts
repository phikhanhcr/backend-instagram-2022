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
      userId,
    });
    return res.status(200).json(data);
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
    console.log({ userId })
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
    const specificPost = await PostRepository.get(req.params.post_id)
    return res.status(200).json(specificPost);
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

  public getMyPost =  async (req, res) => {
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

    const myPost = await PostRepository.getMyPost(userId);
    return res.status(200).json(myPost);

  }
}

const PostController = new Post();

export default PostController;
