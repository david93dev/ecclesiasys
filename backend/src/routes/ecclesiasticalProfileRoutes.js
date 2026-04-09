const express = require("express")
const router = express.Router()
const ecclesiasticalProfileController = require("../controllers/ecclesiasticalProfileController")
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)

router.get("/", ecclesiasticalProfileController.getProfiles)

router.get("/member/:memberId", ecclesiasticalProfileController.getProfileByMemberId)

router.get("/:id", ecclesiasticalProfileController.getProfileById)

router.post("/", ecclesiasticalProfileController.createProfile)

router.put("/:id", ecclesiasticalProfileController.updateProfile)

router.delete("/:id", ecclesiasticalProfileController.deleteProfile)




module.exports = router