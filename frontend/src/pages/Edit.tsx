import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog, useEditBlog } from "../hooks";
import { PublishBar } from "../components/editor/PublishBar";
import { Editor } from "../components/editor/Editor";
import { Skeleton } from "../components/ui/Skeleton";
import { useUserStore } from "../store/useUserStore";

export const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let userId = useUserStore((state) => state.id);

  // Fallback: If userId is missing from store (e.g. user hasn't re-logged in), decode it from JWT
  if (!userId) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload && payload.id) {
          userId = payload.id;
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }

  const { loading: fetchLoading, blog } = useBlog({ id: id || "" });
  const { loading: updateLoading, update } = useEditBlog();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Populate editor once blog is fetched
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  // Security check: bounce user if they are not the author
  useEffect(() => {
    if (!fetchLoading && blog && userId) {
      if (blog.authorId !== userId) {
        alert("You are not authorized to edit this post.");
        navigate(`/blog/${id}`);
      }
    }
  }, [fetchLoading, blog, userId, navigate, id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !id) return;

    const { success } = await update(id, title, content);
    if (success) {
      navigate(`/blog/${id}`);
    } else {
      alert("Failed to update post.");
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="max-w-5xl w-full mx-auto px-4">
          <PublishBar onPublish={() => {}} loading={true} buttonText="Update" />
        </div>
        <main className="flex-grow flex justify-center pb-24 pt-10">
          <div className="w-full max-w-3xl px-4 md:px-8">
            <Skeleton className="h-16 w-3/4 mb-8 bg-slate-100" />
            <Skeleton className="h-4 w-full mb-2 bg-slate-100" />
            <Skeleton className="h-4 w-full mb-2 bg-slate-100" />
            <Skeleton className="h-4 w-5/6 bg-slate-100" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="max-w-5xl w-full mx-auto px-4">
        <PublishBar
          onPublish={handleUpdate}
          loading={updateLoading}
          buttonText="Update"
        />
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
