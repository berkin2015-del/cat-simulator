import { invokeBedrock, userMessagify } from "./bedrock.mjs";
import { getPastMessagesFromChatId, putNewMessageToChat, updateChatTTL } from "./dynamo.mjs";

export const handler = async (event) => {
    console.log(event)

    let response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Hello, World!" }),
    };

    const path = event.path;
    if (path !== '/api/chat') {
        return response;
    };

    const rawRequestBody = event.body;
    if (rawRequestBody === null) {
        response.statusCode = 400;
        response.body = JSON.stringify({ message: "Missing Body Content" })
        return response;
    };

    try {

        // Request Precheck
        let requestBody;
        try {
            requestBody = JSON.parse(rawRequestBody);
        } catch (error) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Invalid Request" });
            return response;
        };

        if (!requestBody.hasOwnProperty('message')) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Missing Message" });
            return response;
        };

        const chatId = requestBody.chatId;
        if (!chatId) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Missing Chat ID" });
            return response;
        };

        const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!chatIdRegex.test(chatId)) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Invalid Chat ID" });
            return response;
        };

        // bedrock doesn't allow empty message, don't know why it worked before but not now
        const newMessage = requestBody.message ? requestBody.message : 'hi'

        // Get old chat log
        let pastMessagesRecord;
        let pastMessages = [];
        try {
            pastMessagesRecord = await getPastMessagesFromChatId(chatId);
            console.log('Got From Dynamo\n', JSON.stringify(pastMessagesRecord));
            pastMessagesRecord.forEach(record => {
                if (record.message) {
                    pastMessages.push(record.message);
                };
            });
            console.log('Got Pass Messages', JSON.stringify(pastMessagesRecord));
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow!!!!',
                soundtracks: ["meow_01"]
            });
            return response;
        };

        // Call Bedrock for response
        const bedrockUserMessage = userMessagify(newMessage)
        let bedrockResponseAssistantMessage;
        let bedrockOutput;
        try {
            let respond = await invokeBedrock(bedrockUserMessage, pastMessages);
            bedrockOutput = respond.message.content[0].toolUse.input;
            let toolUseId = respond.message.content[0].toolUse.toolUseId;
            bedrockResponseAssistantMessage = {
                role: 'assistant',
                toolResult: {
                    toolUseId: toolUseId,
                    content: [{ json: bedrockOutput }]
                },
                content: [{ text: bedrockOutput.message }]
            };
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow! !!!',
                soundtracks: ["meow_01"]
            });
            return response;
        };

        const currentDate = new Date()
        const newTTL = new Date(currentDate).setSeconds(currentDate.getSeconds() + 60 * 60 * 24 * 3) // New ttl for 3 days
        const currentUnixEpoch = Math.floor(currentDate / 1000);
        const newTTLUnixEpoch = Math.floor(newTTL / 1000);

        // Write new Messages to chat log
        try {
            putNewMessageToChat(chatId, bedrockUserMessage, currentUnixEpoch, newTTLUnixEpoch);
            console.log('User message inserted');
            putNewMessageToChat(chatId, bedrockResponseAssistantMessage, currentUnixEpoch, newTTLUnixEpoch);
            console.log('Assistant message inserted');
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow!! !!',
                soundtracks: ["meow_01"]
            });
            return response;
        };

        // try {
        //     await updateChatMessageTTL(chatId, timestamp)
        // } catch (error) {
        //     console.error(error)
        //     response.body = JSON.stringify({
        //         message: '~Meow!! !!',
        //         soundtracks: ["meow_01"]
        //     });
        //     return response;
        // }


        // Response request
        try {
            response.body = JSON.stringify({
                chatId: chatId,
                message: bedrockOutput.message,
                soundtracks: bedrockOutput.soundtracks,
            });
            return response;;
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow! ! !!',
                soundtracks: ["meow_01"]
            });
            return response;
        }

        // Global Catch
    } catch (error) {
        console.error(error)
        response.body = JSON.stringify({
            message: '~Meow! ! ! !',
            soundtracks: ["meow_01"]
        });
        return response;
    };

};