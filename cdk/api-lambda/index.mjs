import { invokeBedrock, userMessagify } from "./bedrock.mjs";
import { getPastMessagesFromChatId, putNewMessageToChat, updateChatMessageTTL } from "./dynamo.mjs";

export const handler = async (event) => {
    console.log(event)

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "~~Meow!", soundtracks: ["meow_01"] }),
    };

    try {
        const requestBody = JSON.parse(event.body);
        const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!requestBody.message || !requestBody.chatId || !chatIdRegex.test(requestBody.chatId)) {
            throw new Error("Invalid Request")
        }

        // Get old chat log
        const pastMessagesRecords = await getPastMessagesFromChatId(requestBody.chatId);
        const pastMessages = pastMessagesRecords.map(record => record.message);

        // Call Bedrock for response
        // bedrock doesn't allow empty message, don't know why it worked before but not now
        const bedrockUserMessage = userMessagify(requestBody.message || 'meow')
        const bedrockResponsd = await invokeBedrock(bedrockUserMessage, pastMessages);
        const bedrockOutput = bedrockResponsd.message.content[0].toolUse.input;

        const bedrockResponseAssistantMessage = {
            role: 'assistant',
            toolResult: {
                toolUseId: bedrockResponsd.message.content[0].toolUse.toolUseId,
                content: [{ json: bedrockOutput }]
            },
            content: [{ text: bedrockOutput.message }]
        };

        // Form Store Info
        const currentDate = new Date()
        const newTTL = new Date(currentDate).setSeconds(currentDate.getSeconds() + (60 * 60 * 24 * 3)) // New ttl for 3 days
        const currentUnixEpoch = Math.floor(currentDate / 1000);
        const newTTLUnixEpoch = Math.floor(newTTL / 1000);

        // Write new Messages to chat log and update ttl for old ones
        const dynamoJobPromises = [
            putNewMessageToChat(requestBody.chatId, bedrockUserMessage, currentUnixEpoch, newTTLUnixEpoch),
            putNewMessageToChat(requestBody.chatId, bedrockResponseAssistantMessage, currentUnixEpoch, newTTLUnixEpoch),
            ...pastMessagesRecords.map((r) => { updateChatMessageTTL(requestBody.chatId, r.timestamp, newTTLUnixEpoch) })
        ];

        console.log("Dynamo DB Update Invoked")
        await Promise.all(dynamoJobPromises);
        console.log("Dynamo DB Update conpleted");

        // Response request
        response.body = JSON.stringify({
            chatId: requestBody.chatId,
            message: bedrockOutput.message,
            soundtracks: bedrockOutput.soundtracks,
        });

        // Global Catch
    } catch (error) {
        console.error(error)
        response.statusCode = 400
        return response;
    };

    return response

};