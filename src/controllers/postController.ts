import { PostRepository } from "../db/repositories"
class Post {

  public createPost = async (req, res) => {
    const { description, images, tags, type, with_other } = req.body;
  
    const userId = req.user;
   
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
    const userId = req.user;
    // get following user 
    const data = await PostRepository.getPostFollowing(userId);
    return res.status(200).json(data);
    // getPostFollowing(me);

    // get post by userId

  }

  public getSpecificPost = async (req, res) => {
    // get post by userId
    const postId = req.params.post_id
    if (postId.match(/^[0-9a-fA-F]{24}$/)) {
      const specificPost = await PostRepository.get(postId)
      return res.status(200).json(specificPost);
    }

  }

  public getPostByType = async (req, res) => {
    // get post by userId
    const userId = req.user;
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
    const userId = req.user;

    const data = await PostRepository.getPostsFromUserId(req.body.userId ? req.body.userId : userId);
    return res.status(200).json(data);
  }


}

const PostController = new Post();

export default PostController;
