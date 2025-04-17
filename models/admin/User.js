import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 1,    
      maxlength: 100,
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
    shiftStart: {
      type: String,
      required: [true, "Shift start time is required"],
    },
    shiftEnd: {
      type: String,
      required: [true, "Shift end time is required"],
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
