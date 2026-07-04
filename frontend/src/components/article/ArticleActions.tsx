import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { api } from "../../lib/axios";

interface ArticleActionsProps {
    blogId: string;
    authorId: string;
    initialLikes: number;
    initialComments: number;
    initialIsLiked: boolean;
    initialIsBookmarked: boolean;
    onCommentClick: () => void;
}

export const ArticleActions = ({ 
    blogId, 
    authorId, 
    initialLikes, 
    initialComments, 
    initialIsLiked,
    initialIsBookmarked,
    onCommentClick 
}: ArticleActionsProps) => {
    let userId = useUserStore((state) => state.id);
    
    // Fallback: If userId is missing from store, decode it from JWT
    if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload && payload.id) {
                    userId = payload.id;
                }
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }

    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLiking, setIsLiking] = useState(false);
    
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isBookmarking, setIsBookmarking] = useState(false);

    const isAuthor = userId === authorId;

    const handleLike = async () => {
        if (isLiking || !userId) return;
        setIsLiking(true);
        // Optimistic update
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await api.post(`/blog/${blogId}/like`);
        } catch (e) {
            // Revert on error
            setIsLiked(isLiked);
            setLikes(prev => isLiked ? prev + 1 : prev - 1);
            console.error("Failed to like:", e);
        } finally {
            setIsLiking(false);
        }
    };

    const handleBookmark = async () => {
        if (isBookmarking || !userId) return;
        setIsBookmarking(true);
        // Optimistic update
        setIsBookmarked(!isBookmarked);

        try {
            await api.post(`/blog/${blogId}/bookmark`);
        } catch (e) {
            // Revert on error
            setIsBookmarked(isBookmarked);
            console.error("Failed to bookmark:", e);
        } finally {
            setIsBookmarking(false);
        }
    };

    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        try {
            const url = `${window.location.origin}/blog/${blogId}`;
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    return (
        <div className="border-t border-b border-gray-100 py-4 my-8 flex items-center justify-between text-gray-500">
            <div className="flex items-center gap-6">
                <button 
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center gap-2 hover:text-gray-900 transition-colors ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                    title="Like"
                >
                    <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    <span className="text-sm">{likes > 0 ? likes : ''}</span>
                </button>
                <button 
                    onClick={onCommentClick}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    title="Respond"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <span className="text-sm">{initialComments > 0 ? initialComments : ''}</span>
                </button>
            </div>
            <div className="flex items-center gap-5 relative">
                {isAuthor && (
                    <Link to={`/edit/${blogId}`} title="Edit Article" className="hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </Link>
                )}
                <button onClick={handleBookmark} disabled={isBookmarking} title="Bookmark" className={`hover:text-gray-900 transition-colors ${isBookmarked ? 'text-gray-900' : ''}`}>
                    <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </button>
                <div className="relative flex items-center">
                    <button onClick={handleShare} title="Share" className="hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    </button>
                    {isCopied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow whitespace-nowrap">
                            Link copied!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
