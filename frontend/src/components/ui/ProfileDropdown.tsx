import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import { useUserStore } from "../../store/useUserStore";

interface ProfileDropdownProps {
    size?: "small" | "large";
}

export const ProfileDropdown = ({ size = "large" }: ProfileDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { name, email, logout } = useUserStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleFallbackClick = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("This feature is coming soon!");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <Avatar size={size} name={name || "Anonymous"} />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-[260px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header Section */}
                    <div className="px-5 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <Avatar size="large" name={name || "Anonymous"} />
                            <div className="flex flex-col">
                                <span className="text-[15px] font-medium text-gray-900 truncate">
                                    {name || "Anonymous"}
                                </span>
                                <Link 
                                    to="#" 
                                    onClick={handleFallbackClick}
                                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    View profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Settings & Help */}
                    <div className="py-2 border-b border-gray-100">
                        <Link 
                            to="/bookmarks" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                            Bookmarks
                        </Link>
                        <Link 
                            to="#" 
                            onClick={handleFallbackClick}
                            className="flex items-center gap-3 px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Settings
                        </Link>
                        <Link 
                            to="#" 
                            onClick={handleFallbackClick}
                            className="flex items-center gap-3 px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Help
                        </Link>
                    </div>

                    {/* Member Section */}
                    <div className="py-2 border-b border-gray-100">
                        <Link 
                            to="#" 
                            onClick={handleFallbackClick}
                            className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            <span>Become a BlankSpace member</span>
                            <span className="text-yellow-400">✨</span>
                        </Link>
                        <Link 
                            to="#" 
                            onClick={handleFallbackClick}
                            className="flex items-center px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            Apply to the Partner Program
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="py-2 border-b border-gray-100">
                        <button 
                            onClick={logout}
                            className="w-full text-left px-5 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                            Sign out
                        </button>
                        <div className="px-5 pb-2 text-[13px] text-gray-500 truncate">
                            {email || "No email available"}
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="px-5 py-3 flex flex-wrap gap-x-3 gap-y-1">
                        {['About', 'Blog', 'Careers', 'Privacy', 'Terms', 'Text to speech', 'More'].map((item) => (
                            <Link 
                                key={item} 
                                to="#" 
                                onClick={handleFallbackClick}
                                className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
