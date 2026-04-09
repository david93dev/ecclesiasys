const express = require("express")
const router = express.Router()
const eventController = require("../controllers/eventsController")
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)


router.get("/", eventController.getEvents)

router.get("/:id", eventController.getEventById)

router.post("/", eventController.createEvent)

router.put("/:id", eventController.updateEvent)

router.delete("/:id", eventController.deleteEvent)

//id do evento na url - id do membro no body
router.put("/add-participant/:id", eventController.addParticipantToEvent)

router.put("/remove-participant/:id", eventController.removeParticipantFromEvent)

module.exports = router