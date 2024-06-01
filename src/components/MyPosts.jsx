import { PostsList } from "./PostsList";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Alert } from "./Alert";

export const MyPosts = () => {
  const { currentUser } = useContext(AuthContext);
  /**
   * Query Variables
   */
  const posts = {
    collection: query(
      collection(db, "posts"),
      where("autherId", "==", `${currentUser?.uid}`)
    ),
  };
  // If user is not logged in, show a message to login
  if (!currentUser) {
    return <Alert alertMsg="Please login to see your posts." />;
  }

  return (
    <>
      <PostsList
        title="My posts"
        postsQuery={posts}
        alertMsg="You have not created any posts yet."
      />
    </>
  );
};
