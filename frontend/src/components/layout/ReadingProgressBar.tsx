import { useEffect, useState } from "react";

export const ReadingProgressBar = () => {
    const [width, setWidth] = useState(0);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollHeight === clientHeight) {
            setWidth(0);
            return;
        }
        
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setWidth(scrollPercent);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
            <div 
                className="h-full bg-blue-500 transition-all duration-150 ease-out" 
                style={{ width: `${width}%` }}
            ></div>
        </div>
    );
};
