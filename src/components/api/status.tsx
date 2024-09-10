import { useState, useEffect } from "react";

export const StatusSending = () => {
    const [trailingDot, setTrailingDot] = useState('');

    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            setTrailingDot('.'.repeat(count % 4));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (<span>Thinking{trailingDot}</span>);
};