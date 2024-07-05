import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "../components/layout/PostsList";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert, AlertDescription } from "../components/ui/alert";

export const Bookmarks = () => {
  const { currentUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const [bookmarksQuery, setBookmarksQuery] = useState();

  /**
   * Get Bookmarks
   */
  const getBookmarksQuery = async () => {
    if (!currentUser || isGuest) return;
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

  if (!currentUser || isGuest) {
    return (
      <Alert variant="default" className="flex items-center gap-3">
        <i className="ri-information-line text-2xl text-primary"></i>
        <AlertDescription>Please login to see your bookmarks.</AlertDescription>
      </Alert>
    );
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
