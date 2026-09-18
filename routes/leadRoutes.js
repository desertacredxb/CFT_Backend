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
