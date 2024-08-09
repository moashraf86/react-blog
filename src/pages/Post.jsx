import { useContext } from "react";
import { useParams } from "react-router-dom";
import { CommentsContext } from "../context/CommentsContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Comments } from "../components/layout/Comments";
import { SignlePost } from "../components/layout/SinglePost";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RiErrorWarningLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

export const Post = () => {
  const { comments } = useContext(CommentsContext);
  const { id } = useParams();

  // fetch single post from firebase based on the id
  const fetchPost = async () => {
    const postCollection = collection(db, "posts");
    const postDoc = doc(postCollection, id);
    const postSnap = await getDoc(postDoc);
    const postData = postSnap.data();
    return postData;
  };

  const useFetchPost = () => {
    return useQuery({
      queryKey: ["post", id],
      queryFn: fetchPost,
    });
  };

  const { data: post, isPending, isError, error } = useFetchPost();

  return (
    <div className="max-w-[800px] mx-auto mt-8">
      {isPending && (
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
      {post && (
        <div className={`flex w-full mb-6 sm:mb-4`}>
          <div className="relative flex flex-col  px-4 border-zinc-800 w-full rounded-md">
            <SignlePost post={post} comments={comments} />
            <Comments post={post} />
          </div>
        </div>
      )}
      {isError && (
        <Alert variant="danger" className="flex items-center gap-3">
          <RiErrorWarningLine size={20} className="fill-danger" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
