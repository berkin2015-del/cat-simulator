import { useEffect, useState } from "react";
import { getChatId } from "../components/settings";
import { getChatLogs, queryApi } from "../components/api/actions";
import { StatusLoading, StatusThinking } from "../components/api/status";

import '../styles/chat.css'

import { ReactNode } from "react";

interface ChatLogItems {
    timestamp: number,
    role: string,
    text: string | ReactNode
}

export const Chat = () => {

    const chatId = getChatId();
    const [chatLog, setChatLog] = useState<ChatLogItems[]>([]);
    const [waitingApi, setWaitingApi] = useState(true);
    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        const initMsgTime = Math.floor(new Date().getTime() / 1000)
        let newChatLog = [...chatLog, {
            timestamp: initMsgTime,
            role: 'human',
            text: message,
        }, {
            timestamp: initMsgTime,
            role: 'assistant',
            text: <StatusThinking />,
        }]
        setChatLog(newChatLog);
        sendApiRequest(message, newChatLog);
        setMessage('');
        localStorage.removeItem(`chat_logs_${chatId}`);
    }

    const sendApiRequest = async (msg: string, newChatLog: ChatLogItems[]) => {
        const apiResponse = await queryApi('', msg, chatId);
        const updatedChatLog = newChatLog.map((item, index) => {
            if (index === newChatLog.length - 1) {
                return { ...item, text: apiResponse.message };
            }
            return item;
        });
        setChatLog(updatedChatLog);
        localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(updatedChatLog));
    }


    useEffect(() => {
        const funcBoo = async () => {
            const cachedChatLog = localStorage.getItem(`chat_logs_${chatId}`);
            try {
                if (cachedChatLog) {
                    setChatLog(JSON.parse(cachedChatLog));
                    setWaitingApi(false);
                } else {
                    let logs = await getChatLogs({ chatId: chatId });
                    setChatLog(logs);
                    localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(logs));
                    setWaitingApi(false);
                }
            } catch (error) {
                console.error(error);
                console.warn('Chat: Dumping Cached Chat Logs');
                localStorage.removeItem(`chat_logs_${chatId}`);
                let logs = await getChatLogs({ chatId: chatId });
                setChatLog(logs);
                localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(logs));
                setWaitingApi(false);
            };
        };
        funcBoo();
    }, []);

    return (<>
        <div className="place-h-center">
            <h2>Chat</h2>
            {waitingApi ? <StatusLoading /> :
                <>
                    <table className="settings-table" style={{ maxWidth: "90vw", textAlign: 'left', marginBottom: '1em' }}>
                        <thead><tr><td>TimeStamp</td><td>Sender</td><td>Message</td></tr></thead>
                        <tbody>
                            {chatLog.map((r, index) => (
                                <tr key={index}>
                                    <td>{new Date(r.timestamp * 1000).toLocaleString()}</td>
                                    <td>{r.role === 'assistant' ? 'meow' : 'human'}</td>
                                    <td>{typeof r.text === 'string' ? <span dangerouslySetInnerHTML={{ __html: r.text }}></span> : r.text}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="send_message_box ">
                        <textarea
                            name="message"
                            placeholder="Message to sent"
                            value={message}
                            onChange={(e) => { setMessage(e.target.value) }}
                            rows={5}
                            cols={70}
                        />
                        <button onClick={handleSendMessage}>Send!</button>
                    </div>
                </>
            }
        </div>
    </>);
}