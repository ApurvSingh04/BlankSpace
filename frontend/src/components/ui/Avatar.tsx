export function Avatar({ name, size = "small", imageUrl }: { name: string, size?: "small" | "large", imageUrl?: string }) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-slate-800 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
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
