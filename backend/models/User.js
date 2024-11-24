const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  reviews: [
    {
      givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      review: {
        type: String,
      },
      rating: {
        type: Number,
      },
    },
  ],
  /* This credit system is temporary as the the data on the website will grow we will add the credit prediction using AI algorithm */
  credit: {
    type: Number,
    default: () => (Math.random() * (3 - 1.5) + 1.5).toFixed(2),
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
