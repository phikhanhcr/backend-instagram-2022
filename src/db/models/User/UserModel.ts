// tslint:disable-next-line:no-var-requires
const mongoose = require("mongoose");
const validator = require("validator");
const Schema: any = mongoose.Schema;

export enum UserType {
  USER = "User",
}

const userSchema: any = new Schema(
  {
    address: {
      city: {
        default: "",
        type: String,
        trim: true,
      },
      district: {
        default: "",
        type: String,
        trim: true,
      },
      ward: {
        default: "",
        type: String,
        trim: true,
      },
      detail: {
        default: "",
        type: String,
        trim: true,
      },
    },
    avatar: {
      default:
        "https://lh3.googleusercontent.com/proxy/XdcnQDfY4KMzHRA1FueHzVIEYmR2-JDm7r6Q_PMuZTFBlwIWNynTjcs1c_aerZcm3uc7xArupf0M6_F-Ao5qrqu45FoheQwzV8n-c5y46Osx2ScMlIQhHch7VSD6C3Nj7oG7gG7C3kui37fLlwxmWA",
      type: String,
    },
    birthday: {
      default: "",
      type: Date,
    },
    gender: {
      default: "hidden",
      type: String,
      enum: ["male", "female", "unknown", "hidden"],
    },
    username: {
      default: "",
      type: String,
      trim: true,
      require,
      unique: true,
    },
    spam: {
      type: Number,
      default: 0,
    },
    user_config: {
      private_account: {
        default: false,
        type: Boolean,
      },
    },
    user_status: {
      type: String,
      trim: true,
      enum: ["banned", "deleted", "new", "confirmed"],
      default: "new",
    },
    online_status: {
      type: String,
      trim: true,
      enum: ["online", "away", "offline", "busy", "hidden"],
      default: "offline",
    },

    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    email: {
      default: "",
      type: String,
      trim: true,
      unique: true,
      require,
    },
    password: {
      default: "",
      type: String,
      trim: true,
    },
    password_old: {
      default: "",
      type: String,
      trim: true,
    },
    is_active: {
      default: false,
      type: Boolean,
    },
    verify_token: {
      default: "",
      type: String,
      trim: true,
    },
    facebook: {
      email: {
        default: "",
        type: String,
        trim: true,
      },
      token: {
        default: "",
        type: String,
        trim: true,
      },
      uid: {
        default: "",
        type: String,
        trim: true,
      },
    },
    google: {
      email: {
        default: "",
        type: String,
        trim: true,
      },
      token: {
        default: "",
        type: String,
        trim: true,
      },
      uid: {
        default: "",
        type: String,
        trim: true,
      },
    },
    apple: {
      apple_id: {
        default: "",
        type: String,
        trim: true,
      },
      apple_sub: {
        default: "",
        type: String,
        trim: true,
      },
    },
    // posts were saved
    post_saved: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.index({ username: "text" });
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
