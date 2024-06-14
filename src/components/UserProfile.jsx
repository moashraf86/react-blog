import { useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDoc, doc } from "@firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "./PostsList";
import { useEffect } from "react";

export const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const { id } = useParams();

  //Fetch User Name from firestore
  const getUser = async () => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    setUserName(userSnap.data().name);
  };

  useEffect(() => {
    getUser();
  }, [userName]);

  // change the url when the user name is fetched
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

  return (
    <PostsList
      title={userName ? userName + "'s Posts" : "Loading..."}
      postsQuery={posts}
      alertMsg="No Posts Added yet."
    />
  );
};
