const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/auth")
const crisprRoutes = require("./routes/crispr")

app.use("/api/auth", authRoutes)
app.use("/api/crispr", crisprRoutes)

app.get("/api/ping", (req, res) => res.json({ pong: true }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.listen(5000, () => console.log("Server running on port 5000"))