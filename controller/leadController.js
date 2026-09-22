const newLeads = require("../models/Lead.Model");

// Same mobile number or email = same lead. Email only counts when it is filled,
// otherwise every lead submitted without an email would match the first one.
const findDuplicateLead = async (leadPhone, leadEmail) => {
  const duplicateFilters = [{ phone: leadPhone }];
  if (leadEmail) {
    duplicateFilters.push({ email: leadEmail });
  }

  return newLeads.findOne({ $or: duplicateFilters });
};

const duplicateLeadResponse = (existingLead, leadPhone) => {
  const isSamePhone = existingLead.phone === leadPhone;

  return {
    success: false,
    duplicate: true,
    field: isSamePhone ? "phone" : "email",
    message: isSamePhone
      ? "We have already received your request with this mobile number. Our team will contact you shortly."
      : "We have already received your request with this email. Our team will contact you shortly.",
  };
};

// 1. Create a new Lead
exports.createLead = async (req, res) => {
  try {
    const {
      fullName,
      name,
      phone,
      mobile,
      email,
      city,
      marketSegment,
      referralcode,
      status,
    } = req.body;

    const leadPhone = (phone || mobile || "").trim();
    const leadEmail = (email || "").trim().toLowerCase();

    if (!leadPhone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    // Reject a second lead for the same mobile number or email
    const existingLead = await findDuplicateLead(leadPhone, leadEmail);

    if (existingLead) {
      return res.status(409).json(duplicateLeadResponse(existingLead, leadPhone));
    }

    const newLead = new newLeads({
      fullName: fullName || name,
      phone: leadPhone,
      email: leadEmail,
      city,
      marketSegment,
      referralcode,
      status: status || "new",
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (error) {
    console.error("Error creating lead in DB:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create lead",
    });
  }
};

// 2. Get all Leads
exports.getLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 100 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // FIXED: Changed 'Lead' to 'newLeads'
    const leads = await newLeads
      .find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await newLeads.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: leads,
    });
  } catch (error) {
    console.error("Error in getLeads:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Get Single Lead by ID
exports.getLeadById = async (req, res) => {
  try {
    // FIXED: Changed 'Lead' to 'newLeads'
    const lead = await newLeads.findById(req.params.id);
    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Update Lead Details or Status
exports.updateLead = async (req, res) => {
  try {
    // FIXED: Changed 'Lead' to 'newLeads'
    const lead = await newLeads.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 5. Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    // FIXED: Changed 'Lead' to 'newLeads'
    const lead = await newLeads.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
