const admin = require("firebase-admin");
require("dotenv").config(); // Garante que as variáveis do .env sejam lidas

// Configura as credenciais de acesso do Admin SDK
const serviceAccount = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  // Substitui as quebras de linha literais caso dê erro de formatação
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), 
};

// Inicializa o app do Firebase (apenas se já não tiver sido inicializado)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET // O link do seu "balde" de arquivos
  });
}

// Pega a instância do Storage
const bucket = admin.storage().bucket();

// Exporta o bucket para ser usado nos controllers/routers
module.exports = { bucket };