const dns = require("node:dns");

// Force Node to use public DNS servers to resolve MongoDB SRV records on Render
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");
const subscriberRoutes = require("./routes/subscriber.routes");
const popupLeadRoute = require("./routes/popup.routes");
const authRoutes = require("./routes/auth.routes");
const BlogRoute = require("./routes/blog.routes");
const chatRoutes = require("./routes/chatRoutes");
const leadRoutes = require("./routes/leadRoutes");
const marketAIRoutes = require("./routes/marketAI.routes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://v2.mastertrader.co.in",
      "https://www.mastertrader.co.in",
    ],
    credentials: true,
  }),
);

// Routes
app.use("/api", popupLeadRoute);
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/blogs", BlogRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/market-ai", marketAIRoutes);

app.get("/", (req, res) => {
  res.send("API LIVE");
});

const PORT = process.env.PORT || 8000;

// Start server ONLY AFTER MongoDB connects
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database failed to connect, server not started:", err);
    process.exit(1);
  });
