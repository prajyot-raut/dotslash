const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const app = express();
const Auth = require("./routes/auth");
const Profile = require("./routes/profile");
const Transactions = require("./routes/transactions");

mongoose
  .connect("mongodb://localhost:27017/fxp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

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
app.use("/transactions", Transactions);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
