import { DynamoDBClient, QueryCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"


const dynamoClient = new DynamoDBClient();

const getChatRecords = async (chatId) => {
    const response = await dynamoClient.send(new QueryCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: true,
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: { ":chatId": { "S": chatId, }, },
    }));
    return response.Items.map(item => unmarshall(item));
};

export const handler = async (event) => {

    console.log(event)

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify([{ role: 'meow', message: 'meow' }]),
    };

    try {
        const requestBody = JSON.parse(event.body);
        const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!requestBody.chatId || !chatIdRegex.test(requestBody.chatId)) {
            throw new Error("Invalid Request")
        }

        const messagesRecords = await getChatRecords(requestBody.chatId);
        if (!messagesRecords) {
            return response;
        }

        response.body = JSON.stringify(messagesRecords.map((record) => {
            return {
                role: record.message.role,
                text: record.message.role === 'assistant' ? record.message.toolResult.content[0].json.message : record.message.content[0].text,
                timestamp: record.timestamp
            };
        }));

        return response;

    } catch (error) {
        console.error(error);
        response.statusCode = 400
        return response;
    };

};
