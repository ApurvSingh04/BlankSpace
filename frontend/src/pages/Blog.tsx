import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { Appbar } from "../components/Appbar";
import { ArticleHeader } from "../components/article/ArticleHeader";
import { ArticleContent } from "../components/article/ArticleContent";
import { ArticleActions } from "../components/article/ArticleActions";
import { ReadingProgressBar } from "../components/layout/ReadingProgressBar";
import { Footer } from "../components/layout/Footer";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({ id: id || "" });

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
                    <ArticleActions blogId={blog.id} authorId={blog.authorId} />
                </article>
            </main>
            <Footer />
        </div>
    );
};