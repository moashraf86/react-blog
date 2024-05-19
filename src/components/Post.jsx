import { useContext, useEffect, useState } from "react";
import { PostsContext } from "../context/PostsContext";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader } from "./Loader";

export const Post = () => {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
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
      {!loading && (
        <div className="flex flex-col gap-2 p-4 border-zinc-800 w-full rounded-md">
          <div className="h-[120px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl text-zinc-50 font-medium capitalize">
              {post.title}
            </h2>
          </div>
          <p className="text-zinc-300">{post.content}</p>
        </div>
      )}
    </>
  );
};
