import { useParams } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/feed/BlogCard";
import { useProfile } from "../hooks";
import { useUserStore } from "../store/useUserStore";
import { api } from "../lib/axios";
import { useState, useEffect } from "react";
import { BlogSkeleton } from "../components/feed/BlogSkeleton";
import { FollowListModal } from "../components/profile/FollowListModal";

export const Profile = () => {
  const { id } = useParams();
  const { loading: profileLoading, profile, setProfile } = useProfile(id || "");
  const currentUserId = useUserStore((state) => state.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followModalType, setFollowModalType] = useState<
    "followers" | "following" | null
  >(null);

  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.isFollowing);
    }
  }, [profile]);

  const handleFollowToggle = async () => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isFollowing) {
        await api.delete(`/profile/${id}/follow`);
        setIsFollowing(false);
        if (profile) {
          setProfile({
            ...profile,
            isFollowing: false,
            _count: {
              ...profile._count,
              followers: Math.max(0, profile._count.followers - 1),
            },
          });
        }
      } else {
        await api.post(`/profile/${id}/follow`);
        setIsFollowing(true);
        if (profile) {
          setProfile({
            ...profile,
            isFollowing: true,
            _count: {
              ...profile._count,
              followers: profile._count.followers + 1,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center mt-12">
          <div className="w-full max-w-3xl px-4 md:px-8">
            <div className="animate-pulse bg-gray-200 h-32 w-full rounded-xl mb-12"></div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center mt-12">
          <div className="text-xl font-semibold text-gray-500">
            User not found.
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === profile.id;

  return (
    <div>
      <Appbar />
      <div className="flex justify-center mt-8 pb-20">
        <div className="w-full max-w-3xl px-4 md:px-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-200 pb-10">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl text-white font-medium">
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start w-full gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-500 mt-1">{profile.email}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 justify-center md:justify-start">
                  <button
                    onClick={() => setFollowModalType("followers")}
                    className="hover:underline focus:outline-none"
                  >
                    <strong className="text-gray-900">
                      {profile._count.followers}
                    </strong>{" "}
                    Followers
                  </button>
                  <button
                    onClick={() => setFollowModalType("following")}
                    className="hover:underline focus:outline-none"
                  >
                    <strong className="text-gray-900">
                      {profile._count.following}
                    </strong>{" "}
                    Following
                  </button>
                  <span>
                    <strong className="text-gray-900">
                      {profile._count.posts}
                    </strong>{" "}
                    Published
                  </span>
                </div>
              </div>
              {!isOwnProfile && currentUserId && (
                <button
                  onClick={handleFollowToggle}
                  disabled={isSubmitting}
                  className={`group px-5 py-2 w-28 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isFollowing
                      ? "border-gray-300 text-gray-800 bg-white hover:border-red-200 hover:text-red-600 hover:bg-red-50"
                      : "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <span className="block group-hover:hidden">
                        Following
                      </span>
                      <span className="hidden group-hover:block">Unfollow</span>
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Published Posts */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Published Posts</h2>

            {profile.posts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">
                  This user hasn't published any posts yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {profile.posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    authorId={post.authorId || profile.id}
                    authorName={profile.name}
                    title={post.title}
                    content={post.content}
                    publishDate={
                      post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently"
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {id && (
        <FollowListModal
          userId={id}
          type={followModalType}
          isOpen={followModalType !== null}
          onClose={() => setFollowModalType(null)}
        />
      )}
    </div>
  );
};
