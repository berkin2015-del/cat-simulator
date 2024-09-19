import { useEffect, useState } from "react";
import { getChatId } from "../components/settings";
import { getChatLogs } from "../components/api/actions";
import { StatusLoading } from "../components/api/status";

interface ChatLog {
    timestamp: number,
    role: string,
    text: string
}

export const Chat = () => {

    const chatId = getChatId();
    const [chatLog, setChatLog] = useState<ChatLog[]>([]);
    const [waitingApi, setWaitingApi] = useState(true);

    useEffect(() => {
        setChatLog([]);
        let logs = getChatLogs({ chatId: chatId });
        logs.then((l) => {
            setChatLog(l);
            setWaitingApi(false)
        });
    }, [chatId]);

    return (<>
        <div className="place-h-center">
            <h2>Chat</h2>
            {waitingApi ? <StatusLoading /> :
                <table className="settings-table">
                    <thead><tr><td>TimeStamp</td><td>Sender</td><td>Message</td></tr></thead>
                    <tbody>
                        {
                            chatLog.map((r, index) => (
                                <tr key={index}>
                                    <td>{new Date(r.timestamp * 1000).toLocaleString()}</td>
                                    <td>{r.role}</td>
                                    <td>{r.text}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    </>);
}