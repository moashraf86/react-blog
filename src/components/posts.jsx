import { PostsList } from "./PostsList";

import { collection } from "firebase/firestore";
import { db } from "../firebase";

export const Posts = () => {
  /**
   * Query Variables
   */
  const posts = {
    collection: collection(db, "posts"),
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
