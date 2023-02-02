import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    file: {
      data: { type: Buffer },
      contentType: { type: String },
      fileName: { type: String }
    },
    message: {
      type: String,
      default: "",
    },
    reaction: {
      type : Boolean,
      default : false
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// MessageSchema.index({ sender: 1})
MessageSchema.index({ conversationId: 1})
const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;
