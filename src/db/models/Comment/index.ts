// tslint:disable-next-line:no-var-requires
const mongoose = require("mongoose");
const validator = require("validator");

const Schema: any = mongoose.Schema;
const commentSchema: any = new Schema(
  {
    post_id: {
      type: String,
      required: true
    },
    user_commented_id: { type: mongoose.Schema.ObjectId, ref: "User" },
    username: {
      type: String,
      trim: true
    },
    avatar: { type: String },
    content: {
      type: String,
      trim: true,
      required: true
    },
    like_count: { type: Number, default: 0 },
    comment_replied_count: { type: Number, default: 0 },

    comment_replied: [{ // reply comment _id, cmt lv2, lv3 has no item
      comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
      user_id: { type: mongoose.Schema.ObjectId, ref: "User" },
      username: {
        type: String,
        trim: true
      },
      avatar: { type: String },
      reply_to: { // reply to comment _id
        user_id: {
          type: String,
          trim: true
        },
        username: {
          type: String,
          trim: true
        },
      },
    }],
    // reply_to comment id, if === "" => comment lv1, if not, comment lv2
    // filter lv1
    reply_to: { // reply to comment _id
      type: String,
      required: false
    },

  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

commentSchema.index({ post_id: 1 })

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;


// comment level 1

// comment level 2, reply comment level 1 ,

// comment level 3, reply comment level 2