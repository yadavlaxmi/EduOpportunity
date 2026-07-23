
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const User = require("./models/User");
const organizationRoutes = require("./routes/organizationRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const olympiadRoutes = require("./routes/olympiadRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
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

app
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/olympiads", olympiadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});