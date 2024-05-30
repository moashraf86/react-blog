import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "./PostsList";

export const Bookmarks = () => {
  /**
   * Bookmarks Query Variables
   */
  const bookmarks = {
    collection: query(collection(db, "posts"), where("bookmarked", "==", true)),
  };

  return (
    <>
      <PostsList title="Bookmarks" postsQuery={bookmarks} />
    </>
  );
};
