const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controller/leadController");

const newLead = require("../models/Lead.Model");

// Proxy endpoint to handle third-party registration securely without CORS issues
router.post("/register-user", async (req, res) => {
  try {
    const response = await fetch(
      "https://v2.mastertrader.co.in/api/apiUserRegister",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            process.env.MT_AUTH_KEY || "X9dPa4Lm7QvR2nHt8YsK5cZw1FuJ6eGb",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error proxying to 3rd party API:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to connect to registration service",
      });
  }
});

router.post("/", createLead);
router.get("/", getLeads);

router.get("/graph", async (req, res) => {
  try {
    const data = await newLead.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching lead graph data:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;
