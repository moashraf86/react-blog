import { PostsList } from "./PostsList";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Alert } from "./Alert";

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
    return <Alert type="default" msg="Please login to see your posts." />;
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
