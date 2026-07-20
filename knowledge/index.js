const companyInfo = require("./companyInfo");
const faqs = require("./faqs");
const products = require("./products");
const policies = require("./policies");
const tradingGuides = require("./tradingGuide");

module.exports = `
${companyInfo}

${products}

${faqs}

${policies}

${tradingGuides}

`;