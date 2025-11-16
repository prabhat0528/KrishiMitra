const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./Routes/user");
const cors = require("cors");
require("dotenv").config();

const app = express();



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database Connected!'));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth",authRoute);

app.get("/", (req, res) => {
  res.send("This is root");
});

app.listen(3000, () => {
  console.log("Server is active!");
});
