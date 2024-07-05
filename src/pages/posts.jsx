import { collection, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { PostsList } from "../components/layout/PostsList";

export const Posts = () => {
  /**
   * Query Variables
   */
  const posts = {
    collection: query(collection(db, "posts"), where("published", "==", true)),
  };

  return (
    <>
      <PostsList
        title="All posts"
        postsQuery={posts}
        alertMsg="No Posts Added yet."
      />
    </>
  );
};
