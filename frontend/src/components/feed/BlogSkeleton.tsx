import { Skeleton } from "../ui/Skeleton";

export const BlogSkeleton = () => {
    return (
        <div className="p-4 border-b border-slate-200 w-full max-w-xl mx-auto">
            <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-4">
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
};
