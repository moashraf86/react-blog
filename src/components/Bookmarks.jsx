import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "./PostsList";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "./Alert";

export const Bookmarks = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookmarksQuery, setBookmarksQuery] = useState();

  /**
   * Get Bookmarks
   */
  const getBookmarksQuery = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.id);
    const userSnap = await getDoc(userRef);
    const userBookmarks = userSnap.data()?.bookmarks || [];
    if (userBookmarks.length === 0) {
      setBookmarksQuery(null);
      return;
    }
    const bookmarksQuery = {
      collection: query(
        collection(db, "posts"),
        where("id", "in", userBookmarks)
      ),
    };
    setBookmarksQuery(bookmarksQuery);
  };

  useEffect(() => {
    getBookmarksQuery();
  }, []);

  if (!currentUser) {
    return <Alert type="default" msg="Please login to see your bookmarks." />;
  }

  return (
    <>
      <PostsList
        title="Bookmarks"
        postsQuery={bookmarksQuery}
        alertMsg="No Added Bookmarks"
      />
    </>
  );
};
