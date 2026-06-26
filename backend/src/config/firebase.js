const path = require("path")
const admin = require("firebase-admin")
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })

const requiredEnvVars = [
  "PROJECT_ID",
  "CLIENT_EMAIL",
  "PRIVATE_KEY",
  "STORAGE_BUCKET",
]

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Variaveis de ambiente do Firebase ausentes no backend/.env: ${missingEnvVars.join(", ")}`
  )
}

const serviceAccount = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  })
}

const bucket = admin.storage().bucket()

module.exports = { bucket }
