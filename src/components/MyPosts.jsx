import { PostsList } from "./PostsList";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const MyPosts = () => {
  const { authentication } = useContext(AuthContext);
  const autherId = authentication.user?.userId || "";
  /**
   * Query Variables
   */
  const posts = {
    collection: query(
      collection(db, "posts"),
      where("autherId", "==", autherId)
    ),
  };
  // If user is not logged in, show a message to login
  if (!autherId) {
    return <PostsList alertMsg="Please login to see your posts." />;
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
