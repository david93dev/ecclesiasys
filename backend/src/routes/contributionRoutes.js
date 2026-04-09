const express = require("express")
const router = express.Router()
const contributionController = require("../controllers/contributionController")
const authMiddleware = require("../middlewares/authMiddleware")

router.use(authMiddleware)

router.get("/", contributionController.getContributions)

router.get("/:id", contributionController.getContributionsById)

router.post("/", contributionController.createContribution)

router.put("/:id", contributionController.updateContribution)

router.delete("/", contributionController.deleteContribution)

module.exports = router