interface EditorProps {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
}

export const Editor = ({ title, setTitle, content, setContent }: EditorProps) => {
    return (
        <div className="flex flex-col w-full mt-10">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-5xl font-bold tracking-tight text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 mb-8 bg-transparent"
                autoFocus
            />
            <textarea
                placeholder="Tell your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xl font-serif leading-relaxed text-gray-800 placeholder:text-gray-400 border-none outline-none focus:ring-0 resize-none min-h-[500px] bg-transparent"
            />
        </div>
    );
};
