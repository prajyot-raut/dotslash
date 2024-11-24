const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const app = express();
const Auth = require("./routes/auth");
const Profile = require("./routes/profile");
const Transactions = require("./routes/transactions");
const Orders = require("./routes/orders");
const Services = require("./routes/services");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/fxp")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use(
  cors({
    origin: "http://localhost:3001", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(
  session({
    secret: "dotslashscreat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

app.use("/auth", Auth);
app.use("/profile", Profile);
//app.use("/transactions", Transactions);
app.use("/orders", Orders);
app.use("/services", Services);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
