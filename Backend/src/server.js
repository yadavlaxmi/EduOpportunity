// // require("dotenv").config();

// // const express = require("express");
// // const connectDB = require("./config/db");

// // const app = express();

// // connectDB();

// // app.use(express.json());

// // app.get("/", (req, res) => {
// //   res.send("EduOpportunity API is running 🚀");
// // });

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });

// // require("dotenv").config();
// // const cors=require("cors");
// // const authRoutes = require("./routes/authRoutes");
// // const userRoutes = require("./routes/userRoutes");
// // const express = require("express");
// // const connectDB = require("./config/db");

// // const User = require("./models/User");

// // const app = express();

// // connectDB();

// // app.use(express.json());
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true
// //   })
// // );
// // app.use("/api/auth", authRoutes);
// // app.use("/api/users", userRoutes);
// // app.get("/", async (req, res) => {

// //     const users = await User.find();

// //     res.json(users);

// // });

// // const PORT = process.env.PORT || 5005;

// // app.listen(PORT, () => {

// //     console.log(`Server running on http://localhost:${PORT}`);

// // });

// require("dotenv").config();

// const cors = require("cors");
// const express = require("express");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");

// const User = require("./models/User");

// const app = express();

// connectDB();


// // CORS FIRST
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
//   })
// );


// // Handle preflight
// app.options("*", cors());


// app.use(express.json());


// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);


// app.get("/", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });


// const PORT = process.env.PORT || 5005;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const User = require("./models/User");

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});