import { PostController } from '../controllers';

let postRouter = (route, app) => {

  // create post 
  route.post("/post/create", PostController.createPost)

  // get post on new feeds
  route.get("/post/feeds", PostController.getPostNewFeed)

  // get specific post 
  // oke
  route.get("/post/one/:post_id", PostController.getSpecificPost)

  // get post by type
  // oke
  route.get("/post/type/:type", PostController.getPostByType)

  // get my post 
  // oke
  route.get("/post/my-post", PostController.getMyPost)

  // update my post

  // delete my post

  // like :v 

  // report other post

  return app.use("/api", route);
}

export {
  postRouter
}
