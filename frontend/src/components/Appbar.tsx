import { Link } from "react-router-dom";
import { ProfileDropdown } from "./ui/ProfileDropdown";

export const Appbar = () => {
    return (
        <div className="border-b border-slate-200 flex justify-between items-center px-10 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <Link to="/blogs" className="font-bold text-[1.5rem] tracking-tighter cursor-pointer">
                BlankSpace
            </Link>
            
            <div className="flex items-center gap-6">
                <Link to="/post">
                    <button type="button" className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2 text-center flex items-center gap-2 transition-all">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Write
                    </button>
                </Link>
                <ProfileDropdown size="large" />
            </div>
        </div>
    );
};
