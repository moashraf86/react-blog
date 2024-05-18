import { useContext, useEffect } from "react";
import { BookmarksContext } from "../context/BookmarksContext";
import { PostItem } from "./PostItem";
import { useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase";
import { BookmarksDispatchContext } from "../context/BookmarksDispatchContext";

export const Bookmarks = () => {
  const bookmarks = useContext(BookmarksContext);
  const bookmarksDispatch = useContext(BookmarksDispatchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /**
   * Fetch Bookmarks from the Firebase store After the component mounts
   */

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookmarksQuery = query(collection(db, "bookmarks"));
      const bookmarksSnapshot = await getDocs(bookmarksQuery);
      const bookmarksData = bookmarksSnapshot.docs.map((doc) => doc.data());
      console.log(bookmarksData);
      if (!bookmarksData) throw new Error("Error fetching bookmarks");
      bookmarksDispatch({ type: "FETCH_BOOKMARKS", payload: bookmarksData });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      <h2>Bookmarks</h2>
      <ul>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading &&
          bookmarks.map((bookmark) => (
            <PostItem key={bookmark.id} post={bookmark} />
          ))}
      </ul>
    </div>
  );
};
