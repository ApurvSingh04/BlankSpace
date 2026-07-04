import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { Appbar } from "../components/Appbar";
import { ArticleHeader } from "../components/article/ArticleHeader";
import { ArticleContent } from "../components/article/ArticleContent";
import { ArticleActions } from "../components/article/ArticleActions";
import { CommentsSection } from "../components/article/CommentsSection";
import { ReadingProgressBar } from "../components/layout/ReadingProgressBar";
import { Footer } from "../components/layout/Footer";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { useState, useEffect } from "react";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({ id: id || "" });
    const [commentsCount, setCommentsCount] = useState(0);

    useEffect(() => {
        if (blog) {
            setCommentsCount(blog._count?.comments || 0);
        }
    }, [blog]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Appbar />
                <main className="flex-grow flex justify-center pt-12 pb-24">
                    <div className="w-full max-w-3xl px-4 md:px-8">
                        <Skeleton className="h-12 w-3/4 mb-6" />
                        <div className="flex items-center gap-4 mb-12">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-8" />
                    </div>
                </main>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Appbar />
                <EmptyState message="Blog post not found." />
            </div>
        );
    }

    const handleCommentClick = () => {
        const el = document.getElementById("comments-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            const textarea = el.querySelector("textarea");
            if (textarea) {
                setTimeout(() => textarea.focus(), 500); // Wait for scroll
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <ReadingProgressBar />
            <Appbar />
            <main className="flex-grow flex justify-center pt-12 pb-24">
                <article className="w-full max-w-3xl px-4 md:px-8">
                    <ArticleHeader 
                        title={blog.title} 
                        authorName={blog.author.name || "Anonymous"} 
                        content={blog.content} 
                    />
                    <ArticleContent content={blog.content} />
                    <ArticleActions 
                        blogId={blog.id} 
                        authorId={blog.authorId} 
                        initialLikes={blog._count?.likes || 0}
                        initialComments={commentsCount}
                        initialIsLiked={Array.isArray(blog.likes) && blog.likes.length > 0}
                        initialIsBookmarked={Array.isArray(blog.bookmarks) && blog.bookmarks.length > 0}
                        onCommentClick={handleCommentClick}
                    />
                    <CommentsSection 
                        blogId={blog.id} 
                        onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                    />
                </article>
            </main>
            <Footer />
        </div>
    );
};