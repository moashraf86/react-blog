/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Skeleton } from "../ui/skeleton";
import { Comment } from "./Comment";
import { Alert, AlertDescription } from "../ui/alert";
import { CommentsContext } from "../../context/CommentsContext";
import { RiErrorWarningLine } from "@remixicon/react";

export const CommentList = ({ post, commentToEdit, handleDelete }) => {
  const { comments, CommentsDispatch } = useContext(CommentsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * fetch comments from firebase
   */
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const commentsQuery = query(
        collection(db, "posts", post?.id, "comments"),
        orderBy("createdAt", "desc")
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsList = commentsSnapshot.docs.map((doc) => doc.data());
      CommentsDispatch({ type: "FETCH_COMMENTS", payload: commentsList });
      setLoading(false);
      // update commentCount in the post
      await updateDoc(doc(db, "posts", post?.id), {
        commentsCount: commentsList.length,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // clear comments on unmount
    return () => {
      CommentsDispatch({ type: "RESET_COMMENTS" });
    };
  }, []);

  return (
    <div id="comments">
      <h3 className="text-primary font-bold text-xl mb-6">
        Comments ({comments?.length})
      </h3>
      {loading && (
        <div className="flex flex-col gap-4 rounded-md bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
          </div>
        </div>
      )}
      {error && (
        <Alert variant="danger" className="flex items-center gap-3">
          <RiErrorWarningLine size={20} className="fill-danger" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && comments?.length === 0 && (
        <p>No comments added yet</p>
      )}
      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            commentToEdit={commentToEdit}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
};
