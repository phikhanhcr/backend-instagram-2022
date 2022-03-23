import { PostController } from '../controllers';
import { checkAuthentication } from '../middleware/checkAuthentication'
let postRouter = (route, app) => {

  // create post 
  route.post("/post/create", checkAuthentication, PostController.createPost)

  // get post on new feeds
  route.get("/post/feeds", checkAuthentication, PostController.getPostNewFeed)

  // get specific post 
  // oke
  route.get("/post/one/:post_id", checkAuthentication, PostController.getSpecificPost)

  // get post by type
  // oke
  route.get("/post/type/:type", checkAuthentication, PostController.getPostByType)

  // get post by user id
  // oke
  route.post("/post/posts/user", checkAuthentication, PostController.getPostByUserId)

  // update my post

  // delete my post

  // like :v 

  // report other post

  return app.use("/api", route);
}

export {
  postRouter
}