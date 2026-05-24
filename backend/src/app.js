const express = require("express")
const cors = require("cors")

const memberRoutes = require("./routes/memberRoutes")
const ministryRoutes = require("./routes/ministryRoutes")
const contributionRoutes = require("./routes/contributionRoutes")
const eventRoutes = require("./routes/eventRoutes")
const ecclesiasticalProfileRoutes = require("./routes/ecclesiasticalProfileRoutes")
const authRoutes = require("./routes/authRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://ecclesiasys.vercel.app",
    "http://localhost:8081"
  ],
  credentials: true
}))

app.use(express.json())

app.use("/member", memberRoutes)
app.use("/ministry", ministryRoutes)
app.use("/contribution", contributionRoutes)
app.use("/event", eventRoutes)
app.use("/profile", ecclesiasticalProfileRoutes)
app.use("/auth", authRoutes)
app.use("/painel-dashboard", dashboardRoutes)

app.get("/", (req, res) => {
    res.send("Projeto rodando!")
})

module.exports = app