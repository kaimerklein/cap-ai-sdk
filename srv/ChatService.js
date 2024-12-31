const cds = require("@sap/cds");

const LOG = cds.log("ChatService", { label: "ChatService" });

let chatFunc = null;

import("./ai-core.mjs").then(({ chat }) => {
  chatFunc = chat;
});

module.exports = class ChatService extends cds.ApplicationService {
  init() {
    return super.init();
  }

  async question(question) {
    console.log("Question:", question);

    const responseContent = await chatFunc(question);

    // const responseContent =
    //   "I am a bot. I am here to help you with your questions. Please ask me anything.";

    LOG.log(responseContent);

    return { answer: responseContent };
  }
};
