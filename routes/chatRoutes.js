// const express = require("express");
// const router = express.Router();

// const { chat } = require("../controller/chatController");
// const { stream } = require("../controller/streamController");

// router.post("/", chat);
// router.post("/stream", stream);

// module.exports = router;

// routes/chatRoutes.js

const express = require("express");
const {
  handleChatMessage,
  captureLead,
  escalateToHuman,
} = require("../controller/newChatController");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB per file, 5 files max
});

router.post("/query", upload.array("files", 5), handleChatMessage);

// Route: Handle general AI chat queries and function calls
// router.post("/query", handleChatMessage);

// Route: Capture Forex / COMEX lead details with consent
router.post("/lead", captureLead);

// Route: Escalate case to human support agent
router.post("/escalate", escalateToHuman);

module.exports = router;
