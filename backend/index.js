const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // Load passport configuration
const app = express();
const Auth = require("./routes/auth");
const Profile = require("./routes/profile");
const Transactions = require("./routes/transactions"); // Corrected import

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/fxp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Middleware
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", Auth);
app.use("/profile", Profile);
app.use("/transactions", Transactions); // Corrected path

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
