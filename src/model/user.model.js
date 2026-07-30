const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating an account"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;