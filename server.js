require("dotenv").config();
const {testConnection} = require("./src/config/database");
testConnection();
const express = require("express");
const moduleRoutes = require("./src/routes/moduleroutes");
const authRoutes = require("./src/routes/authroutes");
const profRoutes =require("./src/routes/profroutes")
const reportRoutes=require("./src/routes/reportroutes")
const userRoutes=require("./src/routes/userroutes")

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/modules", moduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/file",profRoutes);
app.use("/api/report",reportRoutes);
app.use("/api/user",userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server listing on port ${PORT}`);
});