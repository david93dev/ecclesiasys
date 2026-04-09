const express = require("express")
const router = express.Router()
const ministryController = require("../controllers/ministryController")
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)

router.get("/", ministryController.getMinistries)

router.get("/:id", ministryController.getMinistriesById)

router.post("/", ministryController.createMinistry)

router.put("/:id", ministryController.updateMinistry)

router.delete("/:id", ministryController.deleteMinistry)

router.put("/add-member/:id", ministryController.addMemberToMinistry)

router.put("/remove-member/:id", ministryController.removeMemberFromMinistry)

//passa o id do ministério
router.get("/member/:id", ministryController.getMinistriesMembers)

module.exports = router