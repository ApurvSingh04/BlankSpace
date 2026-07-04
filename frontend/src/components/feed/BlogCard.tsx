import { Link } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { calculateReadingTime } from "../../utils/readingTime";
import { getExcerpt } from "../../utils/excerptFromContent";
import { formatDate } from "../../utils/formatDate";

interface BlogCardProps {
    id: string;
    authorName: string;
    title: string;
    content: string;
    publishDate?: string;
}

export const BlogCard = ({ id, authorName, title, content, publishDate }: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`} className="block w-full cursor-pointer hover:bg-slate-50 transition-colors rounded-lg">
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center">
                    <Avatar name={authorName} /> 
                    <div className="pl-2 flex items-center gap-2">
                        <div className="font-semibold text-sm text-slate-700">{authorName}</div>
                        <div className="bg-slate-500 rounded-full w-1 h-1"></div>
                        <div className="pl-1 font-normal text-xs text-slate-500">{formatDate(publishDate)}</div>
                    </div>
                </div>
                <div className="pt-2 font-bold text-xl tracking-tight">
                    {title}
                </div>
                <div className="pt-2 text-slate-600 font-serif">
                    {getExcerpt(content, 150)}
                </div>
                <div className="pt-4 font-thin text-sm text-slate-500">
                    {calculateReadingTime(content)} minute(s) read
                </div>
            </div>
        </Link>
    );
}
