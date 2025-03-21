import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    }, 
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    role: {
      type: String,
      enum: ["Reception", "Kitchen", "Admin"],
      required: [true, "Role is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Away"],
      default: "Active",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: function () {
        return this.name
          ? this.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
