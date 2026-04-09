const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/database")

const app = express()

connectDB()

const memberRoutes = require("./routes/memberRoutes")
const ministryRoutes = require("./routes/ministryRoutes")
const contributionRoutes = require("./routes/contributionRoutes")
const eventRoutes = require("./routes/eventRoutes")
const ecclesiasticalProfileRoutes = require("./routes/ecclesiasticalProfileRoutes")
const authRoutes = require("./routes/authRoutes")

// permite que o back acesse o front - ativando o middleware do CORS
app.use(cors())
// permite que o serv receba JSON nas requisições 
app.use(express.json())

app.use("/member", memberRoutes)
app.use("/ministry", ministryRoutes)
app.use("/contribution", contributionRoutes)
app.use("/event", eventRoutes)
app.use("/profile", ecclesiasticalProfileRoutes)
app.use("/auth", authRoutes)


app.get("/", (req, res)=> {
    res.send("Projeto rodando!")
})

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})