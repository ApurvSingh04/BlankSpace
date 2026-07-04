import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/feed/BlogCard";
import { BlogSkeleton } from "../components/feed/BlogSkeleton";
import { useBlogs } from "../hooks";
import { EmptyState } from "../components/ui/EmptyState";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Appbar />
            <main className="flex-grow flex justify-center py-8">
                <div className="w-full max-w-2xl px-4">
                    {loading ? (
                        <>
                            <BlogSkeleton />
                            <BlogSkeleton />
                            <BlogSkeleton />
                            <BlogSkeleton />
                        </>
                    ) : blogs.length === 0 ? (
                        <EmptyState message="No blogs found. Be the first to write one!" />
                    ) : (
                        blogs.map(blog => (
                            <BlogCard 
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author.name || "Anonymous"} 
                                title={blog.title} 
                                content={blog.content} 
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};