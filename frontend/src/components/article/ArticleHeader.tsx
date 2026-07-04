import { Link } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { calculateReadingTime } from "../../utils/readingTime";
import { formatDate } from "../../utils/formatDate";

interface ArticleHeaderProps {
    title: string;
    authorName: string;
    authorId: string;
    publishDate?: string;
    content: string;
}

export const ArticleHeader = ({ title, authorName, authorId, publishDate, content }: ArticleHeaderProps) => {
    return (
        <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                {title}
            </h1>
            <Link to={`/profile/${authorId}`} className="inline-flex items-center gap-4 hover:opacity-80 transition-opacity">
                <Avatar name={authorName} size="large" />
                <div>
                    <div className="font-medium text-gray-900">{authorName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{calculateReadingTime(content)} min read</span>
                        <span className="bg-gray-300 rounded-full w-1 h-1"></span>
                        <span>{formatDate(publishDate)}</span>
                    </div>
                </div>
            </Link>
        </header>
    );
};
