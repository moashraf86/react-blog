import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PostsContext } from "../context/PostsContext";
import { CommentsContext } from "../context/CommentsContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { BreadCrumbs } from "../components/shared/BreadCrumbs";
import { Comments } from "../components/layout/Comments";
import { SignlePost } from "../components/layout/SinglePost";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RiErrorWarningLine } from "@remixicon/react";
export const Post = () => {
  const { posts, dispatch } = useContext(PostsContext);
  const { comments } = useContext(CommentsContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const post = posts.find((post) => post.id === id) || {};

  // fetch single post from firebase based on the id
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postCollection = collection(db, "posts");
      const postDoc = doc(postCollection, id);
      const postSnap = await getDoc(postDoc);
      const postData = postSnap.data();
      if (!postData) throw new Error("Error fetching post");
      dispatch({ type: "FETCH_POST", payload: [postData] });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="max-w-[800px] mx-auto mt-8">
      <BreadCrumbs className="px-4" />
      {loading && (
        <div className="flex flex-col gap-4 rounded-md p-4">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-full h-8" />
          <div className="w-full flex items-center gap-2 mb-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
          <Skeleton className="w-full h-96 mb-4" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <div className="flex items-center gap-3 border-t border-b py-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-32 h-2" />
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <div className={`flex w-full mb-6 sm:mb-4`}>
          <div className="relative flex flex-col  px-4 border-zinc-800 w-full rounded-md">
            <SignlePost post={post} comments={comments} />
            <Comments post={post} />
          </div>
        </div>
      )}
      {error && (
        <Alert variant="danger" className="flex items-center gap-3">
          <RiErrorWarningLine size={20} className="fill-danger" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
