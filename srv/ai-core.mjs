import { AzureOpenAiChatClient } from "@sap-ai-sdk/foundation-models";

const chat = async (question) => {
  const chatClient = new AzureOpenAiChatClient("gpt-4o");

  const response = await chatClient.run({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const responseContent = response.getContent();
  console.log(responseContent);

  return { answer: responseContent };
};

export { chat };
export default chat;
