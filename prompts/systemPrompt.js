const identity = require("../prompts/identity");
const platforminfo = require("../prompts/platformInfo");
const websiteContext = require("../prompts/website");
const responsibilities = require("../prompts/responsibilities");
const responseStyle = require("../prompts/responseStyle");
const accountOpening = require("../prompts/accountOpening");
const unknownQuestions = require("../prompts/unknownQuestions");
const welcomeMessage = require("../prompts/welcome");
const marginRules = require("../prompts/marginRules");
const tradingRules = require("../prompts/tradingRules");
const brokerage = require("../prompts/brokerage");
const depositeFlow = require("../prompts/depositFlow");
const withdrawalFlow = require("../prompts/withdrawalFlow");
const loginSupport = require("../prompts/loginSupport");
const ordersSupport = require("../prompts/ordersSupport");
const closing = require("../prompts/closing");
const quickReplies = require("../prompts/quickReplies");
const escalation = require("../prompts/escalation");

module.exports = `
${identity}

----------------------------------

${platforminfo}

----------------------------------

${websiteContext}

----------------------------------

${welcomeMessage}

----------------------------------

${marginRules}

----------------------------------

${tradingRules}

----------------------------------

${brokerage}

----------------------------------

${depositeFlow}

----------------------------------

${withdrawalFlow}

----------------------------------

${loginSupport}

----------------------------------

${ordersSupport}

----------------------------------

${escalation}

----------------------------------

${quickReplies}

----------------------------------

${responsibilities}

----------------------------------

${responseStyle}

----------------------------------

${accountOpening}

----------------------------------

${unknownQuestions}

----------------------------------

${closing}

----------------------------------

`;