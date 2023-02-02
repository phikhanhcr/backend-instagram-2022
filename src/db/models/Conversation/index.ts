import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    name: { type: String },
    memberCount: { type: Number, default: 2, min: 2 },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    avatar : { type: String, default : "http://criticdaily.com/uploads/user-group/default_group.png" },
    messageCount: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// link to consult stack overflow
// https://stackoverflow.com/questions/4059126/how-does-mongodb-index-arrays

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;
