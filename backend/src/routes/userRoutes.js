const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/", userController.getAllUsers)
router.delete("/:id", userController.deleteUser)
router.put("/:id", userController.updateUser)
router.post("/", userController.createUser)

module.exports = router