import { useEffect, useState } from "react";
import { getChatId } from "../components/settings";
import { getChatLogs } from "../components/api/actions";
import { StatusLoading } from "../components/api/status";

import '../styles/chat.css'
import { json } from "stream/consumers";

interface ChatLog {
    timestamp: number,
    role: string,
    text: string
}

export const Chat = () => {

    const chatId = getChatId();
    const [chatLog, setChatLog] = useState<ChatLog[]>([]);
    const [waitingApi, setWaitingApi] = useState(true);
    const [waitingNewMessage, setWaitingNewMessage] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {

    }

    useEffect(() => {
        const funcBoo = async () => {
            const cachedChatLog = localStorage.getItem(`chat_logs_${chatId}`);
            try {
                if (cachedChatLog) {
                    setChatLog(JSON.parse(cachedChatLog));
                } else {
                    let logs = await getChatLogs({ chatId: chatId });
                    setChatLog(logs);
                    localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(logs));
                    setWaitingApi(false);
                }
            } catch (error) {
                console.error(error);
                console.warn('Dumping Cached Chat Logs');
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
                                    <td>{r.role}</td>
                                    <td>{r.text}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="send_message_box ">
                        <textarea
                            name="message"
                            placeholder="Message to sent"
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