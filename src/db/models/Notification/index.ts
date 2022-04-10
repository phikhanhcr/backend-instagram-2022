import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ["like", "comment", "mentioned", "follow"]
    },
    seen: {
      type: Boolean,
      default: false
    },
    // link post, link profile
    root_content: { type: String },
    images: { type: String },
    url_profile: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: { createdAt: "created_at" }
  }
);

NotificationSchema.index({ receiver: 1 })
const NotificationModel = mongoose.model("Notification", NotificationSchema);

export default NotificationModel;