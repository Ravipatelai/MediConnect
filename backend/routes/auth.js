const express = require("express");
const router = express.Router();
const { registerUser, logOut, loginUser, firebaseLogin } = require("../controllers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post('/firebase-login', firebaseLogin)
router.get("/logout", logOut);

module.exports = router;
