interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishDate: string;
}

export function Avatar({ name, size = "small", imageUrl }: { name: string, size?: "small" | "large", imageUrl?: string }) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-slate-800 rounded-full ${size === "small" ? "w-6 h-6   " : "w-10 h-10"}`}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className={`${size === "small" ? "text-xs" : "text-md"} font-medium text-slate-300`}>
                    {name[0]?.toUpperCase() || "?"}
                </span>
            )}
        </div>
    );
}

export const BlogCard = ({authorName, title, content, publishDate}: BlogCardProps)=>{
    return <div className="p-4 border-b border-slate-200 cursor-pointer">
        <div className="flex items-center">
            <Avatar name={authorName}/> 
            <div className="pl-2 flex items-center gap-2">
                <div className="font-semibold text-sm text-slate-700">{authorName}</div>
                <div className="bg-slate-500 rounded-full w-1 h-1"></div>
                <div className="pl-1 font-normal text-xs text-slate-500">{publishDate}</div>
            </div>
        </div>
        <div className="pt-2 font-bold text-xl">
            {title}
        </div>
        <div className="pt-2 text-slate-600">
            {content.length > 100 ? content.slice(0, 100) + "..." : content}
        </div>
        <div className="pt-4 font-thin text-sm text-slate-500">
            {Math.ceil(content.length / 100)} minute(s) read
        </div>
    </div>
}
