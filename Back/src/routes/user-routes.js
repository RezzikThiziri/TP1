const express = require("express");
const router = express.Router();

const UserCtrl = require("../Controlleur/userControlleur");
const { authenticate } = require("../authMiddleware/authMiddleware");

router.post("/inscription", UserCtrl.inscription);

router.post("/connexion", UserCtrl.connexion);

router.get("/profile", authenticate, UserCtrl.getProfile);

module.exports = router;
