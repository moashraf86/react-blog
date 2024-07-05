import { PostsList } from "../components/layout/PostsList";

import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

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
