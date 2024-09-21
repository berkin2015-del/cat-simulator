import { useEffect, useState } from "react";

export const PageSelector = () => {
    const [currentPage, setCurrentPage] = useState('');

    const pagePaths: Record<string, string> = {
        home: window.location.origin + '/',
        settings: window.location.origin + '/settings',
        chat: window.location.origin + '/chat',
        source: 'https://github.com/ltekme/cat-simulator/',
        '-': window.location.origin + '/'
    };

    useEffect(() => {
        const currentPath = window.location.href;
        const currentPage = Object.keys(pagePaths).find(key => pagePaths[key] === currentPath) || '-';
        setCurrentPage(currentPage);
    }, [window.location.href]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPage = e.target.value;
        setCurrentPage(selectedPage);
        window.location.href = pagePaths[selectedPage];
    };

    return (
        <label>
            Page:
            <select
                name="selectPage"
                multiple={false}
                value={currentPage}
                onChange={handleChange}
            >
                {Object.keys(pagePaths).map(page => (
                    <option key={page} value={page}>{page}</option>
                ))}
            </select>
        </label>
    );
};