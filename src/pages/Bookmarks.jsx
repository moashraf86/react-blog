import { useContext, useEffect, useState } from "react";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { PostsList } from "../components/layout/PostsList";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RiInformationLine } from "@remixicon/react";

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
        <RiInformationLine size={24} />
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
