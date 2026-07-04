import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/feed/BlogCard";
import { BlogSkeleton } from "../components/feed/BlogSkeleton";
import { useBookmarks } from "../hooks";
import { EmptyState } from "../components/ui/EmptyState";

export const Bookmarks = () => {
    const { loading, blogs } = useBookmarks();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Appbar />
            <main className="flex-grow flex justify-center py-8">
                <div className="w-full max-w-2xl px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Your Bookmarks</h1>
                    {loading ? (
                        <>
                            <BlogSkeleton />
                            <BlogSkeleton />
                            <BlogSkeleton />
                        </>
                    ) : blogs.length === 0 ? (
                        <EmptyState message="You haven't bookmarked any stories yet." />
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
