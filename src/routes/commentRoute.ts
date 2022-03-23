import { CommentController } from "../controllers";
import { checkAuthentication } from '../middleware/checkAuthentication'
let commentRouter = (route, app) => {
  // get comment by post_id 
  // oke
  route.get("/comment/post/:post_id", checkAuthentication, CommentController.getCommentByPost)

  // get replied comment
  // oke
  route.get("/comment/replied/:comment_root_id", checkAuthentication, CommentController.getRepliedCommentByRootComment)

  // create comment
  // oke
  route.post("/comment/create", checkAuthentication, CommentController.createComment)


  return app.use("/api", route);
}

export {
  commentRouter
}
