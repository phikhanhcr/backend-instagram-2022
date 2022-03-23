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


  public likePost = async (req, res) => {
    const { post_id } = req.body;
    const userId = req.user;
    const targetPost = await PostRepository.checkLikeOrNot(post_id, userId);
    if (targetPost.length > 0) {
      return res.status(400).json({ msg: "You liked this user." });
    } else {
      const checkPost = await PostRepository.get(post_id);
      checkPost.like_count++;
      checkPost.like_list.push(userId);
      await checkPost.save();
      return res.status(200).json({ msg: "oke", action: "like" });
    }
  }

  public unlikePost = async (req, res) => {
    const { post_id } = req.body;
    const userId = req.user;
    const targetPost = await PostRepository.checkLikeOrNot(post_id, userId);

    if (targetPost.length > 0) {
      targetPost[0].like_count--;
      targetPost[0].like_list = targetPost[0].like_list.filter(ele => ele.toString() !== userId);
      await targetPost[0].save();
      return res.status(200).json({ msg: "oke", action: "unlike" });
    } else {
      return res.status(400).json({ msg: "You have not liked this user yet!!!" });
    }
  }


}

const PostController = new Post();

export default PostController;
