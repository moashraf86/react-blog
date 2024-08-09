import { useContext } from "react";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { PostsList } from "../components/layout/PostsList";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RiInformationLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

export const Bookmarks = () => {
  const { currentUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;

  /**
   * Get Bookmarks
   */
  const getBookmarksQuery = async () => {
    if (!currentUser || isGuest) return;
    const userRef = doc(db, "users", currentUser.id);
    const userSnap = await getDoc(userRef);
    const userBookmarks = userSnap.data()?.bookmarks || [];
    const bookmarksQuery = {
      collection: query(
        collection(db, "posts"),
        where("id", "in", userBookmarks)
      ),
    };
    return bookmarksQuery;
  };

  const useFetchBookmarks = () => {
    return useQuery({
      queryKey: ["bookmarks", currentUser.id],
      queryFn: getBookmarksQuery,
    });
  };

  const { data: posts } = useFetchBookmarks();

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
        postsQuery={posts}
        alertMsg="No Added Bookmarks"
      />
    </>
  );
};
