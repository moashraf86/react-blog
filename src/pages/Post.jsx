import { useContext, useEffect, useState } from "react";
import { PostsContext } from "../context/PostsContext";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader } from "./Loader";
import { PostItem } from "./PostItem";
import { Alert } from "./Alert";

export const Post = () => {
  const { posts, dispatch } = useContext(PostsContext);
  const { id } = useParams();
  const post = posts.find((post) => post.id === id) || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch single post from firebase based on the id
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postCollection = collection(db, "posts");
      const postDoc = doc(postCollection, id);
      const postSnap = await getDoc(postDoc);
      const postData = postSnap.data();
      if (!postData) throw new Error("Error fetching post");
      dispatch({ type: "FETCH_POST", payload: [postData] });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && <PostItem post={post} type="post" />}
      {error && <Alert type="error" msg={error} />}
    </>
  );
};
