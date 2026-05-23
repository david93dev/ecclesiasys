const express = require("express")
const router = express.Router()
const memberController = require("../controllers/memberController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

router.use(authMiddleware)
router.use(roleMiddleware(["admin"]))

router.get("/", memberController.getMembers)

router.get("/:id", memberController.getMemberById)

router.post("/", memberController.createMember)

router.put("/:id", memberController.updateMember)

router.delete("/:id", memberController.deleteMember

)
module.exports  = router