const express = require("express")
const router = express.Router()
const multer = require("multer") // <-- 1. Importa o Multer
const eventController = require("../controllers/eventsController")
const authMiddleware = require("../middlewares/authMiddleware")

// <-- 2. Configura o armazenamento em memória e define um limite de 5MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
})

router.get("/public", eventController.getPublicEvents)

// --- ROTAS PÚBLICAS (Sem autenticação) ---
router.get("/", eventController.getEvents)

router.get("/:id", eventController.getEventById)

router.use(authMiddleware)

// --- ROTAS PRIVADAS (Protegidas pelo authMiddleware) ---

// <-- 3. Injeta o middleware upload.single("banner") antes do controller
router.post("/", upload.single("banner"), eventController.createEvent)

// <-- 4. Injeta o middleware aqui também para permitir atualizar a imagem
router.put("/:id", upload.single("banner"), eventController.updateEvent)

router.delete("/:id", eventController.deleteEvent)

// id do evento na url - id do membro no body
router.put("/add-participant/:id", eventController.addParticipantToEvent)

router.put("/remove-participant/:id", eventController.removeParticipantFromEvent)

module.exports = router