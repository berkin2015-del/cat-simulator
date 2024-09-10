import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

/*
Expected Message Object
{
    chatId: 'e9f34e10-6c34-4ba0-92cf-797e67f897f8',
    timestamp: 2024-09-10T10:54:42.189Z,
    message: item.message,
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
        this.timestamp = !isNaN(new Date(item.timestamp).getTime()) ? new Date(item.timestamp).toISOString() : new Date().toISOString();
        this.message = item.content ? item.content : {};
        this.ttl = !isNaN(new Date(item.ttl).getTime()) ? new Date(item.ttl).getTime() : Math.floor(new Date(new Date().setDate(new Date().getDate() + 1)).getTime() / 1000);
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
    let items = response.Items.map(item => unmarshall(item));
    items = items.map((item) => { return new Message(item).out() });
    return items;
};

export const putNewMessageToChat = async (chatId, message, isAssistant=false) => {
    const client = new DynamoDBClient();
    const response = await client.send(new PutItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        Item: marshall(new Message({
            chatId: chatId,
            message: message,
            timestamp: isAssistant ? new Date(new Date.setDate(new Date().getSeconds() + 3)) : new Date()
        }).out()),
    }));
    return response
};

// testing plain
// let chatId = '2c23fe40-ca04-43f8-97a3-a77a746e92f1'; 
// let count = 1
// while (true) {
//     console.log(await putNewMessageToChat(chatId, 'Message' + count, 'user'));
//     count++;
// }
// console.log('hi')
// console.log(await getPastMessagesFromChatId(chatId))