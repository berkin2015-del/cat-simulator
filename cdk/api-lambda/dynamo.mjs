import { DynamoDBClient, QueryCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

/*
Expected Message Object
{
    chatId: 'e9f34e10-6c34-4ba0-92cf-797e67f897f8',
    timestamp: 1725965682,
    message: bedrock message object,
    ttl: 1725965682,

    if ttl is not specified, will set to one dat later
    if no sender or invalid sender, set to user
}
*/

export class Message {
    chatId;
    timestamp;
    message;
    ttl;
    constructor(item) {
        this.chatId = item.chatId;
        this.timestamp = item.timestamp;
        this.message = item.message ? item.message : {};
        this.ttl = item.ttl
    }
    out = () => {
        return {
            chatId: this.chatId,
            timestamp: this.timestamp,
            message: this.message,
            ttl: this.ttl,
        }
    }
}

export const getPastMessagesFromChatId = async (chatId) => {
    const client = new DynamoDBClient();
    const response = await client.send(new QueryCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: true,
        KeyConditionExpression: 'chatId = :chatId',
        ExpressionAttributeValues: {
            ":chatId": {
                "S": chatId,
            },
        },
    }));
    // console.log('Past Messages From Dynamo DB\n', JSON.stringify(response));
    let items = [];

    for (let item of response.Items) {
        let unmarshalledItem = unmarshall(item);
        let message = new Message(unmarshalledItem).out();
        items.push(message);
    }

    return items;
};

export const putNewMessageToChat = async (chatId, message, timestamp, ttl) => {
    const isAssistant = message.role === 'assistant' ? true : false
    const client = new DynamoDBClient();
    const response = await client.send(new PutItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        ScanIndexForward: true,
        Item: marshall(new Message({
            chatId: chatId,
            message: message,
            timestamp: isAssistant ? timestamp + 1 : timestamp,
            ttl: ttl
        }).out()),
    }));
    // console.log('Put New Message to Dynamo DB Resault\n', response);
    return response
};

// testing plain
// let chatId = '2c23fe40-ca04-43f8-97a3-a77a746e92f1';
// let response = await putNewMessageToChat(chatId, {
//     role: 'assistant',
//     toolResult: {
//         toolUseId: 'abcdefg',
//         content: [{ json: { message: 'hi', soundtracks: ['meow'] } }]
//     },
//     content: [{ text: { message: 'hi', soundtracks: ['meow'] }.message }]
// }, false);

// let response2 = await getPastMessagesFromChatId(chatId);
// console.log(JSON.stringify(response2))

export const updateChatMessageTTL = async (chatId, timestamp, newTTL) => {
    const client = new DynamoDBClient();
    const respond = await client.send(new UpdateItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        Key: marshall({
            chatId: chatId,
            timestamp: timestamp,
        }),
        ExpressionAttributeNames: {
            '#ttlAttr': 'ttl',
        },
        ExpressionAttributeValues: {
            ':newTTL': { S: newTTL.toString() },
        },
        UpdateExpression: "SET #ttlAttr = :newTTL",
    }));
    // console.log('Update Messages in Dynamo DB Resault:\n', respond);
    return respond
}

// test
// let respond = updateChatMessageTTL('ed0dab52-040c-4107-8b22-606165ff2fe7', 1726570610, 172689900)
// console.log(respond);


// TODO: Delete Chat
// export const deleteChat = async (chatId)