require("dotenv").config()

const app = require("./app")
const connectDB = require("./config/database")

connectDB()

const PORT = process.env.PORT || 3000

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`)
// })

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});