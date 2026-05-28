const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

router.use(authMiddleware)
router.use(roleMiddleware(["admin"]))

router.get("/", userController.getAllUsers)
router.delete("/:id", userController.deleteUser)
router.put("/:id", userController.updateUser)
router.post("/", userController.createUser)

module.exports = router
