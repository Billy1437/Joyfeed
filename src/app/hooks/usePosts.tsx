import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";
import { useEffect, useState } from "react";

export interface PostUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  description?: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  profiles?: PostUser;
}

export const usePosts = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(
          `*,
            profiles(id,name,username,profile_image_uri)
            `,
        )
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error loading posts", postsError);
        return;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      const postsWithProfies = postsData.map((post) => ({
        ...post,
        profiles: post.profiles || null,
      }));

      setPosts(postsWithProfies);
    } catch (error) {
      console.error("Error in loading posts", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (image_uri: string, description?: string) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    try {
      // deactivate any existing post of user

      const { error: deactivateError } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (deactivateError) {
        console.error("Error deactivating posts", deactivateError);
        return;
      }

      const postImageUrl = await uploadPostImage(user.id, image_uri);

      // CALCULATE EXPIRATION TIME
      const now = new Date();
      const expires_at = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: postImageUrl,
          description: description || null,
          expires_at: expires_at.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating post", error);
        throw error;
      }

      await loadPosts();
    } catch (error) {
      console.error("Error creating post", error);
      throw error;
    }
  };

  return {
    createPost,
    posts,
  };
};
