import { PostsList } from "./PostsList";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";

export const MyPosts = () => {
  const { currentUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  /**
   * Query Variables
   */
  const postsQuery = {
    collection: query(
      collection(db, "posts"),
      where("authorId", "==", `${currentUser?.id}`)
    ),
  };

  // If user is not logged in, show a message to login
  if (!currentUser) {
    return (
      <Alert variant="default" className="flex items-center gap-3">
        <i className="ri-information-line text-2xl text-primary"></i>
        <AlertDescription>Please login to see your posts.</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <PostsList
        title={isGuest ? "Drafts" : "My Posts"}
        postsQuery={postsQuery}
        alertMsg="You have not created any posts yet."
      />
    </>
  );
};
