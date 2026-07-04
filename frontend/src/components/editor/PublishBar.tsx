import { Link } from "react-router-dom";
import { ProfileDropdown } from "../ui/ProfileDropdown";
import { Button } from "../ui/Button";
import { useUserStore } from "../../store/useUserStore";

interface PublishBarProps {
    onPublish: () => void;
    loading: boolean;
    buttonText?: string;
}

export const PublishBar = ({ onPublish, loading, buttonText = "Publish" }: PublishBarProps) => {
    const name = useUserStore((state) => state.name);
    return (
        <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
                <Link to="/blogs" className="font-bold text-2xl tracking-tighter cursor-pointer">
                    BlankSpace
                </Link>
                <span className="text-sm text-gray-400">Draft in {name || "Anonymous"}</span>
            </div>
            
            <div className="flex items-center gap-6">
                <Button 
                    onClick={onPublish} 
                    disabled={loading}
                    variant="primary" 
                    className="px-6 py-1.5"
                >
                    {loading ? (buttonText === "Publish" ? "Publishing..." : "Updating...") : buttonText}
                </Button>
                <button className="text-gray-500 hover:text-gray-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                </button>
                <ProfileDropdown size="small" />
            </div>
        </div>
    );
};
