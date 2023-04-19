import handlebars from "handlebars";

export const TOPIC_USER_GLOBAL = handlebars.compile(
  "global/user/{{user_id}}/post_action"
);

// action  on post
// like, comment,
