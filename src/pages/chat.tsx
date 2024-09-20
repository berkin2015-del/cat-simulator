import { useEffect, useRef, useState } from "react";
import { getCatMode, getChatId } from "../components/settings";
import { getChatLogs, queryApi } from "../components/api/actions";
import { StatusLoading, StatusThinking } from "../components/api/status";
import { playAudio } from '../components/audio-processer'

import '../styles/chat.css'

import { ReactNode } from "react";

interface ChatLogItems {
    timestamp: number,
    role: string,
    text: string | ReactNode
}

export const Chat = () => {

    const chatId: string = getChatId();
    const [chatLog, setChatLog] = useState<ChatLogItems[]>([]);
    const [waitingApi, setWaitingApi] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const chatLogRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        const initMsgTime = Math.floor(new Date().getTime() / 1000)
        let newChatLog = [...chatLog, {
            timestamp: initMsgTime,
            role: 'human',
            text: message ? message : getCatMode() ? 'meow' : 'hi',
        }, {
            timestamp: initMsgTime,
            role: 'assistant',
            text: <StatusThinking />,
        }]
        setChatLog(newChatLog);
        localStorage.removeItem(`chat_logs_${chatId}`);
        const apiResponse = await queryApi('', message, chatId);
        const updatedChatLog = newChatLog.map((item, index) => {
            if (index === newChatLog.length - 1) {
                return { ...item, text: apiResponse.message };
            }
            return item;
        });
        setChatLog(updatedChatLog);
        localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(updatedChatLog));
        setMessage('');
        if (getCatMode()) {
            for (const trackId of apiResponse.soundtracks) {
                await playAudio(trackId);
            }
        }
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

    useEffect(() => {
        chatLogRef.current ? chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight : null
    }, [chatLog])

    return (<>
        <div className="place-h-center">
            {waitingApi ? <StatusLoading /> :
                <>
                    {chatLog ?
                        <div className="chat-log-conatiner" ref={chatLogRef}>
                            <table className="settings-table">
                                <thead><tr><td>TimeStamp</td><td>Sender</td><td>Message</td></tr></thead>
                                <tbody>
                                    {chatLog.map((r, index) => (
                                        <tr key={index}>
                                            <td>{new Date(r.timestamp * 1000).toLocaleString()}</td>
                                            <td>{r.role === 'assistant' ? getCatMode() ? 'meow' : 'assistant' : getCatMode() ? 'human' : 'user'}</td>
                                            <td>{typeof r.text === 'string' ? <span>{r.text}</span> : r.text}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : null}
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
        </div >
    </>);
}