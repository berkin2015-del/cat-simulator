import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { getCatMode, getChatId, setCatMode } from "../components/settings";
import { getChatLogs, queryApi } from "../components/api/actions";
import { StatusLoading, StatusThinking } from "../components/api/status";
import { playAudio } from '../components/audio-processer'

import '../styles/chat.css'


interface ChatLogItems {
    timestamp: number,
    role: string,
    text: string | ReactNode
}

export const Chat = () => {

    const chatId: string = getChatId();
    const catMode = getCatMode();
    const [chatLog, setChatLog] = useState<ChatLogItems[]>([]);
    const [waitingApi, setWaitingApi] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const chatLogRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSendMessage = async () => {
        if (!message) {
            alert('Cannot Send Empty Message');
            return;
        }
        const initMsgTime = Math.floor(new Date().getTime() / 1000)
        let newChatLog = [...chatLog, {
            timestamp: initMsgTime,
            role: 'human',
            text: message ? message : catMode ? 'meow' : 'hi',
        }, {
            timestamp: initMsgTime,
            role: 'assistant',
            text: <StatusThinking />,
        }]
        setChatLog(newChatLog);
        localStorage.removeItem(`chat_logs_${chatId}`);
        console.debug('Chat: Sending Message\n', message, '\nWith cat_mode\n', catMode, '\non chat\n', chatId);
        const apiResponse = await queryApi('', message, chatId, catMode);
        const updatedChatLog = newChatLog.map((item, index) => {
            if (index === newChatLog.length - 1) {
                return { ...item, text: apiResponse.message };
            }
            return item;
        });
        setChatLog(updatedChatLog);
        localStorage.setItem(`chat_logs_${chatId}`, JSON.stringify(updatedChatLog));
        setMessage('');
        if (catMode) {
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
        const overideCatMode = searchParams.get('cat');
        if (overideCatMode === 'no') {
            console.log('Chat: Overiding Cat Mode to false')
            setCatMode(false)
        } else if (overideCatMode === 'yes') {
            console.log('Chat: Overiding Cat Mode to true')
            setCatMode(true)
        }
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
                                            <td>{r.role === 'assistant' ? catMode ? 'meow' : 'assistant' : catMode ? 'human' : 'user'}</td>
                                            <td>{typeof r.text === 'string' ?
                                                r.text.split("\n").map((item, idx) => (
                                                    <span key={idx}>
                                                        {item.replace(/ /g, "\u00A0")}
                                                        <br />
                                                    </span>
                                                ))
                                                : r.text}</td>
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