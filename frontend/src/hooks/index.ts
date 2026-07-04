import { useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Blog {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt?: string;
    author: {
        name: string;
    };
    _count?: {
        likes: number;
        comments: number;
    };
    likes?: { userId: string }[];
    bookmarks?: { userId: string }[];
}

export const useBlogs = (page = 1, limit = 10) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        api.get(`/blog/bulk?page=${page}&limit=${limit}`)
            .then(response => {
                setBlogs(response.data.posts);
                setTotal(response.data.pagination.total);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blogs:", error);
                setLoading(false);
            });
    }, [page, limit]);

    return { loading, blogs, total };
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/blog/${id}`)
            .then(response => {
                setBlog(response.data.post);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching single blog:", error);
                setLoading(false);
            });
    }, [id]);

    return { loading, blog };
}

export const usePublishBlog = () => {
    const [loading, setLoading] = useState(false);
    
    const publish = async (title: string, content: string) => {
        setLoading(true);
        try {
            const response = await api.post("/blog", {
                title,
                content,
                published: true
            });
            setLoading(false);
            return { success: true, id: response.data.id };
        } catch (error) {
            setLoading(false);
            console.error("Error publishing blog:", error);
            return { success: false, id: null };
        }
    }

    return { loading, publish };
}

export const useEditBlog = () => {
    const [loading, setLoading] = useState(false);
    
    const update = async (id: string, title: string, content: string) => {
        setLoading(true);
        try {
            const response = await api.put("/blog", {
                id,
                title,
                content
            });
            setLoading(false);
            return { success: true, id: response.data.id };
        } catch (error) {
            setLoading(false);
            console.error("Error updating blog:", error);
            return { success: false, id: null };
        }
    }

    return { loading, update };
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
    };
}

export const useComments = (blogId: string) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!blogId) return;
        setLoading(true);
        api.get(`/blog/${blogId}/comments`)
            .then(response => {
                setComments(response.data.comments);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
                setLoading(false);
            });
    }, [blogId]);

    return { loading, comments, setComments };
}

export const useBookmarks = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        setLoading(true);
        api.get('/blog/bookmarks')
            .then(response => {
                setBlogs(response.data.posts);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching bookmarks:", error);
                setLoading(false);
            });
    }, []);

    return { loading, blogs };
}

export interface Profile {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    isFollowing: boolean;
    _count: {
        followers: number;
        following: number;
        posts: number;
    };
    posts: Blog[];
}

export const useProfile = (userId: string) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        if (!userId || userId === "undefined") return;
        setLoading(true);
        api.get(`/profile/${userId}`)
            .then(response => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                setLoading(false);
            });
    }, [userId]);

    return { loading, profile, setProfile };
}

export interface FollowUser {
    id: string;
    name: string;
    email: string;
    isFollowing: boolean;
}

export const useFollowData = (userId: string, type: "followers" | "following" | null) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<FollowUser[]>([]);

    useEffect(() => {
        if (!userId || !type) {
            setUsers([]);
            return;
        }
        setLoading(true);
        api.get(`/profile/${userId}/${type}`)
            .then(response => {
                setUsers(response.data.users || []);
                setLoading(false);
            })
            .catch(error => {
                console.error(`Error fetching ${type}:`, error);
                setLoading(false);
                setUsers([]);
            });
    }, [userId, type]);

    return { loading, users, setUsers };
}