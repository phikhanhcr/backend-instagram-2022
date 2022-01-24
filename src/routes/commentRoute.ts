import { CommentController } from "../controllers";

let commentRouter = (route, app) => {
  // get comment by post_id 
  // oke
  route.get("/comment/post/:post_id", CommentController.getCommentByPost)

  // get replied comment
  // oke
  route.get("/comment/replied/:comment_root_id", CommentController.getRepliedCommentByRootComment)

  // create comment
  // oke
  route.post("/comment/create", CommentController.createComment)


  return app.use("/api", route);
}

export {
  commentRouter
}
