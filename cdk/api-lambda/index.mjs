import { invokeBedrock, messagify } from "./bedrock.mjs";
import { getPastMessagesFromChatId, putNewMessageToChat } from "./dynamo.mjs";

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

    let path = event.path;
    if (path !== '/api/chat') {
        return response;
    };

    let rawRequestBody = event.body;
    if (rawRequestBody === null) {
        response.statusCode = 400;
        response.body = JSON.stringify({ message: "Missing Body Content" })
        return response;
    };

    try {
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

        let chatId = requestBody.chatId;
        if (!chatId) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Missing Chat ID" });
            return response;
        };

        let chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!chatIdRegex.test(chatId)) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Invalid Chat ID" });
            return response;
        };

        // bedrock doesn't allow empty message, don't know why it worked before but not now
        let message = requestBody.message ? requestBody.message : 'hi'
        let pastMessages;
        let filteredBedrockPastMessage;
        let bedrockResponse;

        try {
            pastMessages = await getPastMessagesFromChatId(chatId);

            // alternating user and assistant in case db is fucked
            // and account for empty message block
            let startingRole = 'user';
            filteredBedrockPastMessage = pastMessages.map((message) => {
                let role = startingRole;
                startingRole = startingRole === 'user' ? 'assistant' : 'user';
                let msg = message.message ? message.message : 'meow'
                return messagify(role, msg);
            });
            // append empty if last one has user role
            if (startingRole === 'assistant') {
                filteredBedrockPastMessage.push(messagify('assistant', 'meow'));
            };
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow!!!!',
                soundtracks: ["meow_01"]
            });
            return response
        };
        try {
            bedrockResponse = await invokeBedrock(message, filteredBedrockPastMessage);
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow! !!!',
                soundtracks: ["meow_01"]
            });
            return response
        };
        try {
            await putNewMessageToChat(chatId, message, 'user');
            await putNewMessageToChat(chatId, bedrockResponse.message, 'assistant');
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow!! !!',
                soundtracks: ["meow_01"]
            });
            return response
        };
        try {
            response.body = bedrockResponse;
            response.body.chatId = chatId;
            response.body = JSON.stringify(response.body);
            return response;
        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: '~Meow! ! !!',
                soundtracks: ["meow_01"]
            });
            return response
        }

    } catch (error) {
        console.error(error)
        response.body = JSON.stringify({
            message: '~Meow! ! ! !',
            soundtracks: ["meow_01"]
        });
        return response
    };

};