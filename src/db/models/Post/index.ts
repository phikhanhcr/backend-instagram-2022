// tslint:disable-next-line:no-var-requires
const mongoose = require("mongoose");
const validator = require("validator");
const Schema: any = mongoose.Schema;

const postSchema: any = new Schema(
  {
    // owner
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    // details
    description: {
      default: "",
      type: String,
      trim: true
    },
    images: [{
      type: String
    }],
    spam: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true
    }],

    // saved and tagged wil
    type: {
      type: String,
      enum: ['reels', 'post', 'video'],
      default: "post"
    },
    with_other: [{
      userId: { type: mongoose.Schema.ObjectId, ref: "User" },
      username: { type: String },
      avatar: { type: String },
      url: { type: String }
    }],

    // like and comment
    like_count: { type: Number, default: 0 },
    like_list: [{
      type: mongoose.Schema.ObjectId, ref: "User"
    }],
    comment_count: { type: Number, default: 0 },
    allow_comment: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postSchema.index({ description: "text" })
postSchema.index({ username: 1 })

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
