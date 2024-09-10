import { invokeBedrock } from "./bedrock.mjs";
import { getPastMessagesFromChatId } from "./dynamo.mjs";

const { randomUUID } = require('crypto');

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
            response.body = JSON.stringify({ message: "Invalid JSON" });
            return response;
        }
        if (!requestBody.hasOwnProperty('message')) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Missing Message" });
            return response;
        };
        if (!requestBody.hasOwnProperty('chatId')) {
            response.statusCode = 400;
            response.body = JSON.stringify({ message: "Missing Chat ID" });
            return response;
        };

        let message = requestBody.message;
        let chatId = requestBody.chatId ? requestBody.chatId : randomUUID()

        let responseBody = {
            chatId: chatId,
            message: '',
            soundtracks: [],
        };

        try {
            // let response = await invokeBedrock(message);
            // response.body = JSON.stringify(response);
            // return response;
            let pastMessages = await getPastMessagesFromChatId(chatId);






        } catch (error) {
            console.error(error)
            response.body = JSON.stringify({
                message: 'Meow!',
                soundtracks: ["meow_01"]
            });
            return response
        };

    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.body = JSON.stringify({ message: "Server Error" });
        return response;
    };

};