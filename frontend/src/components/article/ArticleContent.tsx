export const ArticleContent = ({ content }: { content: string }) => {
    return (
        <div className="prose prose-lg prose-slate max-w-none font-serif leading-relaxed text-gray-800">
            {/* Split by double newline to simulate paragraphs for now */}
            {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                    {paragraph}
                </p>
            ))}
        </div>
    );
};
