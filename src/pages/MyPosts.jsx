import { useContext, useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { PostsList } from "../components/layout/PostsList";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RiInformationLine } from "@remixicon/react";

export const MyPosts = () => {
  const { currentUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  /**
   * Query Variables
   */
  const postsQuery = {
    collection: query(
      collection(db, "posts"),
      where("authorId", "==", `${currentUser?.id}`)
    ),
  };

  // memoize the postsList
  const memoizedPosts = useMemo(
    () => (
      <PostsList
        title={isGuest ? "Drafts" : "My Posts"}
        postsQuery={postsQuery}
        alertMsg="No Posts Added yet."
      />
    ),
    []
  );

  // If user is not logged in, show a message to login
  if (!currentUser) {
    return (
      <Alert variant="default" className="flex items-center gap-3">
        <RiInformationLine size={24} />
        <AlertDescription>Please login to see your posts.</AlertDescription>
      </Alert>
    );
  }

  return <>{memoizedPosts}</>;
};
