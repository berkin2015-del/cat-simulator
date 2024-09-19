import { invokeBedrock, userMessagify } from "./bedrock.mjs";
import { getChatRecords, putNewMessageToChat, updateChatMessageTTL } from "./dynamo.mjs";

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
        if (!requestBody.chatId || !chatIdRegex.test(requestBody.chatId)) {
            throw new Error("Invalid Request")
        }

        // Get old chat log
        const pastMessagesRecords = await getChatRecords(requestBody.chatId);
        const pastMessages = (pastMessagesRecords.map(record => {
            if (record.message.role === 'assistant') {
                record.message.content = [{ text: record.message.toolResult.content[0].json.message }];
                return record.message;
            }
            return record.message;
        }));

        // Call Bedrock for response
        // bedrock doesn't allow empty message, don't know why it worked before but not now
        const bedrockUserMessage = userMessagify(requestBody.message ? requestBody.message : requestBody.catMode === 'false' ? 'hi' : 'meow')
        const bedrockResponsd = await invokeBedrock(bedrockUserMessage, pastMessages, requestBody.catMode === 'false' ? false : true);
        const bedrockOutput = bedrockResponsd.message.content[0].toolUse.input;

        const bedrockResponseAssistantMessage = {
            role: 'assistant',
            toolResult: {
                toolUseId: bedrockResponsd.message.content[0].toolUse.toolUseId,
                content: [{ json: bedrockOutput }]
            }
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
            ...pastMessagesRecords.map((r) => updateChatMessageTTL(requestBody.chatId, r.timestamp, newTTLUnixEpoch))
        ];

        // Response request
        response.body = JSON.stringify({
            chatId: requestBody.chatId,
            message: bedrockOutput.message,
            soundtracks: bedrockOutput.soundtracks,
        });

        // I love async, but I want to burn it to hell
        console.log("Dynamo DB Update Invoked")
        const jobs = await Promise.all(dynamoJobPromises)
        console.log("Dynamo DB Update conpleted.");
        console.log("Total Message Count for chat\n", requestBody.chatId, 'is :\n', jobs.length);
        return response;

        // Global Catch
    } catch (error) {
        console.error(error)
        response.statusCode = 400
        return response;
    };

};