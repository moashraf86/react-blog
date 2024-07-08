import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDoc, doc } from "@firebase/firestore";
import { db } from "../utils/firebase";
import { PostsList } from "../components/layout/PostsList";

export const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const { id } = useParams();

  //Fetch User Name from firestore
  const getUser = async () => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserName(userSnap.data().name);
    } else {
      setUserName("User Not Found");
    }
  };

  useEffect(() => {
    getUser();
  }, [userName]);

  // Update the URL
  history.pushState({}, "", `/users/${userName}`);

  /**
   * Query Variables
   */
  const posts = {
    collection: query(
      collection(db, "posts"),
      where("authorId", "==", `${id}`)
    ),
  };

  // memoize the posts query
  const memoizedPosts = useMemo(
    () => (
      <PostsList
        title={userName ? userName + "'s Posts" : "Loading..."}
        postsQuery={posts}
        alertMsg="No Posts Added yet."
      />
    ),
    []
  );

  return <>{memoizedPosts}</>;
};
