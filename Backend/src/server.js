// require("dotenv").config();

// const express = require("express");
// const connectDB = require("./config/db");

// const app = express();

// connectDB();

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("EduOpportunity API is running 🚀");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const connectDB = require("./config/db");

const User = require("./models/User");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", async (req, res) => {

    const users = await User.find();

    res.json(users);

});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});