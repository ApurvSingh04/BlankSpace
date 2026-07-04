import { useState, useRef, useEffect } from "react";
import { useComments } from "../../hooks";
import { api } from "../../lib/axios";
import { useUserStore } from "../../store/useUserStore";

interface CommentsSectionProps {
    blogId: string;
    onCommentAdded: () => void;
}

export const CommentsSection = ({ blogId, onCommentAdded }: CommentsSectionProps) => {
    const { comments, setComments, loading } = useComments(blogId);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    let userId = useUserStore((state) => state.id);

    if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload && payload.id) userId = payload.id;
            } catch (e) {
                // Ignore
            }
        }
    }

    const handleSubmit = async () => {
        if (!newComment.trim() || !userId) return;
        setSubmitting(true);
        try {
            const response = await api.post(`/blog/${blogId}/comment`, { content: newComment });
            // Optimistically add or use backend response
            setComments([response.data.comment, ...comments]);
            setNewComment("");
            onCommentAdded();
        } catch (e) {
            console.error("Failed to add comment:", e);
        } finally {
            setSubmitting(false);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [newComment]);

    return (
        <div className="py-8 border-t border-gray-200 mt-8" id="comments-section">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Responses ({comments.length})</h3>
            
            {userId ? (
                <div className="mb-10 bg-white rounded-lg shadow-sm border border-gray-200 p-4 focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 transition-all">
                    <textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full resize-none outline-none text-gray-700 bg-transparent min-h-[60px]"
                        rows={1}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || submitting}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Responding..." : "Respond"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-10 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
                    Please log in to leave a response.
                </div>
            )}

            {loading ? (
                <div className="animate-pulse flex flex-col gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                            <div className="h-4 w-full bg-gray-100 rounded mt-2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                    {comment.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-gray-500 text-center py-4">There are currently no responses for this story. Be the first to respond.</p>
                    )}
                </div>
            )}
        </div>
    );
};
