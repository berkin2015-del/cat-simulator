import { DynamoDBClient, QueryCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

/*
Expected Message Object
{
    chatId: 'e9f34e10-6c34-4ba0-92cf-797e67f897f8',
    timestamp: 1725965682,
    message: bedrock message object,
    ttl: 1725965682,
}
*/

const client = new DynamoDBClient();

export const getPastMessagesFromChatId = async (chatId) => {
    const response = await client.send(new QueryCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: true,
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: { ":chatId": { "S": chatId, }, },
    }));
    return response.Items.map(item => unmarshall(item));
};

export const putNewMessageToChat = async (chatId, message, timestamp, ttl) => {
    return client.send(new PutItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: true,
        Item: marshall({
            chatId: chatId,
            message: message,
            timestamp: message.role === 'assistant' ? timestamp + 1 : timestamp,
            ttl: ttl
        }),
    }));
};

export const updateChatMessageTTL = async (chatId, timestamp, newTTL) => {
    // console.log('updating ', chatId, ': ', timestamp);
    return client.send(new UpdateItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        Key: marshall({
            chatId: chatId,
            timestamp: timestamp,
        }),
        ExpressionAttributeNames: { '#ttl': 'ttl', },
        ExpressionAttributeValues: { ':ttl': { S: newTTL.toString() }, },
        UpdateExpression: "SET #ttl = :ttl",
    }));
};