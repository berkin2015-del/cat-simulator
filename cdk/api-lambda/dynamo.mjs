import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import pkg from 'aws-sdk';
const { DynamoDB } = pkg;

/*
Expected Message Object
{
    chatId: '2c23fe40-ca04-43f8-97a3-a77a746e92f1',
    timestamp: 2024-09-10T10:54:42.189Z,
    sender: item.sender ===  ? item.sender : 'user',
    message: item.message,
    ttl: 1725965682,
}
*/
export class Message {
    chatId;
    timestamp;
    sender;
    message;
    ttl;
    constructor(item) {
        this.chatId = item.chatId;
        this.timestamp = !isNaN(new Date(item.timestamp).getTime()) ? new Date(item.timestamp) : new Date();
        this.sender = item.sender === 'assistant' ? 'assistant' : 'user';
        this.message = item.message ? item.message : '';
        this.ttl = !isNaN(new Date(item.ttl).getTime()) ? new Date(item.ttl) : new Date().setDate(new Date().getDate() + 1);
    }
    out = () => {
        return {
            chatId: this.chatId,
            timestamp: this.timestamp,
            sender: this.sender,
            message: this.message,
            ttl: this.ttl,
        }
    }
}

export const getPastMessagesFromChatId = async (chatId) => {
    const client = new DynamoDBClient();
    const response = await client.send(new QueryCommand({
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
    let items = response.Items.map(item => DynamoDB.Converter.unmarshall(item));
    items = items.map((item) => { return new Message(item).out() });
    return items;
};

export const putNewMessageToChat = async (chatId, message, from) => {
    const date = new Date()
    const client = new DynamoDBClient();
    const response = await client.send(new PutItemCommand({
        TableName: process.env.CHAT_TABLE_NAME,
        Item: DynamoDB.Converter.marshall({
            chatId: chatId,
            timestamp: date.toISOString()
        })
    }));

};

let response = await getPastMessagesFromChatId('2c23fe40-ca04-43f8-97a3-a77a746e92f1');
console.log(response);