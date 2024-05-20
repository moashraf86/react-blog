import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "./PostsList";

export const Bookmarks = () => {
  /**
   * Bookmarks Query Variables
   */
  const bookmarks = {
    collection: query(collection(db, "posts"), where("bookmarked", "==", true)),
    // query: {
    //   all: query(
    //     collection(db, "posts"),
    //     where("bookmarked", "==", true),
    //     limit(postsPerPage)
    //   ),
    //   filtered: {
    //     all: query(collection(db, "posts"), where("tag", "==", `${filterKey}`)),
    //     limited: query(
    //       collection(db, "posts"),
    //       where("tag", "==", `${filterKey}`),
    //       limit(postsPerPage)
    //     ),
    //   },
    // },
  };

  return (
    <>
      <PostsList title="Bookmarks" postsQuery={bookmarks} />
    </>
  );
};
