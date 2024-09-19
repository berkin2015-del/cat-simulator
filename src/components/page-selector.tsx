import { useEffect, useState } from "react";

export const PageSelector = () => {
    const [currentPage, setCurrentPage] = useState('');

    const pagePaths: Record<string, string> = {
        home: '/',
        settings: '/settings',
        chat: '/chat',
        '-': '/'
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        const currentPage = Object.keys(pagePaths).find(key => pagePaths[key] === currentPath) || '-';
        setCurrentPage(currentPage);
    }, [window.location.pathname]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPage = e.target.value;
        setCurrentPage(selectedPage);
        window.location.pathname = pagePaths[selectedPage];
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