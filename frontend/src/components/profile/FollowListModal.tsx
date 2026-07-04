import { Link } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { useFollowData, type FollowUser } from "../../hooks";

import { api } from "../../lib/axios";
import { Modal } from "../ui/Modal";
import { useUserStore } from "../../store/useUserStore";

interface FollowListModalProps {
    userId: string;
    type: "followers" | "following" | null;
    isOpen: boolean;
    onClose: () => void;
}

export const FollowListModal = ({ userId, type, isOpen, onClose }: FollowListModalProps) => {
    const { loading, users, setUsers } = useFollowData(userId, type);
    const currentUserId = useUserStore((state) => state.id);

    const title = type === "followers" ? "Followers" : "Following";

    const handleFollowToggle = async (targetUser: FollowUser) => {
        if (!currentUserId || targetUser.id === currentUserId) return;
        
        const isFollowing = targetUser.isFollowing;
        
        try {
            if (isFollowing) {
                await api.delete(`/profile/${targetUser.id}/follow`);
                setUsers(users.map(u => u.id === targetUser.id ? { ...u, isFollowing: false } : u));
            } else {
                await api.post(`/profile/${targetUser.id}/follow`);
                setUsers(users.map(u => u.id === targetUser.id ? { ...u, isFollowing: true } : u));
            }
        } catch (error) {
            console.error("Error toggling follow in modal:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No {type} found.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <Link 
                                to={`/profile/${user.id}`} 
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-1"
                                onClick={onClose}
                            >
                                <Avatar name={user.name || "?"} />
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                </div>
                            </Link>
                            
                            {currentUserId && currentUserId !== user.id && (
                                <button 
                                    onClick={() => handleFollowToggle(user)}
                                    className={`ml-2 group px-4 py-1.5 w-24 rounded-full text-xs font-medium transition-all duration-200 border ${
                                        user.isFollowing 
                                            ? "border-gray-300 text-gray-800 bg-white hover:border-red-200 hover:text-red-600 hover:bg-red-50" 
                                            : "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                                    }`}
                                >
                                    {user.isFollowing ? (
                                        <>
                                            <span className="block group-hover:hidden">Following</span>
                                            <span className="hidden group-hover:block">Unfollow</span>
                                        </>
                                    ) : (
                                        "Follow"
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};
