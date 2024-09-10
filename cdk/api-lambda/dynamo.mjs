import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export const getPastMessagesFromChatId = async (chatId) => {
    let client = new DynamoDBClient();
    let response = await client.send(new QueryCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: false,
        // AttributesToGet: ['chatId', 'timestamp', 'from', 'mesasge'],
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: {
            ":chatId": {
                "S": chatId,
            },
        },
    }));
    return response.Items;
};

let response = await getPastMessagesFromChatId('2c23fe40-ca04-43f8-97a3-a77a746e92f1');
console.log(response);