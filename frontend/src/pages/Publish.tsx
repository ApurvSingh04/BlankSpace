import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublishBlog } from "../hooks";
import { PublishBar } from "../components/editor/PublishBar";
import { Editor } from "../components/editor/Editor";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { loading, publish } = usePublishBlog();
    const navigate = useNavigate();

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) return;
        
        const { success, id } = await publish(title, content);
        if (success && id) {
            navigate(`/blog/${id}`);
        } else {
            alert("Failed to publish post.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="max-w-5xl w-full mx-auto px-4">
                <PublishBar onPublish={handlePublish} loading={loading} />
            </div>
            
            <main className="flex-grow flex justify-center pb-24">
                <div className="w-full max-w-3xl px-4 md:px-8">
                    <Editor 
                        title={title} 
                        setTitle={setTitle} 
                        content={content} 
                        setContent={setContent} 
                    />
                </div>
            </main>
        </div>
    );
};
