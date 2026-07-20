const express = require("express");
const router = express.Router();


const { chat } = require("../controller/chatController");
const { stream } = require("../controller/streamController");

router.post("/", chat);
router.post("/stream", stream);


module.exports = router;